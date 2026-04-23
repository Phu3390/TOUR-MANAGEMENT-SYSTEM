package com.example.booking.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.booking.dto.response.BookingVoucherResponse;
import com.example.booking.entity.BookingVoucher;

@Mapper(componentModel = "spring", uses = { VoucherMapper.class })
public interface BookingVoucherMapper {

    @Mapping(target = "booking", ignore = true)
    BookingVoucherResponse toVoucherResponse(BookingVoucher bookingVoucher);

    List<BookingVoucherResponse> toVoucherResponseList(List<BookingVoucher> list);
}
