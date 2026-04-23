package com.example.tours.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.tours.dto.request.TourDetailRequest;
import com.example.tours.dto.response.TourDetailResponse;
import com.example.tours.entity.Tour;
import com.example.tours.entity.TourDetail;
import com.example.tours.mapper.TourDetailMapper;
import com.example.tours.repository.TourDetailRepository;
import com.example.tours.repository.TourRepository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TourDetailService {
    TourDetailMapper mapper;
    TourDetailRepository repository;
    TourRepository tourRepository;

    public List<TourDetailResponse> getAll() {
        return mapper.toResponseList(repository.findAll());
    }

    public List<TourDetailResponse> getById(UUID id) {
        return mapper.toResponseList(repository.findByTourId(id));
    }

    public List<TourDetailResponse> createList(UUID tourId, List<TourDetailRequest> requests) {
        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        List<TourDetail> lits = new ArrayList<>();
        for (TourDetailRequest request : requests) {
            if (request.getCapacity() < request.getRemainingSeats()) {
                throw new AppException(ErrorCode.CAPACITY_MUST_BE_GREATER_THAN_REMAINING_SEATS);
            }
            if (request.getEndDay().isBefore(request.getStartDay())) {
                throw new AppException(ErrorCode.INVALID_END_DAY);
            }
            TourDetail tourDetail = mapper.toEntity(request);
            tourDetail.setTour(tour);
            lits.add(tourDetail);
        }
        return mapper.toResponseList(repository.saveAll(lits));
    }

    public TourDetailResponse createOne(UUID tourId, TourDetailRequest request) {
        Tour tour = tourRepository.findById(tourId).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        if (request.getCapacity() < request.getRemainingSeats()) {
            throw new AppException(ErrorCode.CAPACITY_MUST_BE_GREATER_THAN_REMAINING_SEATS);
        }
        if (request.getEndDay().isBefore(request.getStartDay())) {
            throw new AppException(ErrorCode.INVALID_END_DAY);
        }
        TourDetail tourDetail = mapper.toEntity(request);
        tourDetail.setTour(tour);
        return mapper.toResponse(repository.save(tourDetail));
    }

    public TourDetailResponse updateOne(UUID id, TourDetailRequest request) {
        TourDetail tourDetail = repository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        if (request.getCapacity() < request.getRemainingSeats()) {
            throw new AppException(ErrorCode.CAPACITY_MUST_BE_GREATER_THAN_REMAINING_SEATS);
        }
        if (request.getEndDay().isBefore(request.getStartDay())) {
            throw new AppException(ErrorCode.INVALID_END_DAY);
        }
        mapper.updateEntity(tourDetail, request);
        return mapper.toResponse(repository.save(tourDetail));
    }

    public void updateStock(UUID id, int quantity) {
        TourDetail tourDetail = repository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        if (tourDetail.getRemainingSeats() - quantity < 0) {
            throw new AppException(ErrorCode.REMAINING_SEATS_CANNOT_EXCEED_CAPACITY);
        }
        if (quantity < 0) {
            throw new AppException(ErrorCode.REMAINING_SEATS_CANNOT_BE_NEGATIVE);
        }
        tourDetail.setRemainingSeats(tourDetail.getRemainingSeats() - quantity);
        repository.save(tourDetail);
    }

    public void updateRollBackStock(UUID id, int quantity) {
        TourDetail tourDetail = repository.findById(id).orElseThrow(() -> new AppException(ErrorCode.Tour_NOT_FOUND));
        if (quantity < 0) {
            throw new AppException(ErrorCode.REMAINING_SEATS_CANNOT_BE_NEGATIVE);
        }
        if( tourDetail.getRemainingSeats() + quantity > tourDetail.getCapacity()) {
            throw new AppException(ErrorCode.REMAINING_SEATS_CANNOT_EXCEED_CAPACITY);
        }
        tourDetail.setRemainingSeats(tourDetail.getRemainingSeats() + quantity);
        repository.save(tourDetail);
    }
}
