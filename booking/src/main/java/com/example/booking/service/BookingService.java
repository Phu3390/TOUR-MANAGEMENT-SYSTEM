package com.example.booking.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.example.booking.client.TourClient;
import com.example.booking.dto.request.BookingItemRequest;
import com.example.booking.dto.request.BookingRequest;
import com.example.booking.dto.request.BookingVoucherRequest;
import com.example.booking.dto.request.CreateBookingRequest;
import com.example.booking.dto.request.PaymentRequest;
import com.example.booking.dto.response.BookingResponse;
import com.example.booking.dto.response.TourPriceTypeResponse;
import com.example.booking.entity.Booking;
import com.example.booking.entity.BookingItem;
import com.example.booking.entity.BookingVoucher;
import com.example.booking.entity.Payment;
import com.example.booking.entity.Voucher;
import com.example.booking.mapper.BookingItemMapper;
import com.example.booking.mapper.BookingMapper;
import com.example.booking.mapper.BookingVoucherMapper;
import com.example.booking.mapper.PaymentMapper;
import com.example.booking.repository.BookingItemRepository;
import com.example.booking.repository.BookingRepository;
import com.example.booking.repository.BookingVoucherRepository;
import com.example.booking.repository.PaymentRepository;
import com.example.booking.repository.VoucherRepository;
import com.example.booking.util.SecurityUtils;
import com.example.common.enums.BookingStatus;
import com.example.common.enums.PaymentMethod;
import com.example.common.enums.PaymentStatus;
import com.example.common.enums.PriceType;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import java.util.HashMap;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class BookingService {
    @Value("${system.token}")
    String systemToken;

    final TourClient tourClient;

    final BookingRepository repository;
    final BookingMapper mapper;

    final BookingItemMapper bookingItemMapper;
    final BookingItemRepository bookingItemRepository;

    final PaymentMapper paymentMapper;
    final PaymentRepository paymentRepository;

    final BookingVoucherRepository bookingVoucherRepository;

    final VoucherRepository voucherRepository;

    final VoucherService voucherService;
    final BookingItemService bookingItemService;
    final PaymentService paymentService;

    public List<BookingResponse> getBookingByUser(UUID userId) {
        return mapper.toResponseList(repository.findByUserId(userId));
    }

    public List<BookingResponse> getBookingByMe() {
        return getBookingByUser(SecurityUtils.getCurrentUserId());
    }

    public List<TourPriceTypeResponse> getTourPriceTypes(UUID tourDetailIds) {
        return tourClient.getTourPriceType(tourDetailIds).getData();
    }

    public BookingResponse getBookingById(UUID bookingId) {
        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        return mapper.toResponse(booking);
    }

    private BigDecimal calculateDiscount(BigDecimal total, Voucher voucher) {
        BigDecimal discount = BigDecimal.ZERO;
        if (voucher.getDiscountPercent() != null) {

            discount = total.multiply(
                    BigDecimal.valueOf(voucher.getDiscountPercent())).divide(BigDecimal.valueOf(100));

        } else if (voucher.getDiscountAmount() != null) {
            discount = voucher.getDiscountAmount();
        }
        return discount;
    }

    public void calculateUnitPrice(List<BookingItem> items, UUID tourDetailId) {
        List<TourPriceTypeResponse> priceTypes = tourClient.getTourPriceType(tourDetailId).getData();
        Map<PriceType, BigDecimal> priceMap = new HashMap<>();

        for (TourPriceTypeResponse p : priceTypes) {
            priceMap.put(p.getPriceType(), p.getPrice());
        }

        for (BookingItem item : items) {
            PriceType type = item.getPriceType();
            BigDecimal price = priceMap.get(type);
            item.setUnitPrice(price);
        }
        // return items;
    }

    public BigDecimal calculateTotalPrice(
            List<BookingItem> items,
            Voucher voucher) {
        BigDecimal total = BigDecimal.ZERO;

        for (BookingItem item : items) {
            BigDecimal itemTotal = item.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);
        }

        BigDecimal discount = calculateDiscount(total, voucher);
        total = total.subtract(discount);

        return total.max(BigDecimal.ZERO);
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {

        // ===== 1. Validate =====
        if (request.getPaymentRequests() == null || request.getPaymentRequests().isEmpty()) {
            throw new AppException(ErrorCode.PAYMENT_REQUIRED);
        }

        // ===== 2. Map booking =====
        Booking booking = mapper.toEntity(request.getBookingRequest());
        booking.setUserId(SecurityUtils.getCurrentUserId());
        booking.setStatus(BookingStatus.PENDING);

        // ===== 3. Create items (set unitPrice từ Tour Service) =====
        List<BookingItem> items = bookingItemService.createItems(
                request.getBookingItems(), booking);

        // ===== 4. Lấy voucher theo code (nếu có) =====
        Voucher voucher = null;

        if (request.getCode() != null && !request.getCode().isBlank()) {

            String code = request.getCode().trim().toUpperCase();

            voucher = voucherRepository.findByCode(code)
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        }

        // ===== 5. Tính giá =====
        calculateUnitPrice(items, booking.getTourDetailId());
        BigDecimal totalPrice = calculateTotalPrice(items, voucher);
        booking.setTotalPrice(totalPrice);

        // update lại quantity voucher
        voucherService.updateStock(voucher.getId(), voucher.getQuantity() - 1);

        // ===== 6. expired =====
        PaymentMethod method = request.getPaymentRequests().get(0).getMethod();
        booking.setExpiredAt(paymentService.calculateExpiredAt(method));

        // ===== 7. Save booking =====
        Booking savedBooking = repository.save(booking);

        int quantity = items.stream().mapToInt(BookingItem::getQuantity).sum();
        updateStock(savedBooking.getTourDetailId(), quantity);

        // ===== 8. Save items =====
        items.forEach(i -> i.setBooking(savedBooking));
        bookingItemRepository.saveAll(items);

        // ===== 9. Save payment =====
        paymentRepository.saveAll(
                paymentService.createPayments(request.getPaymentRequests(), savedBooking));

        if (voucher != null) {
            // ===== 10. Save booking-voucher =====
            BookingVoucher bv = new BookingVoucher();
            bv.setBooking(savedBooking);
            bv.setVoucher(voucher);
            bookingVoucherRepository.save(bv);
        }
        return mapper.toResponse(savedBooking);
    }

    public void updateStock(UUID tourDetailId, int quantity) {
        tourClient.updateStock(tourDetailId, quantity, systemToken);
    }

    public void updateRollBackStock(UUID tourDetailId, int quantity) {
        tourClient.updateRollBackStock(tourDetailId, quantity, systemToken);
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void expireBooking() {
        System.out.println(">>> RUNNING " + LocalDateTime.now());
        LocalDateTime now = LocalDateTime.now();
        List<Booking> bookings = repository.findAllByStatusAndExpiredAtBefore(
                BookingStatus.PENDING, now);
        for (Booking booking : bookings) {
            if (booking.getExpiredAt() == null || booking.getExpiredAt().isAfter(now)) {
                continue;
            }
            booking.setStatus(BookingStatus.EXPIRED);
            List<Payment> payments = paymentRepository.findByBookingId(booking.getId());
            for (Payment p : payments) {
                if (p.getStatus() == PaymentStatus.PENDING) {
                    p.setStatus(PaymentStatus.FAILED);
                }
            }
            paymentRepository.saveAll(payments);
            int totalPeople = booking.getItems().stream()
                    .mapToInt(BookingItem::getQuantity)
                    .sum();
            updateRollBackStock(booking.getTourDetailId(), totalPeople);
        }
        repository.saveAll(bookings);
    }

    public void cancelBooking(UUID bookingId) {
        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        paymentService.cancelExpiredPayments(bookingId);
        repository.save(booking);
    }

    

    public BookingResponse updateBooking(UUID bookingId, BookingRequest request) {
        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserId().equals(SecurityUtils.getCurrentUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Cannot update booking");
        }
        booking.setContactFullname(request.getContactFullname());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());
        booking.setContactAddress(request.getContactAddress());
        booking.setNote(request.getNote());
        return mapper.toResponse(repository.save(booking));
    }

}