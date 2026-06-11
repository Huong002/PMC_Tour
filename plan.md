# Kế Hoạch Chi Tiết - PMC Tour Management System

## 1. Quyết Định Công Nghệ (Tech Stack Decision)

### So Sánh: Java Spring Boot vs C# ASP.NET Core

| Tiêu Chí                          | Java Spring Boot                          | C# ASP.NET Core                           | Chọn |
|------------------------------------|-------------------------------------------|--------------------------------------------|------|
| **Domain-Driven Design (DDD)**     | Hỗ trợ tốt, nhiều tài liệu                | Hỗ trợ tốt, tương tự                       | -    |
| **State Machine**                  | Spring Statemachine (mạnh)                | Cần thư viện ngoài hoặc tự xây             | -    |
| **Kiểu dữ liệu giàu (Value Object)** | Records (Java 14+), nhưng hơi cồng kềnh  | `record` (C# 10+) + tính năng tương tự tốt hơn | **C#** |
| **Tính nhất quán**                 | Java mạnh về hệ thống lớn                 | .NET ecosystem gọn nhẹ, nhất quán hơn      | **C#** |
| **CORS + REST API**                | Cấu hình CORS rườm rà                     | `AllowAnyOrigin()` một dòng, minimal API gọn | **C#** |
| **JWT Authentication**             | JWT filter, nhiều boilerplate             | `AddAuthentication().AddJwtBearer()` đơn giản | **C#** |
| **FluentValidation**               | Bean Validation + annotation (@Valid)     | `FluentValidation` + `Validator<T>` mạnh mẽ | **C#** |
| **NuGet ecosystem**                | Có thể dùng Mapster, MediatR              | Tích hợp sẵn EF Core, Identity            | **C#** |
| **Performance**                    | Ngang nhau                                | Ngang nhau (ASP.NET Core nhanh hơn đôi chút) | - |
| **SQL Server Support**             | JDBC + Hibernate (tốt)                    | **Entity Framework Core (tích hợp xuất sắc với SQL Server)** | **C#** |
| **Tuyển dụng nhóm**                | Java phổ biến hơn                         | C# phổ biến ở doanh nghiệp, cộng đồng mạnh | - |

### Kết Luận: Chọn **C# ASP.NET Core (.NET 8/9)**

**Lý do chính:**
- Entity Framework Core + SQL Server: `AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString))` — 1 dòng, không config XML
- `record` types trong C# 12 giúp DTO gọn gàng: `public record CustomerDTO(int Id, string FullName, string Email)`
- Validation với FluentValidation: tách biệt, dễ test, chain API rõ ràng
- JWT Bearer: middleware built-in, không cần thư viện thứ ba
- Frontend Next.js + Backend C# Dev Tunnel: localhost chạy song song, CORS config 1 dòng

### Công Nghệ Chính Thức

| Layer            | Công Nghệ                           |
|------------------|--------------------------------------|
| **Backend**      | C# ASP.NET Core (.NET 9)             |
| **ORM**          | Entity Framework Core 9              |
| **Validation**   | FluentValidation                     |
| **Auth**         | JWT Bearer (Microsoft.AspNetCore.Authentication.JwtBearer) |
| **Mapping**      | Mapster                              |
| **Database**     | SQL Server 2022                      |
| **Frontend**     | Next.js 15 (App Router) + Tailwind CSS 4 |
| **HTTP Client**  | Axios + React Query (TanStack Query 5) |
| **Auth Flow**    | JWT -> localStorage -> Axios interceptor |
| **Diagram**      | (tạm thời text-based, sau có thể dùng Mermaid / PlantUML) |

---

## 2. Kiến Trúc Tổng Quan (Core Architecture)

### 2.1. Domain-Driven Design Layers

```
┌──────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
│   Controllers (REST API) / Next.js Pages + Components        │
│   - AuthController      - TourController                     │
│   - RegistrationController - PaymentController                │
│   - ReviewController    - AdminController / UsersController   │
│   - DashboardController                                       │
└──────────────────────────────────────────────────────────────┘
         │                           ▲
         │ HTTP Request              │ JSON Response
         ▼                           │
┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│   Services (Use Cases)                                        │
│   - AuthService          - TourService                        │
│   - RegistrationService  - PaymentService                     │
│   - ReviewService        - UserService (Admin)                │
│   - DashboardService                                          │
│   DTOs: Request / Response objects                            │
│   FluentValidation validators for every Request DTO           │
└──────────────────────────────────────────────────────────────┘
         │                           ▲
         │                           │
         ▼                           │
┌──────────────────────────────────────────────────────────────┐
│                    Domain Layer                               │
│   Entities + Value Objects + Enums                            │
│   - User (Customer/Staff/Admin)  - Tour                       │
│   - Registration     - Payment   - Review                     │
│   - TourImage        - TourSchedule                           │
│   Interfaces: IRepository<T>, ITourService, etc.              │
│   State Machine: TourState, RegistrationState                 │
└──────────────────────────────────────────────────────────────┘
         │                           ▲
         │                           │
         ▼                           │
┌──────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│   - DbContext (EF Core)      - Repository Implementations     │
│   - JWT Token Generation      - Password Hashing              │
│   - Migrations                - Seed Data                     │
└──────────────────────────────────────────────────────────────┘
```

### 2.2. Authentication & Authorization

| Thành phần        | Công nghệ                                        |
|-------------------|--------------------------------------------------|
| Hash mật khẩu     | `BCrypt.Net` hoặc `PasswordHasher<TUser>` của Identity |
| JWT Generation    | `IJwtService` (tự viết, dùng `System.IdentityModel.Tokens.Jwt`) |
| Role-Based Auth   | `[Authorize(Roles = "ADMIN")]` attribute          |
| Endpoint Policies | Policy-based authorization nếu cần                 |

### 2.3. Request Processing Pipeline

```
HTTP Request
    │
    ▼
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│  Middleware   │    │  ApiController  │    │ FluentValidation │
│ - Exception   │───►│  [Authorize]    │───►│  Validator    │
│ - CORS        │    │                 │    │               │
│ - Auth(JWT)   │    │                 │    │               │
└──────────────┘    └───────┬─────────┘    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐    ┌──────────────┐
                    │    Service   │───►│  Repository   │
                    │  (Use Case)  │    │  (EF Core)    │
                    └──────────────┘    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   Response   │
                    │    DTO +     │
                    │  Status Code │
                    └──────────────┘
```

---

## 3. Chi Tiết API (API Specifications)

### 3.1. State Machine

#### TourState

```
DRAFT ───► PUBLISHED ───► CANCELLED
              │
              ▼
         COMPLETED
```

| Trạng thái    | Ý nghĩa                                 | Hành vi                    |
|---------------|------------------------------------------|----------------------------|
| `DRAFT`       | Tour đang soạn, chưa công khai            | Staff tự động chuyển        |
| `PUBLISHED`   | Đã công khai, khách có thể đăng ký         | Staff publish              |
| `CANCELLED`   | Tour bị hủy (các đăng ký pending bị cancel theo) | Staff hủy           |
| `COMPLETED`   | Tour đã kết thúc                           | Staff đánh dấu             |

#### RegistrationState

```
PENDING ──► APPROVED ──► CONFIRMED ──► COMPLETED
  │            │
  │            ▼
  └───► CANCELLED      NO_SHOW
```

| Trạng thái       | Ý nghĩa                                      | Ai thực hiện      |
|------------------|-----------------------------------------------|-------------------|
| `PENDING`        | Khách đăng ký, chờ duyệt                      | System (khi tạo)  |
| `APPROVED`       | Staff duyệt đơn                               | Staff             |
| `CONFIRMED`      | Khách xác nhận tham gia + đã cọc              | Staff             |
| `COMPLETED`      | Khách đã tham gia tour                        | Staff             |
| `CANCELLED`      | Hủy (khách hủy trước, hoặc staff hủy)         | Owner / Staff     |
| `NO_SHOW`        | Khách không đến                                | Staff             |

### 3.2. API Xác Thực (Auth)

| Method | Endpoint                 | Mô tả                       | Role    | Request Dto           | Response Dto     |
|--------|--------------------------|------------------------------|---------|-----------------------|------------------|
| POST   | `/api/v1/auth/register`  | Đăng ký tài khoản (customer) | PUBLIC  | RegisterRequest       | AuthResponse     |
| POST   | `/api/v1/auth/login`     | Đăng nhập                    | PUBLIC  | LoginRequest          | AuthResponse     |
| POST   | `/api/v1/auth/logout`    | Đăng xuất                    | AUTH    | -                     | ApiResponse      |
| GET    | `/api/v1/auth/profile`   | Xem profile                  | AUTH    | -                     | UserDTO          |
| PUT    | `/api/v1/auth/profile`   | Cập nhật profile             | AUTH    | UpdateProfileRequest  | UserDTO          |
| PUT    | `/api/v1/auth/password`  | Đổi mật khẩu                 | AUTH    | ChangePasswordRequest | ApiResponse      |

### 3.3. API Tour

| Method | Endpoint                              | Mô tả                    | Role    | Request Dto             | Response Dto          |
|--------|---------------------------------------|---------------------------|---------|-------------------------|-----------------------|
| GET    | `/api/v1/tours`                       | Danh sách tour (có search)| PUBLIC  | TourSearchParams(query) | PageDTO<TourDTO>      |
| GET    | `/api/v1/tours/{id}`                  | Chi tiết tour             | PUBLIC  | -                       | TourDetailDTO         |
| POST   | `/api/v1/tours`                       | Tạo tour mới              | STAFF   | CreateTourRequest       | TourDTO               |
| PUT    | `/api/v1/tours/{id}`                  | Cập nhật tour             | STAFF   | UpdateTourRequest       | TourDTO               |
| PATCH  | `/api/v1/tours/{id}/status`           | Đổi trạng thái tour       | STAFF   | UpdateTourStatusRequest | TourDTO               |
| DELETE | `/api/v1/tours/{id}`                  | Xóa tour (admin only)     | ADMIN   | -                       | ApiResponse           |
| GET    | `/api/v1/tours/{id}/images`           | Danh sách ảnh của tour    | PUBLIC  | -                       | List<TourImageDTO>    |
| POST   | `/api/v1/tours/{id}/images`           | Thêm ảnh cho tour         | STAFF   | CreateTourImageRequest  | TourImageDTO          |
| DELETE | `/api/v1/tours/{id}/images/{imageId}` | Xóa ảnh tour              | STAFF   | -                       | ApiResponse           |

### 3.4. API Đăng Ký (Registration)

| Method | Endpoint                                          | Mô tả                         | Role     | Request Dto              | Response Dto           |
|--------|---------------------------------------------------|-------------------------------|----------|--------------------------|------------------------|
| POST   | `/api/v1/registrations`                           | Khách đăng ký tour            | CUSTOMER | CreateRegistrationRequest | RegistrationDTO       |
| GET    | `/api/v1/registrations`                           | DS đăng ký (staff: tất cả)    | STAFF    | RegistrationSearchParams(query)| PageDTO<RegistrationDTO>|
| GET    | `/api/v1/registrations/my`                        | DS đăng ký của tôi            | CUSTOMER | -                        | PageDTO<RegistrationDTO>|
| GET    | `/api/v1/registrations/{id}`                      | Chi tiết đăng ký              | OWNER    | -                        | RegistrationDetailDTO  |
| PATCH  | `/api/v1/registrations/{id}/approve`              | Duyệt đơn                     | STAFF    | ApproveRejectRequest     | RegistrationDTO       |
| PATCH  | `/api/v1/registrations/{id}/reject`               | Từ chối đơn                   | STAFF    | ApproveRejectRequest     | RegistrationDTO       |
| PATCH  | `/api/v1/registrations/{id}/cancel`               | Hủy đăng ký                   | OWNER    | CancelRegistrationRequest| RegistrationDTO       |
| PATCH  | `/api/v1/registrations/{id}/confirm-participation` | Xác nhận tham gia            | STAFF    | -                        | RegistrationDTO       |
| PATCH  | `/api/v1/registrations/{id}/complete`             | Hoàn thành tour               | STAFF    | -                        | RegistrationDTO       |
| PATCH  | `/api/v1/registrations/{id}/no-show`              | Khách không đến               | STAFF    | -                        | RegistrationDTO       |

### 3.5. API Thanh Toán (Payment)

| Method | Endpoint                      | Mô tả                  | Role     | Request Dto           | Response Dto       |
|--------|-------------------------------|------------------------|----------|-----------------------|--------------------|
| POST   | `/api/v1/payments`            | Tạo thanh toán (cọc)   | CUSTOMER | CreatePaymentRequest  | PaymentDTO         |
| GET    | `/api/v1/payments/{id}`       | Chi tiết thanh toán    | OWNER    | -                     | PaymentDTO         |
| GET    | `/api/v1/payments`            | DS thanh toán (staff)  | STAFF    | PaymentSearchParams   | PageDTO<PaymentDTO>|
| PATCH  | `/api/v1/payments/{id}/confirm` | Xác nhận thanh toán   | STAFF    | -                     | PaymentDTO         |
| PATCH  | `/api/v1/payments/{id}/refund`  | Hoàn tiền              | STAFF    | RefundRequest         | PaymentDTO         |

### 3.6. API Đánh Giá (Review)

| Method | Endpoint                 | Mô tả                  | Role     | Request Dto          | Response Dto     |
|--------|--------------------------|------------------------|----------|----------------------|------------------|
| POST   | `/api/v1/reviews`        | Tạo đánh giá           | CUSTOMER | CreateReviewRequest  | ReviewDTO        |
| GET    | `/api/v1/reviews`        | DS đánh giá (theo tour)| PUBLIC   | tourId (query)       | PageDTO<ReviewDTO>|
| PUT    | `/api/v1/reviews/{id}`   | Sửa đánh giá           | OWNER    | UpdateReviewRequest  | ReviewDTO        |
| DELETE | `/api/v1/reviews/{id}`   | Xóa đánh giá           | OWNER    | -                    | ApiResponse      |

### 3.7. API Quản Lý Người Dùng (Admin) & Khách Thuê (Customer)

| Method | Endpoint                              | Mô tả                       | Role    | Request DTO              | Response Dto          |
|--------|---------------------------------------|------------------------------|---------|--------------------------|-----------------------|
| GET    | `/api/v1/admin/users`                 | Danh sách người dùng         | ADMIN   | CustomerSearchParams(query) | PageDTO<UserDTO>   |
| GET    | `/api/v1/admin/users/{id}`            | Xem chi tiết người dùng      | ADMIN   | -                        | CustomerDetailDTO     |
| POST   | `/api/v1/admin/users`                 | Tạo tài khoản (khách thuê)   | ADMIN   | CreateCustomerRequest    | UserDTO               |
| PUT    | `/api/v1/admin/users/{id}`            | Cập nhật thông tin người dùng| ADMIN   | AdminUpdateUserRequest   | UserDTO               |
| PATCH  | `/api/v1/admin/users/{id}/status`     | Khóa / mở khóa tài khoản     | ADMIN   | UpdateUserStatusRequest  | UserDTO               |
| POST   | `/api/v1/admin/users/{id}/reset-password` | Đặt lại mật khẩu         | ADMIN   | ResetPasswordRequest     | ApiResponse           |
| GET    | `/api/v1/admin/users/{id}/registrations` | Lịch sử đăng ký của khách| ADMIN   | RegistrationSearchParams | PageDTO<RegistrationDTO> |
| GET    | `/api/v1/admin/dashboard`             | Thống kê tổng quan           | ADMIN   | -                        | DashboardDTO          |
| GET    | `/api/v1/admin/dashboard/revenue`     | Thống kê doanh thu           | ADMIN   | RevenueSearchParams      | RevenueDTO            |

---

## 4. Chi Tiết DTO (DTO Specifications)

### 4.1. DTO Cho Auth

```csharp
// --- Request DTOs ---
public record RegisterRequest(
    string Username,
    string Password,
    string FullName,
    string Email,
    string? Phone
);

public record LoginRequest(
    string Username,
    string Password
);

public record UpdateProfileRequest(
    string? FullName,
    string? Email,
    string? Phone
);

public record ChangePasswordRequest(
    string OldPassword,
    string NewPassword
);

// --- Response DTOs ---
public record AuthResponse(
    string Token,
    UserDTO User
);

public record UserDTO(
    int Id,
    string Username,
    string FullName,
    string Email,
    string? Phone,
    string Role,
    string Status,
    DateTime CreatedAt
);
```

### 4.2. DTO Cho Tour

```csharp
// --- Request DTOs ---
public record CreateTourRequest(
    string Title,
    string Description,
    decimal Price,
    int MaxParticipants,
    DateTime StartDate,
    DateTime EndDate,
    string? Location,
    string? Category
);

public record UpdateTourRequest(
    string? Title,
    string? Description,
    decimal? Price,
    int? MaxParticipants,
    DateTime? StartDate,
    DateTime? EndDate,
    string? Location,
    string? Category
);

public record UpdateTourStatusRequest(
    string Status  // "PUBLISHED" | "CANCELLED" | "COMPLETED"
);

public record TourSearchParams(
    string? Keyword,
    string? Category,
    string? Status,
    decimal? MinPrice,
    decimal? MaxPrice,
    DateTime? FromDate,
    DateTime? ToDate,
    int Page = 1,
    int PageSize = 10
);

// --- Response DTOs ---
public record TourDTO(
    int Id,
    string Title,
    string Status,
    decimal Price,
    int MaxParticipants,
    int AvailableSlots,
    DateTime StartDate,
    DateTime EndDate,
    DateTime CreatedAt
);

public record TourDetailDTO(
    int Id,
    string Title,
    string Description,
    string Status,
    decimal Price,
    int MaxParticipants,
    int AvailableSlots,
    DateTime StartDate,
    DateTime EndDate,
    string? Location,
    string? Category,
    DateTime CreatedAt,
    List<TourImageDTO> Images
);

public record TourImageDTO(
    int Id,
    string ImageUrl,
    bool IsPrimary,
    DateTime CreatedAt
);
```

### 4.3. DTO Cho Registration

```csharp
// --- Request DTOs ---
public record CreateRegistrationRequest(
    int TourId
);

public record ApproveRejectRequest(
    string? Note
);

public record CancelRegistrationRequest(
    string Reason
);

public record RegistrationSearchParams(
    int? TourId,
    int? UserId,
    string? Status,
    DateTime? FromDate,
    DateTime? ToDate,
    int Page = 1,
    int PageSize = 10
);

// --- Response DTOs ---
public record RegistrationDTO(
    int Id,
    int TourId,
    string TourTitle,
    int UserId,
    string UserName,
    string Status,
    DateTime RegisteredAt,
    DateTime? ApprovedAt,
    DateTime? CompletedAt
);

public record RegistrationDetailDTO(
    int Id,
    TourDTO Tour,
    UserDTO User,
    string Status,
    string? Note,
    string? CancelReason,
    DateTime RegisteredAt,
    DateTime? ApprovedAt,
    DateTime? ConfirmedAt,
    DateTime? CompletedAt,
    decimal? DepositAmount,
    decimal? TotalAmount
);
```

### 4.4. DTO Cho Payment

```csharp
// --- Request DTOs ---
public record CreatePaymentRequest(
    int RegistrationId,
    decimal Amount,
    string PaymentMethod  // "CASH" | "TRANSFER" | "CARD"
);

public record RefundRequest(
    decimal Amount,
    string Reason
);

public record PaymentSearchParams(
    int? RegistrationId,
    string? Status,
    string? PaymentMethod,
    int Page = 1,
    int PageSize = 10
);

// --- Response DTOs ---
public record PaymentDTO(
    int Id,
    int RegistrationId,
    decimal Amount,
    decimal? RefundedAmount,
    string Status,
    string PaymentMethod,
    DateTime PaidAt,
    DateTime? RefundedAt
);
```

### 4.5. DTO Cho Review

```csharp
// --- Request DTOs ---
public record CreateReviewRequest(
    int TourId,
    int Rating,         // 1-5
    string? Comment
);

public record UpdateReviewRequest(
    int? Rating,
    string? Comment
);

// --- Response DTOs ---
public record ReviewDTO(
    int Id,
    int TourId,
    int UserId,
    string UserName,
    int Rating,
    string? Comment,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
```

### 4.6. DTO Cho Admin

```csharp
// --- Request DTOs ---
public record AdminUpdateUserRequest(
    string? FullName,
    string? Email,
    string? Phone,
    string? Role
);

public record UpdateUserStatusRequest(
    string Status  // "ACTIVE" | "LOCKED"
);

public record CustomerSearchParams(
    string? Keyword,
    string? Status,
    string? Role,
    int Page = 1,
    int PageSize = 10
);

public record RevenueSearchParams(
    DateTime? FromDate,
    DateTime? ToDate
);

public record ResetPasswordRequest(
    string NewPassword
);

// --- Response DTOs ---
public record DashboardDTO(
    int TotalUsers,
    int TotalTours,
    int TotalRegistrations,
    int PendingRegistrations,
    decimal TotalRevenue,
    int CompletedTours,
    int ActiveCustomers
);

public record RevenueDTO(
    DateTime Date,
    decimal Revenue,
    int RegistrationCount,
    decimal? AverageRevenue
);
```

### 4.7. DTO Cho Customer (Khách Thuê) - CHI TIẾT

```csharp
// --- Yêu cầu: Quản lý khách thuê (Customer CRUD)
// Admin cần: tạo, xem DS, xem chi tiết, sửa, khóa/mở, reset password, xem lịch sử đăng ký

// ====== REQUEST DTOs ======

/// <summary>
/// Tạo tài khoản khách thuê (bởi Admin)
/// Khi admin tạo, account tự động ACTIVE
/// </summary>
public record CreateCustomerRequest(
    string Username,
    string Password,
    string FullName,
    string Email,
    string? Phone,
    string? Address
);

/// <summary>
/// Admin cập nhật thông tin khách thuê
/// Chỉ update các field cho phép (không cho đổi username, password)
/// </summary>
public record AdminUpdateUserRequest(
    string? FullName,
    string? Email,
    string? Phone,
    string? Address
);

/// <summary>
/// Khóa / Mở khóa tài khoản
/// Rules:
///   - SR-05: Admin không được khóa chính mình
///   - SR-06: Không khóa được account STAFF/ADMIN khác
///   - Khi LOCKED -> user không thể login
/// </summary>
public record UpdateUserStatusRequest(
    string Status  // "ACTIVE" | "LOCKED"
);

/// <summary>
/// Reset mật khẩu (bởi Admin)
/// Không cần nhập mật khẩu cũ
/// </summary>
public record ResetPasswordRequest(
    string NewPassword
);

/// <summary>
/// Search params cho danh sách khách thuê
/// Mặc định chỉ search role = CUSTOMER
/// </summary>
public record CustomerSearchParams(
    string? Keyword,       // search theo fullName, email, phone, username
    string? Status,        // "ACTIVE" | "LOCKED" | null
    int Page = 1,
    int PageSize = 10,
    string SortBy = "CreatedAt",     // "FullName" | "Email" | "CreatedAt"
    string SortDirection = "DESC"    // "ASC" | "DESC"
);

// ====== RESPONSE DTOs ======

/// <summary>
/// DTO cho danh sách khách thuê (bảng)
/// Admin thấy: id, username, fullName, email, phone, status, totalRegistrations, createdAt
/// </summary>
public record UserDTO(
    int Id,
    string Username,
    string FullName,
    string Email,
    string? Phone,
    string Role,
    string Status,
    DateTime CreatedAt
);

/// <summary>
/// DTO cho trang chi tiết khách thuê
/// Gồm thông tin + thống kê
/// </summary>
public record CustomerDetailDTO(
    int Id,
    string Username,
    string FullName,
    string Email,
    string? Phone,
    string? Address,
    string Role,
    string Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    DateTime? LastLoginAt,

    // Stats
    int TotalRegistrations,
    int ApprovedRegistrations,
    int CompletedRegistrations,
    int CancelledRegistrations,
    decimal TotalSpent,

    // Gần đây
    List<RegistrationDTO> RecentRegistrations,
    List<PaymentDTO> RecentPayments
);

// ====== PAGING ======

/// <summary>
/// Generic paged response wrapper
/// </summary>
public record PageDTO<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);
```

### Quy Tắc API Cho Customer CRUD

| Rule    | Mô tả                                                        |
|---------|--------------------------------------------------------------|
| SR-01   | `POST /admin/users` — Username phải unique trong DB          |
| SR-02   | `POST /admin/users` — Email phải unique trong DB             |
| SR-03   | `POST /admin/users` — Tạo xong tự động ACTIVE, không cần verify email |
| SR-04   | `PUT /admin/users/{id}` — Không cho đổi username, role, password |
| SR-05   | `PATCH .../status` — Admin không được khóa chính mình        |
| SR-06   | `PATCH .../status` — Không khóa được account STAFF/ADMIN khác |
| SR-07   | `POST .../reset-password` — Không cần OTP, không cần mật khẩu cũ |
| SR-08   | `GET /admin/users?role=CUSTOMER` — Mặc định chỉ lấy CUSTOMER |
| SR-09   | Xóa vật lý KHÔNG được phép — archive/deactivate là cách duy nhất |

---

## 5. Database Schema

### 5.1. Entity Relationship Diagram (Text)

```
┌──────────┐     ┌──────────────┐     ┌────────────────┐
│   User   │1──N→│ Registration │N──1│     Tour       │
│          │     │              │     │                │
│ PK: Id   │     │ PK: Id       │     │ PK: Id         │
│ Username │     │ FK: UserId   │     │ Title          │
│ Password │     │ FK: TourId   │     │ Price          │
│ FullName │     │ Status       │     │ MaxParticipants│
│ Email    │     │ Note         │     │ StartDate      │
│ Phone    │     │ CreatedAt    │     │ EndDate        │
│ Role     │     │ ApprovedAt   │     │ Status         │
│ Status   │     │ CompletedAt  │     │ CreatedAt      │
│ CreatedAt│     │ UpdatedAt    │     │ UpdatedAt      │
│ UpdatedAt│     └──────┬───────┘     └────────────────┘
│ LastLogin│            │ 1                        │ 1
└──────────┘            │                         │
                        │ N                       │ N
                   ┌────▼───────┐          ┌──────▼──────┐
                   │  Payment   │          │  TourImage  │
                   │            │          │             │
                   │ PK: Id     │          │ PK: Id      │
                   │ FK: RegId  │          │ FK: TourId  │
                   │ Amount     │          │ ImageUrl    │
                   │ Status     │          │ IsPrimary   │
                   │ Method     │          │ CreatedAt   │
                   │ PaidAt     │          └─────────────┘
                   │ RefundedAt │
                   └────────────┘

┌──────────────┐
│    Review    │
│              │
│ PK: Id       │
│ FK: TourId   │
│ FK: UserId   │
│ Rating (1-5) │
│ Comment      │
│ CreatedAt    │
│ UpdatedAt    │
└──────────────┘
```

### 5.2. SQL Server Tables

```sql
-- Users table (chứa cả Customer, Staff, Admin)
CREATE TABLE Users (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Username        NVARCHAR(50)   NOT NULL UNIQUE,
    PasswordHash    NVARCHAR(255)  NOT NULL,
    FullName        NVARCHAR(100)  NOT NULL,
    Email           NVARCHAR(100)  NOT NULL UNIQUE,
    Phone           NVARCHAR(20)   NULL,
    Address         NVARCHAR(255)  NULL,
    Role            NVARCHAR(20)   NOT NULL DEFAULT 'CUSTOMER',  -- CUSTOMER, STAFF, ADMIN
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',    -- ACTIVE, LOCKED
    CreatedAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2      NULL,
    LastLoginAt     DATETIME2      NULL
);

-- Tours table
CREATE TABLE Tours (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Title           NVARCHAR(200)  NOT NULL,
    Description     NVARCHAR(MAX)  NULL,
    Price           DECIMAL(18,2)  NOT NULL,
    MaxParticipants INT            NOT NULL,
    StartDate       DATETIME2      NOT NULL,
    EndDate         DATETIME2      NOT NULL,
    Location        NVARCHAR(200)  NULL,
    Category        NVARCHAR(100)  NULL,
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'DRAFT',  -- DRAFT, PUBLISHED, CANCELLED, COMPLETED
    CreatedAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2      NULL
);

-- TourImages table
CREATE TABLE TourImages (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    TourId          INT            NOT NULL REFERENCES Tours(Id),
    ImageUrl        NVARCHAR(500)  NOT NULL,
    IsPrimary       BIT            NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

-- Registrations table
CREATE TABLE Registrations (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    UserId          INT            NOT NULL REFERENCES Users(Id),
    TourId          INT            NOT NULL REFERENCES Tours(Id),
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    Note            NVARCHAR(500)  NULL,
    CancelReason    NVARCHAR(500)  NULL,
    CreatedAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    ApprovedAt      DATETIME2      NULL,
    ConfirmedAt     DATETIME2      NULL,
    CompletedAt     DATETIME2      NULL,
    UpdatedAt       DATETIME2      NULL
);

-- Payments table
CREATE TABLE Payments (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    RegistrationId  INT            NOT NULL REFERENCES Registrations(Id),
    Amount          DECIMAL(18,2)  NOT NULL,
    RefundedAmount  DECIMAL(18,2)  NULL,
    PaymentMethod   NVARCHAR(20)   NOT NULL,  -- CASH, TRANSFER, CARD
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'PENDING',  -- PENDING, COMPLETED, REFUNDED
    PaidAt          DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    RefundedAt      DATETIME2      NULL
);

-- Reviews table
CREATE TABLE Reviews (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    TourId          INT            NOT NULL REFERENCES Tours(Id),
    UserId          INT            NOT NULL REFERENCES Users(Id),
    Rating          INT            NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment         NVARCHAR(1000) NULL,
    CreatedAt       DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2      NULL
);
```

---

## 6. Business Rules & Validation

### 6.1. FluentValidation Rules

| DTO                        | Rule                                      |
|----------------------------|-------------------------------------------|
| RegisterRequest            | Username >= 3 ký tự, Email đúng format, Password >= 6 ký tự |
| LoginRequest               | Username không được rỗng, Password không được rỗng |
| CreateTourRequest          | Title >= 5 ký tự, Price >= 0, MaxParticipants >= 1 |
| CreateRegistrationRequest  | TourId > 0                                |
| CreatePaymentRequest       | Amount >= 0, RegistrationId > 0           |
| CreateReviewRequest        | Rating >= 1 và <= 5, TourId > 0           |
| UpdateUserStatusRequest    | Status phải là "ACTIVE" hoặc "LOCKED"     |
| CreateCustomerRequest      | Username >= 3, Password >= 6, Email hợp lệ |
| ResetPasswordRequest       | NewPassword >= 6 ký tự                    |

### 6.2. Validation Error Response Format

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "Username": ["Username phải có ít nhất 3 ký tự"],
    "Email": ["Email không đúng định dạng"],
    "Password": ["Password phải có ít nhất 6 ký tự"]
  }
}
```

---

## 7. Cấu Trúc Thư Mục (Project Structure)

### 7.1. Backend (ASP.NET Core)

```
backend/
├── PMC.sln
├── src/
│   ├── PMC.Api/                     # Web API project
│   │   ├── Program.cs               # DI, middleware, CORS, JWT config
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── TourController.cs
│   │   │   ├── RegistrationController.cs
│   │   │   ├── PaymentController.cs
│   │   │   ├── ReviewController.cs
│   │   │   ├── AdminController.cs    # Dashboard
│   │   │   └── UsersController.cs    # Customer CRUD
│   │   └── Middleware/
│   │       └── ExceptionMiddleware.cs
│   │
│   ├── PMC.Application/             # Application / Use Cases
│   │   ├── Services/
│   │   │   ├── AuthService.cs
│   │   │   ├── TourService.cs
│   │   │   ├── RegistrationService.cs
│   │   │   ├── PaymentService.cs
│   │   │   ├── ReviewService.cs
│   │   │   ├── UserService.cs       # Customer CRUD logic
│   │   │   └── DashboardService.cs
│   │   ├── DTOs/
│   │   │   ├── Auth/
│   │   │   ├── Tour/
│   │   │   ├── Registration/
│   │   │   ├── Payment/
│   │   │   ├── Review/
│   │   │   ├── Admin/
│   │   │   └── Common/
│   │   │       └── PageDTO.cs
│   │   └── Validators/
│   │       ├── AuthValidators.cs
│   │       ├── TourValidators.cs
│   │       ├── RegistrationValidators.cs
│   │       ├── PaymentValidators.cs
│   │       ├── ReviewValidators.cs
│   │       └── AdminValidators.cs
│   │
│   ├── PMC.Domain/                  # Domain / Entities
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Tour.cs
│   │   │   ├── TourImage.cs
│   │   │   ├── Registration.cs
│   │   │   ├── Payment.cs
│   │   │   └── Review.cs
│   │   ├── Enums/
│   │   │   ├── UserRole.cs
│   │   │   ├── UserStatus.cs
│   │   │   ├── TourStatus.cs
│   │   │   ├── RegistrationStatus.cs
│   │   │   ├── PaymentStatus.cs
│   │   │   └── PaymentMethod.cs
│   │   ├── Interfaces/
│   │   │   └── IRepository.cs
│   │   └── ValueObjects/
│   │       ├── Money.cs             # Giá trị tiền tệ
│   │       └── Rating.cs            # Rating 1-5
│   │
│   ├── PMC.Infrastructure/          # Data Access / External
│   │   ├── Data/
│   │   │   ├── AppDbContext.cs
│   │   │   └── Configurations/      # Entity Fluent API configs
│   │   │       ├── UserConfiguration.cs
│   │   │       ├── TourConfiguration.cs
│   │   │       └── ...
│   │   ├── Repositories/
│   │   │   └── EfRepository.cs
│   │   └── Services/
│   │       └── JwtService.cs
│   │
│   └── PMC.Shared/                  # Shared kernel
│       └── ApiResponse.cs
│
├── tests/
│   ├── PMC.UnitTests/
│   └── PMC.IntegrationTests/
│
└── sql/
    ├── 001_CreateTables.sql
    └── 002_SeedData.sql
```
### 7.2. Frontend (Next.js)

```
frontend/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── tours/
│   │   │   ├── page.tsx          # Danh sách tour (public)
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Chi tiết tour
│   │   │   ├── create/
│   │   │   │   └── page.tsx      # Tạo tour (staff)
│   │   │   └── manage/
│   │   │       └── page.tsx      # Quản lý tour (staff)
│   │   ├── customers/
│   │   │   ├── page.tsx          # Danh sách khách thuê (admin)
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Chi tiết khách thuê (admin)
│   │   ├── registrations/
│   │   │   ├── page.tsx          # DS đăng ký (staff)
│   │   │   └── my/
│   │   │       └── page.tsx      # Đăng ký của tôi (customer)
│   │   └── dashboard/
│   │       └── page.tsx          # Dashboard (admin/staff)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── customers/
│   │   │   ├── CustomerTable.tsx
│   │   │   ├── CustomerFilter.tsx
│   │   │   ├── CustomerForm.tsx       # Create/Edit modal
│   │   │   ├── CustomerDetail.tsx
│   │   │   └── CustomerStatusToggle.tsx
│   │   └── tours/
│   │       └── TourCard.tsx
│   ├── services/
│   │   ├── api.ts                 # Axios instance + interceptors
│   │   ├── auth.service.ts
│   │   ├── tour.service.ts
│   │   ├── customer.service.ts    # API calls cho khách thuê
│   │   ├── registration.service.ts
│   │   ├── payment.service.ts
│   │   └── dashboard.service.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCustomers.ts
│   │   ├── useTours.ts
│   │   └── useDebounce.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── tour.ts
│   │   ├── registration.ts
│   │   ├── payment.ts
│   │   ├── review.ts
│   │   └── api.ts
│   └── utils/
│       ├── format.ts
│       ├── validators.ts
│       └── constants.ts
```

---

## 8. Danh Sách Công Việc Triển Khai (Implementation Tasks)

### 8.1. Backend (ASP.NET Core)

| STT | Module               | Nội dung                                              | Ưu tiên |
|-----|----------------------|-------------------------------------------------------|---------|
| 1   | **Project Setup**    | Tạo solution, config DB (SQL Server), JWT, CORS       | CAO     |
| 2   | **Entities + DB**    | Tạo Entities, DbContext, Migrations, Seed Data        | CAO     |
| 3   | **Auth Module**      | Register, Login, JWT generation, profile, đổi mật khẩu | CAO    |
| 4   | **Customer CRUD**    | Danh sách, tạo, sửa, khóa/mở, reset pass, detail      | CAO     |
| 5   | **Tour Module**      | CRUD tour, search, status mgmt, images                | CAO     |
| 6   | **Registration**     | Đăng ký, duyệt, từ chối, hủy, xác nhận tham gia       | CAO     |
| 7   | **State Machine**    | State validation, transition rules (Tour, Registration)| CAO     |
| 8   | **Payment Module**   | Tạo, xác nhận, hoàn tiền                              | TRUNG   |
| 9   | **Review Module**    | Tạo, sửa, xóa đánh giá                                | TRUNG   |
| 10  | **Dashboard**        | Thống kê tổng quan, doanh thu                         | TRUNG   |
| 11  | **Exception Handler**| Global exception handling + FluentValidation          | CAO     |
| 12  | **API Doc**          | Swagger / OpenAPI (Swashbuckle)                       | THẤP    |
| 13  | **Testing**          | Unit test (xUnit), Integration test                   | THẤP    |

### 8.2. Frontend (Next.js)

| STT | Module                    | Nội dung                                               | Ưu tiên |
|-----|---------------------------|--------------------------------------------------------|---------|
| 1   | **Project Setup**         | Khởi tạo Next.js, Tailwind CSS, Axios, React Query     | CAO     |
| 2   | **UI Components**         | Button, Table, Modal, Pagination, SearchBar, etc.      | CAO     |
| 3   | **Auth UI**               | Login page, Register page, AuthGuard, JWT storage      | CAO     |
| 4   | **Customer Management**   | Customer list, search, create/edit form, lock/unlock   | CAO     |
| 5   | **Tour UI**               | Tour list (public), tour detail, create/edit form      | CAO     |
| 6   | **Registration UI**       | Registration form, approve/reject, my registrations    | CAO     |
| 7   | **Payment UI**            | Payment form, payment history, confirm/refund          | TRUNG   |
| 8   | **Review UI**             | Review form, review list                               | TRUNG   |
| 9   | **Dashboard UI**          | Thống kê, biểu đồ, báo cáo                             | TRUNG   |
| 10  | **Layout & Navigation**   | Sidebar, Header, responsive layout                     | CAO     |
| 11  | **Connect & Test**        | Kết nối API, test luồng end-to-end                     | CAO     |

---

## 9. API Endpoint Summary (Tổng Hợp)

| #  | Method | Endpoint                                          | Role     | Request                          | Response                 |
|----|--------|---------------------------------------------------|----------|----------------------------------|--------------------------|
| 1  | POST   | /api/v1/auth/register                             | PUBLIC   | RegisterRequest                  | AuthResponse             |
| 2  | POST   | /api/v1/auth/login                                | PUBLIC   | LoginRequest                     | AuthResponse             |
| 3  | POST   | /api/v1/auth/logout                               | AUTH     | -                                | ApiResponse              |
| 4  | GET    | /api/v1/auth/profile                              | AUTH     | -                                | UserDTO                  |
| 5  | PUT    | /api/v1/auth/profile                              | AUTH     | UpdateProfileRequest             | UserDTO                  |
| 6  | PUT    | /api/v1/auth/password                             | AUTH     | ChangePasswordRequest            | ApiResponse              |
| 7  | GET    | /api/v1/tours                                     | PUBLIC   | TourSearchParams (query)         | PageDTO<TourDTO>         |
| 8  | GET    | /api/v1/tours/{id}                                | PUBLIC   | -                                | TourDetailDTO            |
| 9  | POST   | /api/v1/tours                                     | STAFF    | CreateTourRequest                | TourDTO                  |
| 10 | PUT    | /api/v1/tours/{id}                                | STAFF    | UpdateTourRequest                | TourDTO                  |
| 11 | PATCH  | /api/v1/tours/{id}/status                         | STAFF    | UpdateTourStatusRequest          | TourDTO                  |
| 12 | DELETE | /api/v1/tours/{id}                                | ADMIN    | -                                | ApiResponse              |
| 13 | GET    | /api/v1/tours/{id}/images                         | PUBLIC   | -                                | List<TourImageDTO>       |
| 14 | POST   | /api/v1/tours/{id}/images                         | STAFF    | CreateTourImageRequest           | TourImageDTO             |
| 15 | DELETE | /api/v1/tours/{id}/images/{imageId}               | STAFF    | -                                | ApiResponse              |
| 16 | POST   | /api/v1/registrations                             | CUSTOMER | CreateRegistrationRequest        | RegistrationDTO          |
| 17 | GET    | /api/v1/registrations                             | STAFF    | RegistrationSearchParams (query) | PageDTO<RegistrationDTO>|
| 18 | GET    | /api/v1/registrations/my                          | CUSTOMER | -                                | PageDTO<RegistrationDTO>|
| 19 | GET    | /api/v1/registrations/{id}                        | OWNER    | -                                | RegistrationDetailDTO    |
| 20 | PATCH  | /api/v1/registrations/{id}/approve                | STAFF    | ApproveRejectRequest             | RegistrationDTO          |
| 21 | PATCH  | /api/v1/registrations/{id}/reject                 | STAFF    | ApproveRejectRequest             | RegistrationDTO          |
| 22 | PATCH  | /api/v1/registrations/{id}/cancel                 | OWNER    | CancelRegistrationRequest        | RegistrationDTO          |
| 23 | PATCH  | /api/v1/registrations/{id}/confirm-participation   | STAFF    | -                                | RegistrationDTO          |
| 24 | PATCH  | /api/v1/registrations/{id}/complete               | STAFF    | -                                | RegistrationDTO          |
| 25 | PATCH  | /api/v1/registrations/{id}/no-show                | STAFF    | -                                | RegistrationDTO          |
| 26 | POST   | /api/v1/payments                                  | CUSTOMER | CreatePaymentRequest             | PaymentDTO               |
| 27 | GET    | /api/v1/payments/{id}                             | OWNER    | -                                | PaymentDTO               |
| 28 | GET    | /api/v1/payments                                  | STAFF    | PaymentSearchParams (query)      | PageDTO<PaymentDTO>      |
| 29 | PATCH  | /api/v1/payments/{id}/confirm                     | STAFF    | -                                | PaymentDTO               |
| 30 | PATCH  | /api/v1/payments/{id}/refund                      | STAFF    | RefundRequest                    | PaymentDTO               |
| 31 | POST   | /api/v1/reviews                                   | CUSTOMER | CreateReviewRequest              | ReviewDTO                |
| 32 | GET    | /api/v1/reviews                                   | PUBLIC   | tourId (query)                   | PageDTO<ReviewDTO>       |
| 33 | PUT    | /api/v1/reviews/{id}                              | OWNER    | UpdateReviewRequest              | ReviewDTO                |
| 34 | DELETE | /api/v1/reviews/{id}                              | OWNER    | -                                | ApiResponse              |
| 35 | GET    | /api/v1/admin/users                               | ADMIN    | UserSearchParams (query)         | PageDTO<UserDTO>         |
| 36 | GET    | /api/v1/admin/users/{id}                          | ADMIN    | -                                | CustomerDetailDTO        |
| 37 | POST   | /api/v1/admin/users                               | ADMIN    | CreateCustomerRequest            | UserDTO                  |
| 38 | PUT    | /api/v1/admin/users/{id}                          | ADMIN    | AdminUpdateUserRequest           | UserDTO                  |
| 39 | PATCH  | /api/v1/admin/users/{id}/status                   | ADMIN    | UpdateUserStatusRequest          | UserDTO                  |
| 40 | POST   | /api/v1/admin/users/{id}/reset-password           | ADMIN    | ResetPasswordRequest             | ApiResponse              |
| 41 | GET    | /api/v1/admin/users/{id}/registrations            | ADMIN    | RegistrationSearchParams (query) | PageDTO<RegistrationDTO>|
| 42 | GET    | /api/v1/admin/dashboard                           | ADMIN    | -                                | DashboardDTO             |
| 43 | GET    | /api/v1/admin/dashboard/revenue                   | ADMIN    | RevenueSearchParams (query)      | RevenueDTO               |

**Tổng cộng: 43 endpoints** (6 Auth + 9 Tour + 10 Registration + 5 Payment + 4 Review + 9 Admin/Customer)

---

## 10. Kết Nối UI Quản Lý (Management UI Connection)

### 10.1. Kiến Trúc Kết Nối

```
Browser (Next.js App)
       |
       | Axios HTTP Client
       | JWT Bearer Token (localStorage)
       v
+------------------------------------------+
|       Next.js API Service Layer            |
|  (services/customer.service.ts)            |
|  Axios Instance + Interceptors             |
|  React Query / SWR cho caching             |
+------------------+-----------------------+
                   |
                   | REST API /api/v1/admin/users/*
                   | CORS: localhost:3000 -> localhost:5000
                   v
+------------------------------------------+
|     ASP.NET Core Controllers              |
|  CustomersController / AdminController     |
|  [Authorize(Roles = "ADMIN")]              |
+------------------------------------------+
```

### 10.2. Authentication Flow (JWT)

**Chi tiết flow:**
1. User đăng nhập -> API trả JWT token + thông tin user
2. Next.js lưu JWT vào localStorage / httpOnly cookie
3. Axios interceptor tự động gắn Authorization: Bearer <token> vào mọi request
4. Nếu API trả 401 -> Axios interceptor redirect về /login
5. React Query quản lý caching + refetch tự động

### 10.3. Customer Management UI - Chi Tiết Kết Nối

| Màn hình           | Route                  | API Endpoint                       | Method | Mô tả                          |
|--------------------|------------------------|------------------------------------|--------|--------------------------------|
| Danh sách khách    | /customers             | /api/v1/admin/users?...            | GET    | Bảng + search + filter + phân trang |
| Tạo khách          | /customers/create      | /api/v1/admin/users                | POST   | Form tạo tài khoản khách       |
| Chi tiết khách     | /customers/{id}        | /api/v1/admin/users/{id}           | GET    | Thông tin + thống kê + lịch sử |
| Sửa thông tin      | /customers/{id}        | /api/v1/admin/users/{id}           | PUT    | Form edit inline               |
| Khóa / mở khóa     | (toggle trên bảng)     | /api/v1/admin/users/{id}/status    | PATCH  | Toggle switch                   |
| Reset mật khẩu     | (modal)                | /api/v1/admin/users/{id}/reset-password | POST | Modal xác nhận + nhập mk mới |
| Lịch sử đăng ký    | /customers/{id}        | /api/v1/admin/users/{id}/registrations | GET | Tab trong trang chi tiết      |

#### 10.4 Component Tree (Admin UI)

```
pages/admin/
├── AdminLayout.tsx            # Layout: sidebar + header + outlet
├── Dashboard.tsx              # Tổng quan: doanh thu, tour, khách mới
├── tours/
│   ├── TourList.tsx           # Bảng danh sách tour (DataTable)
│   ├── TourCreate.tsx         # Form tạo tour (react-hook-form)
│   └── TourDetail.tsx         # Chi tiết tour + quản lý ngày khởi hành
├── bookings/
│   ├── BookingList.tsx        # Bảng danh sách booking
│   └── BookingDetail.tsx      # Chi tiết booking + lịch sử trạng thái
├── customers/
│   ├── CustomerList.tsx       # Bảng danh sách khách + search/filter/toggle
│   ├── CustomerCreate.tsx     # Form tạo tài khoản khách
│   └── CustomerDetail.tsx     # Chi tiết khách + tab thống kê + tab lịch sử
├── payments/
│   └── PaymentList.tsx        # Bảng danh sách thanh toán
├── reports/
│   └── ReportDashboard.tsx    # Biểu đồ doanh thu, booking, khách (Chart.js)
└── settings/
    └── SettingsPage.tsx       # Cấu hình hệ thống (commission, VAT, v.v.)
```

#### 10.5 Data Flow Example (Customer CRUD)

```
[CustomerList]                          [CustomerCreate]                     [CustomerDetail]
     │                                        │                                    │
     ├─ useQuery('/admin/users')              ├─ useMutation POST /admin/users      ├─ useQuery('/admin/users/{id}')
     │     │                                  │     │                               │     │
     │     ▼                                  │     ▼                               │     ▼
     │  [Axios: GET]                          │  [Axios: POST]                      │  [Axios: GET]
     │     │                                  │     │                               │     │
     │     ▼                                  │     ▼                               │     ▼
     │  ApiResponse<PaginatedResult<          │  ApiResponse<UserDto>               │  ApiResponse<UserDetailDto>
     │    UserListItemDto>>                   │     │                               │     │
     │     │                                  │     ▼                               │     ▼
     │     ▼                                  │  Hiển thị toast success             │  Hiển thị thông tin khách
     │  Render bảng + phân trang              │  + refetch danh sách                │  + tabs: thống kê, lịch sử
     │
     ├─ StatusToggleCell                      [CustomerDetail]
     │     ├─ useMutation PATCH /admin/users/{id}/status      │
     │     │     │                                            ├─ RegistrationsTab
     │     │     ▼                                            │     └─ useQuery('/admin/users/{id}/registrations')
     │     │  ApiResponse<StatusUpdateDto>                    │
     │     │     │                                            └─ BookingHistoryTab
     │     │     ▼                                                  └─ useQuery('/admin/bookings?customerId={id}')
     │     │  Toast + invalidate query
     │     │
     │     └─ ResetPasswordModal
     │           └─ useMutation POST /admin/users/{id}/reset-password
```

#### 10.6 Axios Service Layer (TypeScript)

```typescript
// src/services/api.ts — Axios instance với interceptor
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

```typescript
// src/services/customerService.ts
import api from './api';
import type { UserDto, UserCreateDto, UserUpdateDto,
  UserListItemDto, PaginatedResult, ApiResponse } from '@/types';

export const customerService = {
  getAll: (params: Record<string, any>) =>
    api.get<ApiResponse<PaginatedResult<UserListItemDto>>>('/admin/users', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<UserDetailDto>>(`/admin/users/${id}`),

  create: (data: UserCreateDto) =>
    api.post<ApiResponse<UserDto>>('/admin/users', data),

  update: (id: number, data: UserUpdateDto) =>
    api.put<ApiResponse<UserDto>>(`/admin/users/${id}`, data),

  toggleStatus: (id: number) =>
    api.patch<ApiResponse<StatusUpdateDto>>(`/admin/users/${id}/status`),

  resetPassword: (id: number, newPassword: string) =>
    api.post<ApiResponse<{}>>(`/admin/users/${id}/reset-password`, { newPassword }),
};
```

#### 10.7 React Query Hooks

```typescript
// src/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';

export const CUSTOMERS_KEY = ['customers'] as const;

export function useCustomerList(params: Record<string, any>) {
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, params],
    queryFn: () => customerService.getAll(params),
    select: (res) => res.data.data,
  });
}

export function useCustomerDetail(id: number) {
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, id],
    queryFn: () => customerService.getById(id),
    select: (res) => res.data.data,
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCreateDto) => customerService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateDto }) =>
      customerService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}

export function useToggleCustomerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customerService.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}
```

#### 10.8 CORS Configuration (Backend)

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendApp", policy =>
    {
        policy.WithOrigins(
            builder.Configuration["Cors:Origins"] ?? "http://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Sử dụng: app.UseCors("FrontendApp");
```

```json
// appsettings.json
{
  "Cors": {
    "Origins": "http://localhost:3000"
  }
}
```

#### 10.9 Port Mapping

| Service    | Port  | URL                          | Notes                        |
|------------|-------|------------------------------|------------------------------|
| Backend    | 5000  | http://localhost:5000         | ASP.NET Core (Kestrel)       |
| Swagger    | 5000  | http://localhost:5000/swagger | OpenAPI UI                   |
| Frontend   | 3000  | http://localhost:3000         | Next.js dev server           |
| SQL Server | 1433  | localhost:1433                | Database                     |

---

## 11. Deployment & DevOps

_(Mục này sẽ được bổ sung sau khi hoàn thiện các section trên)_

## 12. Risks & Mitigation

_(Mục này sẽ được bổ sung sau khi hoàn thiện các section trên)_
