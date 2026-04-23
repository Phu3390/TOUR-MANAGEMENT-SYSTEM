package com.example.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    UNKNOWN_ERROR(9999, "Lỗi không xác định", 503),
    IVALID_KEY(1000, "Lỗi do nhập sai key để validate", 400),
    NOT_EXITS(1001, "Không tìm thấy", 400),
    ACCOUNT_NOT_EXITS(1002, "Tài khoản không tồn tại", 400),
    PASSWORD_IVALID(1003, "Tài khoản hoặc mật khẩu không chính xác!", 400),
    ACCOUND_BAN(1004, "Tài khoản đã bị khóa!", 400),
    UNAUTHORIZED(401, "Chưa đăng nhập", 401),
    FORBIDDEN(403, "Không có quyền truy cập", 403),
    IMPORT_NOT_EXITS(1005, "Phiếu nhập không tồn tại", 400),
    SUPPLIER_NOT_EXITS(1006, "Nhà cung cấp không tồn tại", 400),
    PRODUCT_VERSION_NOT_EXITS(1007, "Phiên bản sản phẩm không tồn tại", 400),
    DUPLICATE_PRODUCT(1008, "Tour price này đã tồn tại", 400),
    NOT_ENOUGH_STOCK(1009, "Số lượng không đủ", 400),
    CUSTOMER_NOT_EXITS(1010, "Khách hàng không tồn tại", 400),
    EXPORT_NOT_EXITS(1011, "Phiếu xuất không tồn tại", 400),
    IVALID_EXPORT_PRICE(1012, "Giá xuất phải lớn hơn giá nhập", 400),
    ROLE_NOT_EXITS(1013, "Quyền không tồn tại", 400),
    PRODUCT_HAS_STOCK(1014, "Sản phẩm còn tồn kho", 400),
    ROLE_IN_USE(1015, "Quyền đang được sử dụng", 400),
    ACCOUNT_EXITS(1016, "Tên đăng nhập đã tồn tại", 400),
    EMAIL_EXITS(1017, "Email đã tồn tại", 400),
    PERMISSION_NOT_EXITS(1018, "Quyền không tồn tại", 400),
    EMAIL_PASSWORD_INVALID(1019, "Email hoặc mật khẩu sai", 400),
    Tour_NOT_FOUND(1020, "Tour không tồn tại", 400),
    SLUG_ALREADY_EXISTS(1021, "Slug đã tồn tại", 400),
    CAPACITY_MUST_BE_GREATER_THAN_REMAINING_SEATS(1022, "Số lượng chỗ ngồi phải lớn hơn số chỗ còn lại", 400),
    INVALID_END_DAY(1023,"Ngày kết thúc phải sau ngày bắt đầu", 400),
    Tour_DETAIL_NOT_FOUND(1024, "Chi tiết tour không tồn tại", 400),
    PRICE_MUST_BE_GREATER_THAN_ZERO(1025, "Giá phải lớn hơn 0", 400),
    DAY_NUMBER_MUST_BE_POSITIVE(1026, "Số ngày phải là số dương", 400),
    Review_NOT_FOUND(1027, "Review không tồn tại", 400),
    FORBIDDEN_REVIEW(1028, "Bạn không có quyền chỉnh sửa review này", 403),
    DUPLICATE_REVIEW(1029, "Bạn đã đánh giá tour này rồi", 400),
    DUPLICATE_REVIEW_NOT_FOUND(1030, "Bạn không có review nào để cập nhật", 400),
    VOUCHER_NOT_FOUND(1031, "Voucher không tồn tại", 400),
    BOOKING_NOT_FOUND(1032, "Booking không tồn tại", 400),
    PAYMENT_REQUIRED(1033, "Phải có ít nhất một phương thức thanh toán", 400),
    Voucher_Is_Not_Active(1034, "Voucher không hoạt động", 400),
    Voucher_Is_Expired(1035, "Voucher đã hết hạn", 400),
    Voucher_Has_No_Quantity(1036, "Voucher đã hết số lượng", 400),
    REMAINING_SEATS_CANNOT_EXCEED_CAPACITY(1037, "Số chỗ còn lại không được vượt quá sức chứa", 400),
    REMAINING_SEATS_CANNOT_BE_NEGATIVE(1038, "Số lượng chỗ âm", 400),
    VOUCHER_CODE_EXISTED(1039, "Mã voucher đã tồn tại", 400),
    PAYMENT_EXITS_PENDING(1040, "Đã tồn tại phương thức thanh toán đang chờ xử lý", 400);


    private final int code;
    private final String message;
    private final int status;

    ErrorCode(int code, String message, int status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}