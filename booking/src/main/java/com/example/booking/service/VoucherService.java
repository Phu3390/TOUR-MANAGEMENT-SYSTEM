package com.example.booking.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.booking.dto.request.VoucherRequest;
import com.example.booking.dto.response.VoucherResponse;
import com.example.booking.entity.Voucher;
import com.example.booking.mapper.VoucherMapper;
import com.example.booking.repository.VoucherRepository;
import com.example.common.dto.PageResponse;
import com.example.common.dto.VoucherQueryRequest;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.PageableUtil;
import com.example.common.utils.SpecificationBuilder;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class VoucherService {
        VoucherRepository voucherRepository;
        VoucherMapper voucherMapper;

        public List<VoucherResponse> getAllVouchers() {
                return voucherMapper.toResponseList(voucherRepository.findAll());
        }

        public PageResponse<VoucherResponse> filter(VoucherQueryRequest request) {

                Specification<Voucher> specification = (root, query, cb) -> {

                        Predicate predicate = cb.conjunction();

                        // ===== Keyword =====
                        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                                String keyword = "%" + request.getKeyword().toLowerCase() + "%";

                                predicate = cb.and(
                                                predicate,
                                                cb.or(
                                                                cb.like(cb.lower(root.get("code")), keyword),
                                                                cb.like(cb.lower(root.get("status")), keyword)));
                        }

                        // ===== Code =====
                        if (request.getCode() != null && !request.getCode().trim().isEmpty()) {
                                predicate = cb.and(
                                                predicate,
                                                cb.equal(root.get("code"), request.getCode()));
                        }

                        // ===== Status =====
                        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
                                predicate = cb.and(
                                                predicate,
                                                cb.equal(root.get("status"), request.getStatus()));
                        }

                        // ===== Discount Percent =====
                        if (request.getMinDiscountPercent() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.ge(
                                                                root.get("discountPercent"),
                                                                request.getMinDiscountPercent()));
                        }

                        if (request.getMaxDiscountPercent() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.le(
                                                                root.get("discountPercent"),
                                                                request.getMaxDiscountPercent()));
                        }

                        // ===== Discount Amount =====
                        if (request.getMinDiscountAmount() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.greaterThanOrEqualTo(
                                                                root.get("discountAmount"),
                                                                request.getMinDiscountAmount()));
                        }

                        if (request.getMaxDiscountAmount() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.lessThanOrEqualTo(
                                                                root.get("discountAmount"),
                                                                request.getMaxDiscountAmount()));
                        }

                        // ===== Quantity =====
                        if (request.getMinQuantity() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.ge(
                                                                root.get("quantity"),
                                                                request.getMinQuantity()));
                        }

                        if (request.getMaxQuantity() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.le(
                                                                root.get("quantity"),
                                                                request.getMaxQuantity()));
                        }

                        // ===== Start Date =====
                        if (request.getStartDateFrom() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.greaterThanOrEqualTo(
                                                                root.get("startDate"),
                                                                request.getStartDateFrom()));
                        }

                        if (request.getStartDateTo() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.lessThanOrEqualTo(
                                                                root.get("startDate"),
                                                                request.getStartDateTo()));
                        }

                        // ===== End Date =====
                        if (request.getEndDateFrom() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.greaterThanOrEqualTo(
                                                                root.get("endDate"),
                                                                request.getEndDateFrom()));
                        }

                        if (request.getEndDateTo() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.lessThanOrEqualTo(
                                                                root.get("endDate"),
                                                                request.getEndDateTo()));
                        }

                        // ===== Created At =====
                        if (request.getCreatedAtFrom() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.greaterThanOrEqualTo(
                                                                root.get("createdAt"),
                                                                request.getCreatedAtFrom()));
                        }

                        if (request.getCreatedAtTo() != null) {
                                predicate = cb.and(
                                                predicate,
                                                cb.lessThanOrEqualTo(
                                                                root.get("createdAt"),
                                                                request.getCreatedAtTo()));
                        }

                        return predicate;
                };

                Page<Voucher> page = voucherRepository.findAll(
                                specification,
                                PageableUtil.build(request));

                List<VoucherResponse> content = voucherMapper.toResponseList(page.getContent());

                return PageResponse.<VoucherResponse>builder()
                                .content(content)
                                .pageNumber(page.getNumber())
                                .size(page.getSize())
                                .totalElements(page.getTotalElements())
                                .totalPages(page.getTotalPages())
                                .sizeCurrent(page.getNumberOfElements())
                                .build();
        }

        public VoucherResponse getVoucherByCode(String code) {
                return voucherMapper.toResponse(
                                voucherRepository.findByCode(code)
                                                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND)));
        }

        public VoucherResponse create(VoucherRequest req) {
                if (voucherRepository.existsByCode(req.getCode())) {
                        throw new AppException(ErrorCode.VOUCHER_CODE_EXISTED);
                }
                boolean hasPercent = req.getDiscountPercent() != null;
                boolean hasAmount = req.getDiscountAmount() != null;

                // Không được nhập cả 2
                if (hasPercent && hasAmount) {
                        throw new AppException(ErrorCode.VOUCHER_ONLY_ONE_DISCOUNT_TYPE);
                }

                // End phải sau Start
                if (req.getEndDate().isBefore(req.getStartDate())
                                || req.getEndDate().isEqual(req.getStartDate())) {
                        throw new AppException(ErrorCode.VOUCHER_DATE_INVALID);
                }

                // Start không được ở quá khứ (nếu cần áp dụng)
                if (req.getStartDate().isBefore(LocalDateTime.now())) {
                        throw new AppException(ErrorCode.VOUCHER_START_DATE_INVALID);
                }
                Voucher voucher = voucherMapper.toEntity(req);
                return voucherMapper.toResponse(voucherRepository.save(voucher));
        }

        public VoucherResponse update(UUID id, VoucherRequest req) {
                Voucher voucher = voucherRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
                if (voucherRepository.existsByCodeAndIdNot(req.getCode(), id)) {
                        throw new AppException(ErrorCode.VOUCHER_CODE_EXISTED);
                }
                boolean hasPercent = req.getDiscountPercent() != null;
                boolean hasAmount = req.getDiscountAmount() != null;

                // Không được nhập cả 2
                if (hasPercent && hasAmount) {
                        throw new AppException(ErrorCode.VOUCHER_ONLY_ONE_DISCOUNT_TYPE);
                }
                      // End phải sau Start
                if (req.getEndDate().isBefore(req.getStartDate())
                                || req.getEndDate().isEqual(req.getStartDate())) {
                        throw new AppException(ErrorCode.VOUCHER_DATE_INVALID);
                }
                voucherMapper.updateEntityFromRequest(req, voucher);
                return voucherMapper.toResponse(voucherRepository.save(voucher));
        }

        public void updateStock(UUID id, int stock) {
                Voucher voucher = voucherRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
                voucher.setQuantity(stock);
                voucherRepository.save(voucher);
        }

        public void editStatus(UUID id, String status) {
                Voucher voucher = voucherRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
                voucher.setStatus(status);
                voucherRepository.save(voucher);
        }
}
