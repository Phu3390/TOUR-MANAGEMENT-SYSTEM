package com.example.booking.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.booking.dto.request.VoucherRequest;
import com.example.booking.dto.response.VoucherResponse;
import com.example.booking.entity.Voucher;
import com.example.booking.mapper.VoucherMapper;
import com.example.booking.repository.VoucherRepository;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;

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

    public VoucherResponse getVoucherByCode(String code) {
        return voucherMapper.toResponse(voucherRepository.findByCode(code).orElseThrow(()-> new AppException(ErrorCode.VOUCHER_NOT_FOUND)));
    }

    public VoucherResponse create(VoucherRequest req) {
        if (voucherRepository.existsByCode(req.getCode())) {
            throw new AppException(ErrorCode.VOUCHER_CODE_EXISTED);
        }
        Voucher voucher = voucherMapper.toEntity(req);
        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    public VoucherResponse update(UUID id, VoucherRequest req) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        if (voucherRepository.existsByCodeAndIdNot(req.getCode(), id)) {
            throw new AppException(ErrorCode.VOUCHER_CODE_EXISTED);
        }
        voucherMapper.updateEntityFromRequest(req, voucher);
        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    public void updateStock(UUID id, int stock) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        voucher.setQuantity(stock);
        voucherRepository.save(voucher);
    }

    public void stop(UUID id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(()-> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        voucher.setStatus("INACTIVE");
        voucherRepository.save(voucher);
    }
}
