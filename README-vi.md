# TOUR-MANAGEMENT-SYSTEM

## Giới thiệu
TOUR-MANAGEMENT-SYSTEM là một hệ thống microservices phục vụ quản lý tour du lịch, bao gồm các dịch vụ: cổng API, xác thực, quản lý tour, đặt chỗ, dịch vụ khám phá (Eureka), và một frontend web ứng dụng SPA.

Mục tiêu của dự án: cung cấp nền tảng quản lý tour, đặt vé và quản trị thông tin tour cho các nhà quản lý và người dùng cuối.

## Kiến trúc
- Kiến trúc: Microservices (một module/microservice cho mỗi thư mục: `api_gateway`, `auth`, `booking`, `tours`, `common`, `eureka`, `web_app`).
- Giao tiếp: REST API nội bộ và giữa frontend.
- Công cụ chính: Java + Spring Boot cho backend, Maven làm build tool; React + Vite + TypeScript cho frontend.

## Yêu cầu hệ thống
- Java 17+ (hoặc phiên bản phù hợp với từng module)
- Maven 3.6+
- Node.js 16+ và npm/yarn cho `web_app`
- (Tùy chọn) Docker nếu muốn chạy container hóa

## Cài đặt và chạy nhanh (local)
1. Clone repository:

   git clone <repo-url>
   cd TOUR-MANAGEMENT-SYSTEM

2. Chạy Eureka (service discovery):

   cd eureka
   ./mvnw spring-boot:run

3. Chạy các dịch vụ backend (mở các terminal khác):

   cd auth
   ./mvnw spring-boot:run

   cd ../tours
   ./mvnw spring-boot:run

   cd ../booking
   ./mvnw spring-boot:run

   cd ../api_gateway
   ./mvnw spring-boot:run

4. Chạy frontend (web_app):

   cd web_app
   npm install
   npm run dev

Ghi chú: Trước khi chạy, kiểm tra file `src/main/resources/application.properties` hoặc `application.yml` trong mỗi module để cấu hình cổng (port) và kết nối đến Eureka.

## Cấu hình (tổng quan)
- Mỗi microservice có `application.properties` tại `src/main/resources`.
- Thay đổi cổng bằng thuộc tính `server.port`.
- Cấu hình kết nối tới Eureka: `eureka.client.service-url.defaultZone`.
- Các thông tin môi trường (DB, secrets) nên được cấu hình qua biến môi trường hoặc profile Spring.

## Các service chính
- `eureka`: Service discovery.
- `api_gateway`: Cổng vào hệ thống, chịu trách nhiệm định tuyến và có thể xử lý xác thực chung.
- `auth`: Xác thực và phân quyền người dùng (JWT/OAuth tùy triển khai).
- `tours`: Quản lý dữ liệu tour (CRUD tour, tìm kiếm, lọc).
- `booking`: Xử lý đặt chỗ, quản lý đơn đặt.
- `common`: Các lớp/utility được chia sẻ giữa các service.
- `web_app`: Frontend SPA (React + Vite + TypeScript).

## Các endpoint (một số ví dụ)
Lưu ý: các endpoint cụ thể có thể nằm trong từng module `src/main/java/.../controller` — mở mã nguồn để xem chi tiết.

- `POST /auth/login` — Đăng nhập, trả JWT.
- `GET /tours` — Lấy danh sách tour.
- `GET /tours/{id}` — Chi tiết tour.
- `POST /booking` — Tạo đặt chỗ.
- `GET /booking/{id}` — Truy vấn đặt chỗ.

## Kiểm thử
- Mỗi module có thư mục `src/test/java` để chứa unit/integration tests.
- Chạy tests với Maven:
   ./mvnw test
