package com.example.booking.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.booking.dto.request.VoucherRequest;
import com.example.booking.dto.response.VoucherResponse;
import com.example.booking.entity.Voucher;

@Mapper(componentModel = "spring")
public interface VoucherMapper {

    Voucher toEntity(VoucherRequest request);

    VoucherResponse toResponse(Voucher voucher);

    List<VoucherResponse> toResponseList(List<Voucher> vouchers);

    void updateEntityFromRequest(VoucherRequest request, @MappingTarget Voucher voucher);
}
