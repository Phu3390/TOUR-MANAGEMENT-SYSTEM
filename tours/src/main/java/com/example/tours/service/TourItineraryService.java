package com.example.tours.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.tours.dto.request.TourItineraryRequest;
import com.example.tours.dto.response.TourItineraryResponse;
import com.example.tours.entity.TourDetail;
import com.example.tours.entity.TourItinerary;
import com.example.tours.mapper.TourItineraryMapper;
import com.example.tours.repository.TourDetailRepository;
import com.example.tours.repository.TourItineraryRepository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TourItineraryService {
    TourItineraryRepository tourItineraryRepository;
    TourItineraryMapper tourItineraryMapper;

    TourDetailRepository tourDetailRepository;

    public List<TourItineraryResponse> getAll() {
        return tourItineraryMapper.toResponseList(tourItineraryRepository.findAll());
    }

    public List<TourItineraryResponse> getByTourDetailId(UUID tourDetailId) {
        return tourItineraryMapper.toResponseList(tourItineraryRepository.findByTourDetailId(tourDetailId));
    }

    public List<TourItineraryResponse> createList(UUID tourDetailId, List<TourItineraryRequest> requests) {
       TourDetail tourDetail = tourDetailRepository.findById(tourDetailId)
                .orElseThrow(() -> new AppException(ErrorCode.Tour_DETAIL_NOT_FOUND));
        List<TourItinerary> list = new ArrayList<>();
        for( TourItineraryRequest request : requests) {
            if(request.getDayNumber() <= 0) {
                throw new AppException(ErrorCode.DAY_NUMBER_MUST_BE_POSITIVE);
            }
            TourItinerary entity = tourItineraryMapper.toEntity(request);
            entity.setTourDetail(tourDetail);
            list.add(entity);
        }
        return tourItineraryMapper.toResponseList(tourItineraryRepository.saveAll(list));
    }

    public TourItineraryResponse createOne(UUID tourDetailId, TourItineraryRequest request) {
       TourDetail tourDetail = tourDetailRepository.findById(tourDetailId)
                .orElseThrow(() -> new AppException(ErrorCode.Tour_DETAIL_NOT_FOUND));
            if(request.getDayNumber() <= 0) {
                throw new AppException(ErrorCode.DAY_NUMBER_MUST_BE_POSITIVE);
            }
            TourItinerary entity = tourItineraryMapper.toEntity(request);
            entity.setTourDetail(tourDetail);
        return tourItineraryMapper.toResponse(tourItineraryRepository.save(entity));
    }

    public TourItineraryResponse updateOne(UUID id, TourItineraryRequest request) {
        TourItinerary entity = tourItineraryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.Tour_DETAIL_NOT_FOUND));
        if(request.getDayNumber() <= 0) {
            throw new AppException(ErrorCode.DAY_NUMBER_MUST_BE_POSITIVE);
        }

        tourItineraryMapper.updateEntityFromRequest(request, entity);
        return tourItineraryMapper.toResponse(tourItineraryRepository.save(entity));
    }

}
