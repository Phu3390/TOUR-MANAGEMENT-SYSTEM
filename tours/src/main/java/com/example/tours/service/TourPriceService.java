package com.example.tours.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.tours.dto.request.TourPriceRequest;
import com.example.tours.dto.response.TourPriceResponse;
import com.example.tours.entity.TourDetail;
import com.example.tours.entity.TourPrice;
import com.example.tours.mapper.TourPriceMapper;
import com.example.tours.repository.TourDetailRepository;
import com.example.tours.repository.TourPriceRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TourPriceService {
    TourPriceMapper mapper;
    TourPriceRepository repository;
    
    TourDetailRepository tourDetailRepository;

    public List<TourPriceResponse> getAll() {
        return mapper.toResponseList(repository.findAll());
    }

    public List<TourPriceResponse> getByTourDetailId(UUID tourDetailId) {
        return mapper.toResponseList(repository.findByTourDetailId(tourDetailId));
    }

    public List<TourPriceResponse> createList(UUID tourDetailId, List<TourPriceRequest> requests) {
        TourDetail tourDetail = tourDetailRepository.findById(tourDetailId).orElseThrow(() -> new AppException(ErrorCode.Tour_DETAIL_NOT_FOUND));
        List<TourPrice> list = new ArrayList<>();
        for (TourPriceRequest request : requests) {
            if(repository.existsByTourDetailIdAndPriceType(tourDetailId, request.getPriceType())) {
                throw new AppException(ErrorCode.DUPLICATE_PRODUCT);
            }
            if(request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new AppException(ErrorCode.PRICE_MUST_BE_GREATER_THAN_ZERO);
            }
            TourPrice tourPrice = mapper.toEntity(request);
            tourPrice.setCreatedAt(LocalDateTime.now());
            tourPrice.setTourDetail(tourDetail);
            list.add(tourPrice);
        }
        return mapper.toResponseList(repository.saveAll(list));
    }

    @Transactional
    public TourPriceResponse createOne(UUID tourDetailId, TourPriceRequest request) {
        TourDetail tourDetail = tourDetailRepository.findById(tourDetailId).orElseThrow(() -> new AppException(ErrorCode.Tour_DETAIL_NOT_FOUND));
        if(repository.existsByTourDetailIdAndPriceType(tourDetailId, request.getPriceType())) {
            throw new AppException(ErrorCode.DUPLICATE_PRODUCT);
        }
        if(request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.PRICE_MUST_BE_GREATER_THAN_ZERO);
        }
        TourPrice tourPrice = mapper.toEntity(request);
        tourPrice.setTourDetail(tourDetail);
        tourPrice.setCreatedAt(LocalDateTime.now());
        return mapper.toResponse(repository.save(tourPrice));
    }

    @Transactional
    public TourPriceResponse updateOne(UUID id, TourPriceRequest request) {
        TourPrice tourPrice = repository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Tour_DETAIL_NOT_FOUND));
        if(repository.existsByTourDetailIdAndPriceTypeAndIdNot(tourPrice.getTourDetail().getId(), request.getPriceType(), id)) {
            throw new AppException(ErrorCode.DUPLICATE_PRODUCT);
        }
        if(request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.PRICE_MUST_BE_GREATER_THAN_ZERO);
        }

        mapper.updateEntityFromRequest(request, tourPrice);
        return mapper.toResponse(repository.save(tourPrice));
    }


    public List<TourPriceResponse> getPrice(UUID tourDetailId) {
        return mapper.toResponseList(repository.findByTourDetailId(tourDetailId));
    }
    
}
