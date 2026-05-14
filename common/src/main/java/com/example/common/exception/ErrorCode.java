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
    INVALID_END_DAY(1023, "Ngày kết thúc phải sau ngày bắt đầu", 400),
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
    PAYMENT_EXITS_PENDING(1040, "Đã tồn tại phương thức thanh toán đang chờ xử lý", 400),
    INVALID_BOOKING_STATUS(1041, "Trạng thái booking không hợp lệ", 400),
    INVALID_PAYMENT_METHOD(1042, "Phương thức thanh toán không hợp lệ", 400),
    PAYMENT_NOT_FOUND(1043, "Phương thức thanh toán không tồn tại", 400),
    PAYMENT_ALREADY_VERIFIED(1044, "Phương thức thanh toán đã được xác minh", 400),
    INVALID_PAYMENT_STATUS(1045, "Trạng thái thanh toán không hợp lệ", 400),
    VOUCHER_ONLY_ONE_DISCOUNT_TYPE(1046, "Chỉ được nhập một trong hai loại giảm giá", 400),
    VOUCHER_DATE_INVALID(1047, "Ngày bắt đầu phải trước ngày kết thúc", 400),
    VOUCHER_START_DATE_INVALID(1048, "Ngày bắt đầu phải sau ngày hiện tại", 400),
    INVALID_REVIEW(1049, "Bạn không có booking hợp lệ để đánh giá tour này", 400),
    GOOGLE_EMAIL_NOT_VERIFIED(1050, "Email của Google chưa được xác minh", 400),
    INVALID_GOOGLE_TOKEN(1051, "Token Google không hợp lệ", 400),
    NOT_LOGIN_WITH_GOOGLE(1052, "Tài khoản này đã tồn tại không đăng nhập bằng Google", 400),
    INTERNAL_SERVER_ERROR(500, "Lỗi tạo token", 500),
    // UserRequest validation errors
    EMAIL_IS_BLANK(1053, "Email không được để trống", 400),
    EMAIL_INVALID(1054, "Email không đúng định dạng", 400),
    PASSWORD_IS_BLANK(1055, "Mật khẩu không được để trống", 400),
    FULL_NAME_IS_BLANK(1056, "Họ tên không được để trống", 400),
    ROLE_ID_IS_BLANK(1057, "Role ID không được để trống", 400),

    // ReviewRequest validation errors
    RATING_REQUIRED(1058, "Đánh giá bắt buộc phải có", 400),
    RATING_MIN(1059, "Đánh giá phải ít nhất 1 sao", 400),
    RATING_MAX(1060, "Đánh giá không được vượt quá 5 sao", 400),
    CONTENT_REQUIRED(1061, "Nội dung đánh giá không được để trống", 400),

    // TourDetailRequest validation errors
    CAPACITY_REQUIRED(1062, "Sức chứa là bắt buộc", 400),
    CAPACITY_MIN(1063, "Sức chứa phải lớn hơn hoặc bằng 1", 400),
    REMAINING_SEATS_REQUIRED(1064, "Số chỗ còn lại là bắt buộc", 400),
    REMAINING_SEATS_MIN(1065, "Số chỗ còn lại phải lớn hơn hoặc bằng 0", 400),
    START_DAY_REQUIRED(1066, "Ngày bắt đầu là bắt buộc", 400),
    END_DAY_REQUIRED(1067, "Ngày kết thúc là bắt buộc", 400),
    START_LOCATION_REQUIRED(1068, "Địa điểm bắt đầu là bắt buộc", 400),
    STATUS_REQUIRED(1069, "Trạng thái là bắt buộc", 400),

    // TourItineraryRequest validation errors
    DAY_NUMBER_REQUIRED(1070, "Số ngày là bắt buộc", 400),
    DAY_NUMBER_MIN(1071, "Số ngày phải lớn hơn hoặc bằng 1", 400),
    TITLE_REQUIRED(1072, "Tiêu đề là bắt buộc", 400),
    CONTENT_ITINERARY_REQUIRED(1073, "Nội dung là bắt buộc", 400),

    // TourPriceRequest validation errors
    PRICE_REQUIRED(1074, "Giá là bắt buộc", 400),
    PRICE_MIN(1075, "Giá phải lớn hơn 0", 400),
    PRICE_TYPE_REQUIRED(1076, "Loại giá là bắt buộc", 400),

    // TourRequest validation errors
    SLUG_REQUIRED(1077, "Slug là bắt buộc", 400),
    LOCATION_REQUIRED(1078, "Địa điểm là bắt buộc", 400),
    DURATION_REQUIRED(1079, "Thời gian là bắt buộc", 400),
    TOTAL_REVIEWS_MIN(1080, "Tổng số đánh giá phải lớn hơn hoặc bằng 0", 400),
    TOUR_TYPE_REQUIRED(1081, "Loại tour là bắt buộc", 400),

    // BookingItemRequest validation errors
    QUANTITY_REQUIRED(1083, "Số lượng là bắt buộc", 400),
    QUANTITY_MIN(1084, "Số lượng phải lớn hơn hoặc bằng 1", 400),
    UNIT_PRICE_REQUIRED(1085, "Đơn giá là bắt buộc", 400),
    UNIT_PRICE_MIN(1086, "Đơn giá phải lớn hơn 0", 400),

    //BookingRequest validation errors
    TOUR_ID_REQUIRED(1082, "Tour ID là bắt buộc", 400),
    TOUR_DETAIL_ID_REQUIRED(1087, "Tour Detail ID là bắt buộc", 400),
    CONTACT_FULLNAME_REQUIRED(1088, "Họ tên liên hệ là bắt buộc", 400),
    CONTACT_EMAIL_REQUIRED(1089, "Email liên hệ là bắt buộc", 400),
    CONTACT_PHONE_REQUIRED(1090, "Số điện thoại liên hệ là bắt buộc", 400),
    CONTACT_ADDRESS_REQUIRED(1091, "Địa chỉ liên hệ là bắt buộc", 400),
    TOTAL_PRICE_REQUIRED(1092, "Tổng giá là bắt buộc", 400),
    TOTAL_PRICE_MIN(1093, "Tổng giá phải lớn hơn 0", 400),

    // BookingVoucherRequest validation errors
    VOUCHER_ID_REQUIRED(1094, "Voucher ID là bắt buộc", 400),

    // MomoRequest validation errors
    PAYMENT_ID_REQUIRED(1095, "Payment ID là bắt buộc", 400),
    AMOUNT_REQUIRED(1096, "Amount là bắt buộc", 400),
    AMOUNT_MIN(1097, "Amount phải lớn hơn 0", 400),


    CODE_REQUIRED(2001, "code không được để trống", 400),
    START_DATE_REQUIRED(2003, "ngày bắt đầu không được để trống", 400),
    END_DATE_REQUIRED(2004, "ngày kết thúc không được để trống", 400);
    

    private final int code;
    private final String message;
    private final int status;

    ErrorCode(int code, String message, int status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}