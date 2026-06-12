# Nghiên cứu thiết kế Backend — PMC Tour Management

> **Mục đích**: Phân tích frontend (Next.js 16, React 19, TypeScript) để thiết kế backend hoàn chỉnh (entities, database schema, REST API).
> **Ngày**: 12/06/2026

---

## I. Tổng quan kiến trúc Frontend

### Công nghệ chính
| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios |
| Server State | TanStack React Query v5 |
| Form Handling | Formik + Yup (trong `CustomerForm`) |
| Notification | React Hot Toast |

### Cấu trúc thư mục
```
frontend/src/
├── app/            # Pages (App Router)
│   ├── layout.tsx  # Root layout
│   ├── page.tsx    # Home
│   ├── about/
│   ├── contact/
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── tours/
│   │   ├── page.tsx        # Tour list
│   │   ├── [id]/page.tsx   # Tour detail
│   │   ├── create/
│   │   └── manage/
│   ├── customers/
│   │   ├── page.tsx        # Customer list (admin)
│   │   └── [id]/page.tsx   # Customer detail (admin)
│   ├── registrations/
│   │   ├── page.tsx        # All registrations (admin)
│   │   └── my/page.tsx     # My registrations (customer)
│   ├── payments/
│   └── dashboard/
│       └── page.tsx
├── components/     # Shared components
├── hooks/          # Custom hooks (useAuth, useCustomers, useTours)
├── services/       # API service layer
├── types/          # TypeScript definitions
└── utils/          # Constants, formatters, validators
```

### Authentication Flow
- JWT token lưu trong `localStorage` (key: `token`)
- `useAuth` hook quản lý: login, register, logout, forgot-password
- `AuthGuard` HOC redirect về `/login` nếu chưa auth
- Token gửi qua header `Authorization: Bearer <token>` (Axios interceptor)
- **Không có refresh token mechanism** → backend cần implement nếu muốn bảo mật cao hơn

---

## II. Phân tích Entities (từ TypeScript types)

### 2.1 User (`types/user.ts`)
```typescript
interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Login request
interface LoginRequest { email: string; password: string; }
// Register request
interface RegisterRequest { email: string; password: string; name: string; phone?: string; }
// Auth response
interface AuthResponse { user: User; token: string; }
```

**Phân tích**: User đơn giản, hai role (CUSTOMER/ADMIN). Không có email verification flag, không có status (active/banned). Cần bổ sung cho production.

### 2.2 Tour (`types/tour.ts`)
```typescript
interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;      // Giá gốc (để hiển thị khuyến mãi)
  duration: number;            // Số ngày
  durationType?: 'DAYS' | 'HOURS' | 'NIGHTS';
  maxParticipants: number;
  startDate?: string;          // ISO date — tour có lịch cố định
  endDate?: string;
  location: string;
  destination?: string;        // Điểm đến chính
  coordinates?: { lat: number; lng: number; };
  category?: string;           // 'ADVENTURE' | 'CULTURE' | 'RELAXATION' | 'FOOD' | 'NATURE'
  includes?: string[];         // Bao gồm
  excludes?: string[];         // Không bao gồm
  itinerary?: ItineraryItem[]; // Lịch trình chi tiết
  images?: TourImage[];
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'FULLY_BOOKED';
  rating?: number;             // Điểm trung bình (tính từ reviews)
  reviewCount?: number;
  availableSlots?: number;     // Số chỗ còn trống
  createdAt: Date;
  updatedAt: Date;
}

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  meals?: string[];            // 'BREAKFAST' | 'LUNCH' | 'DINNER'
  activities?: string[];
  accommodation?: string;
}

interface TourImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

// API types
interface TourListResponse { data: Tour[]; pagination: Pagination; }
interface TourFilters {
  search?: string; location?: string; category?: string;
  minPrice?: number; maxPrice?: number; duration?: number;
  status?: string; sortBy?: string; page?: number; limit?: number;
}
```

**Phân tích**: Tour giàu field nhất. Có itinerary, images, filter phức tạp. Cần full-text search. `availableSlots` tính động từ `maxParticipants - registrations CONFIRMED`.

### 2.3 Registration (`types/registration.ts`)
```typescript
interface Registration {
  id: string;
  tourId: string;
  userId: string;
  participants: number;         // Số người tham gia
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  tour?: Tour;                 // Populated
  user?: User;                 // Populated
  payment?: Payment;           // Populated
  createdAt: Date;
  updatedAt: Date;
}

interface CreateRegistrationRequest {
  tourId: string;
  participants: number;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
}
```

**Phân tích**: Registration kết nối User + Tour. `totalPrice` tính từ `tour.price * participants`. Có thể có discount về sau.

### 2.4 Payment (`types/payment.ts`)
```typescript
interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'MOMO' | 'VNPAY';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  paidAt?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Phân tích**: Payment gắn với Registration (1-1). Hỗ trợ nhiều phương thức thanh toán VN.

### 2.5 Review (`types/review.ts`)
```typescript
interface Review {
  id: string;
  tourId: string;
  userId: string;
  rating: number;              // 1-5
  comment: string;
  user?: User;                 // Populated
  createdAt: Date;
  updatedAt: Date;
}
```

**Phân tích**: Review gắn với Tour + User. Mỗi user chỉ review 1 lần/tour.

### 2.6 API Common (`types/api.ts`)
```typescript
interface ApiResponse<T> { success: boolean; data: T; message?: string; }
interface Pagination { page: number; limit: number; total: number; totalPages: number; }
interface ApiError { success: false; message: string; errors?: Record<string, string[]>; }

// Contact form (không có type riêng, suy từ Contact page)
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Dashboard (suy từ Dashboard page)
interface DashboardStats {
  totalTours: number;
  totalCustomers: number;
  totalRegistrations: number;
  totalRevenue: number;
  recentRegistrations: Registration[];
  monthlyStats: { month: string; revenue: number; registrations: number; }[];
}
```

---

## III. Thiết kế Database Schema (PostgreSQL)

### 3.1 Entity-Relationship Diagram (Text)

```
users ──1:N──> registrations ──1:1──> payments
tours ──1:N──> registrations
tours ──1:N──> tour_images
tours ──1:N──> reviews
users ──1:N──> reviews
users ──1:N──> contacts (nếu lưu contact vào DB)
```

### 3.2 Tables

#### Bảng: `users`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| email | VARCHAR(255) | NOT NULL, UNIQUE, INDEX | |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt |
| name | VARCHAR(100) | NOT NULL | |
| phone | VARCHAR(20) | NULLABLE | |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'CUSTOMER' | CHECK IN ('CUSTOMER','ADMIN') |
| avatar | VARCHAR(500) | NULLABLE | URL |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Bổ sung so với frontend |
| email_verified_at | TIMESTAMPTZ | NULLABLE | Bổ sung |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Indexes**:
- `idx_users_email` ON (email) UNIQUE
- `idx_users_role` ON (role)

#### Bảng: `tours`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| title | VARCHAR(200) | NOT NULL | |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | SEO-friendly |
| description | TEXT | NOT NULL | |
| price | DECIMAL(12,2) | NOT NULL, CHECK >= 0 | |
| original_price | DECIMAL(12,2) | NULLABLE, CHECK >= 0 | Giá gốc (khuyến mãi) |
| duration | INTEGER | NOT NULL, CHECK > 0 | |
| duration_type | VARCHAR(10) | NOT NULL, DEFAULT 'DAYS' | CHECK IN ('DAYS','HOURS','NIGHTS') |
| max_participants | INTEGER | NOT NULL, CHECK > 0 | |
| start_date | DATE | NULLABLE | |
| end_date | DATE | NULLABLE | |
| location | VARCHAR(200) | NOT NULL | |
| destination | VARCHAR(200) | NULLABLE | |
| latitude | DECIMAL(10,7) | NULLABLE | |
| longitude | DECIMAL(10,7) | NULLABLE | |
| category | VARCHAR(30) | NULLABLE | CHECK IN ('ADVENTURE','CULTURE','RELAXATION','FOOD','NATURE') |
| includes | TEXT[] | NULLABLE, DEFAULT '{}' | Array text |
| excludes | TEXT[] | NULLABLE, DEFAULT '{}' | Array text |
| itinerary | JSONB | NULLABLE, DEFAULT '[]' | Mảng ItineraryItem |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | CHECK IN ('ACTIVE','INACTIVE','CANCELLED','FULLY_BOOKED') |
| rating | DECIMAL(2,1) | NULLABLE, DEFAULT 0 | Tính từ reviews |
| review_count | INTEGER | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Indexes**:
- `idx_tours_slug` ON (slug) UNIQUE
- `idx_tours_status` ON (status)
- `idx_tours_category` ON (category)
- `idx_tours_location` ON (location)
- `idx_tours_price` ON (price)
- `idx_tours_rating` ON (rating DESC)
- `idx_tours_search` — GIN index on `to_tsvector('english', title || ' ' || description || ' ' || location)`

#### Bảng: `tour_images`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| tour_id | UUID | NOT NULL, FK → tours(id) ON DELETE CASCADE | |
| url | VARCHAR(500) | NOT NULL | |
| alt | VARCHAR(200) | NULLABLE | |
| is_primary | BOOLEAN | NOT NULL, DEFAULT false | |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Indexes**:
- `idx_tour_images_tour_id` ON (tour_id)
- Partial unique: `idx_tour_primary_one` ON (tour_id) WHERE is_primary = true

#### Bảng: `registrations`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| tour_id | UUID | NOT NULL, FK → tours(id) ON DELETE RESTRICT | |
| user_id | UUID | NOT NULL, FK → users(id) ON DELETE CASCADE | |
| participants | INTEGER | NOT NULL, CHECK > 0 | |
| total_price | DECIMAL(12,2) | NOT NULL, CHECK >= 0 | |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | CHECK IN ('PENDING','CONFIRMED','CANCELLED','COMPLETED') |
| special_requests | TEXT | NULLABLE | |
| contact_phone | VARCHAR(20) | NULLABLE | |
| contact_email | VARCHAR(255) | NULLABLE | |
| cancelled_at | TIMESTAMPTZ | NULLABLE | |
| cancel_reason | VARCHAR(500) | NULLABLE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Indexes**:
- `idx_registrations_tour_id` ON (tour_id)
- `idx_registrations_user_id` ON (user_id)
- `idx_registrations_status` ON (status)
- `idx_registrations_user_status` ON (user_id, status) — cho "My Registrations" filter

#### Bảng: `payments`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| registration_id | UUID | NOT NULL, UNIQUE, FK → registrations(id) ON DELETE RESTRICT | 1-1 |
| amount | DECIMAL(12,2) | NOT NULL, CHECK >= 0 | |
| method | VARCHAR(20) | NOT NULL | CHECK IN ('CREDIT_CARD','BANK_TRANSFER','CASH','MOMO','VNPAY') |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | CHECK IN ('PENDING','COMPLETED','FAILED','REFUNDED') |
| transaction_id | VARCHAR(100) | NULLABLE | Mã giao dịch từ cổng thanh toán |
| paid_at | TIMESTAMPTZ | NULLABLE | |
| notes | TEXT | NULLABLE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Indexes**:
- `idx_payments_registration_id` ON (registration_id) UNIQUE
- `idx_payments_status` ON (status)
- `idx_payments_transaction_id` ON (transaction_id) UNIQUE

#### Bảng: `reviews`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| tour_id | UUID | NOT NULL, FK → tours(id) ON DELETE CASCADE | |
| user_id | UUID | NOT NULL, FK → users(id) ON DELETE CASCADE | |
| rating | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | |
| comment | TEXT | NOT NULL | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Indexes**:
- `idx_reviews_tour_id` ON (tour_id)
- `idx_reviews_user_id` ON (user_id)
- `uq_reviews_tour_user` UNIQUE ON (tour_id, user_id) — 1 user chỉ review 1 lần/tour

#### Bảng: `contacts`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| name | VARCHAR(100) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL | |
| subject | VARCHAR(200) | NOT NULL | |
| message | TEXT | NOT NULL | |
| is_read | BOOLEAN | NOT NULL, DEFAULT false | Bổ sung admin |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

**Indexes**:
- `idx_contacts_is_read` ON (is_read)
- `idx_contacts_created_at` ON (created_at DESC)

### 3.3 Triggers / Functions

```sql
-- Trigger: cập nhật availableSlots cho tour khi registration thay đổi
-- (Tính dynamic: max_participants - SUM(participants WHERE status IN ('PENDING','CONFIRMED')))
-- Có thể tính qua API query, không nhất thiết trigger

-- Trigger: cập nhật rating + review_count trên tours
CREATE OR REPLACE FUNCTION update_tour_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tours
  SET rating = (SELECT COALESCE(AVG(rating)::numeric(2,1), 0) FROM reviews WHERE tour_id = NEW.tour_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = NEW.tour_id)
  WHERE id = NEW.tour_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_rating
AFTER INSERT OR DELETE OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_tour_rating();
```

---

## IV. Thiết kế REST API

### 4.1 Base URL & Response Format

```
Base URL: /api/v1

Success:     { "success": true, "data": T, "message": "..." }
List:        { "success": true, "data": T[], "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 } }
Error:       { "success": false, "message": "...", "errors": { "field": ["error1"] } }
```

### 4.2 Authentication Headers
```
Authorization: Bearer <token>
```

---

### 4.3 Auth Endpoints

#### `POST /api/v1/auth/register`
```
Request Body:
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "Nguyễn Văn A",
  "phone": "0901234567"        // optional
}

Response 201:
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "...", "role": "CUSTOMER", "phone": "...", "createdAt": "..." },
    "token": "jwt_token_string"
  },
  "message": "Đăng ký thành công"
}

Errors: 409 (email đã tồn tại), 400 (validation)
```

#### `POST /api/v1/auth/login`
```
Request Body:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "...", "role": "CUSTOMER" },
    "token": "jwt_token_string"
  },
  "message": "Đăng nhập thành công"
}

Errors: 401 (sai email/mật khẩu)
```

#### `POST /api/v1/auth/forgot-password`
```
Request Body:
{
  "email": "user@example.com"
}

Response 200:
{
  "success": true,
  "message": "Email hướng dẫn đặt lại mật khẩu đã được gửi"
}

Errors: 404 (email không tồn tại)
```

#### `POST /api/v1/auth/reset-password`
```
Request Body:
{
  "token": "reset_token",
  "password": "newPassword123"
}

Response 200:
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

#### `GET /api/v1/auth/me`
```
Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "...",
    "name": "...",
    "role": "CUSTOMER",
    "phone": "...",
    "avatar": "...",
    "createdAt": "..."
  }
}

Errors: 401 (token hết hạn/không hợp lệ)
```

---

### 4.4 Tour Endpoints

#### `GET /api/v1/tours`
```
Query Parameters:
  search?: string           // full-text search
  location?: string
  category?: 'ADVENTURE'|'CULTURE'|'RELAXATION'|'FOOD'|'NATURE'
  minPrice?: number
  maxPrice?: number
  duration?: number         // lọc duration (tối đa)
  status?: 'ACTIVE'|'INACTIVE'|'CANCELLED'|'FULLY_BOOKED'  // default: ACTIVE
  sortBy?: 'price_asc'|'price_desc'|'rating'|'newest'|'popular'
  page?: number             // default: 1
  limit?: number            // default: 12, max: 50

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "...",
      "slug": "...",
      "price": 5000000,
      "originalPrice": 6000000,
      "duration": 3,
      "durationType": "DAYS",
      "maxParticipants": 20,
      "location": "Đà Lạt",
      "category": "NATURE",
      "status": "ACTIVE",
      "rating": 4.5,
      "reviewCount": 12,
      "availableSlots": 15,
      "primaryImage": { "url": "...", "alt": "..." },
      "startDate": "2026-07-01",
      "createdAt": "..."
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 45, "totalPages": 4 }
}
```

#### `GET /api/v1/tours/:slug` (or `:id`)
```
Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "...",
    "slug": "...",
    "description": "...",
    "price": 5000000,
    "originalPrice": 6000000,
    "duration": 3,
    "durationType": "DAYS",
    "maxParticipants": 20,
    "startDate": "2026-07-01",
    "endDate": "2026-07-03",
    "location": "Đà Lạt",
    "destination": "Làng Cù Lần",
    "coordinates": { "lat": 11.9465, "lng": 108.4419 },
    "category": "NATURE",
    "includes": ["Khách sạn 3*", "Xe đưa đón", "Ăn sáng"],
    "excludes": ["Chi phí cá nhân", "Bảo hiểm"],
    "itinerary": [
      { "day": 1, "title": "Khởi hành", "description": "...", "meals": ["LUNCH","DINNER"], "activities": ["Tham quan"], "accommodation": "Hotel" }
    ],
    "images": [
      { "id": "uuid", "url": "...", "alt": "...", "isPrimary": true }
    ],
    "status": "ACTIVE",
    "rating": 4.5,
    "reviewCount": 12,
    "availableSlots": 15,
    "createdAt": "...",
    "updatedAt": "..."
  }
}

Errors: 404 (tour không tồn tại)
```

#### `POST /api/v1/tours` (Admin)
```
Request Body:
{
  "title": "Tour Đà Lạt 3 ngày 2 đêm",
  "description": "...",
  "price": 5000000,
  "originalPrice": 6000000,
  "duration": 3,
  "durationType": "DAYS",
  "maxParticipants": 20,
  "startDate": "2026-07-01",
  "endDate": "2026-07-03",
  "location": "Đà Lạt",
  "destination": "Làng Cù Lần",
  "latitude": 11.9465,
  "longitude": 108.4419,
  "category": "NATURE",
  "includes": ["Khách sạn", "Xe"],
  "excludes": ["Chi phí cá nhân"],
  "itinerary": [ ... ],
  "images": [ { "url": "...", "alt": "...", "isPrimary": true } ]
}

Response 201:
{
  "success": true,
  "data": { /* tour object */ },
  "message": "Tour đã được tạo thành công"
}
```

#### `PUT /api/v1/tours/:id` (Admin)
```
Request Body: (partial update)
{
  "price": 5500000,
  "status": "ACTIVE"
}

Response 200:
{
  "success": true,
  "data": { /* tour object */ },
  "message": "Tour đã được cập nhật"
}
```

#### `DELETE /api/v1/tours/:id` (Admin)
```
Response 200:
{
  "success": true,
  "message": "Tour đã được xóa"
}

Errors: 409 (có registration liên quan)
```

#### `POST /api/v1/tours/:id/images` (Admin — upload image)
```
Request: multipart/form-data
  file: image.jpg
  isPrimary: true
  alt: "Mô tả ảnh"

Response 201:
{
  "success": true,
  "data": { "id": "uuid", "url": "...", "alt": "...", "isPrimary": true },
  "message": "Ảnh đã được thêm"
}
```

---

### 4.5 Registration Endpoints

#### `POST /api/v1/registrations`
```
Request Body:
{
  "tourId": "uuid",
  "participants": 2,
  "specialRequests": "Ăn chay",
  "contactPhone": "0901234567",
  "contactEmail": "user@example.com"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "tourId": "uuid",
    "userId": "uuid",
    "participants": 2,
    "totalPrice": 10000000,
    "status": "PENDING",
    "specialRequests": "Ăn chay",
    "contactPhone": "0901234567",
    "contactEmail": "user@example.com",
    "tour": { /* basic tour info */ },
    "createdAt": "..."
  },
  "message": "Đăng ký tour thành công"
}

Errors: 400 (tour đầy/số người vượt quá chỗ trống), 409 (đã đăng ký)
```

#### `GET /api/v1/registrations` (Admin)
```
Query Parameters:
  status?: 'PENDING'|'CONFIRMED'|'CANCELLED'|'COMPLETED'
  tourId?: string
  userId?: string
  page?: number
  limit?: number

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tour": { "id": "uuid", "title": "...", "slug": "..." },
      "user": { "id": "uuid", "name": "...", "email": "..." },
      "participants": 2,
      "totalPrice": 10000000,
      "status": "CONFIRMED",
      "payment": { "id": "uuid", "status": "COMPLETED", "method": "MOMO" },
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/registrations/my` (User)
```
Query Parameters:
  status?: 'PENDING'|'CONFIRMED'|'CANCELLED'|'COMPLETED'

Response 200:
{
  "success": true,
  "data": [ /* registrations của user hiện tại, có populate tour + payment */ ],
  "pagination": { ... }
}
```

#### `GET /api/v1/registrations/:id`
```
Response 200:
{
  "success": true,
  "data": { /* full registration details + tour + payment */ }
}
```

#### `PUT /api/v1/registrations/:id/cancel`
```
Request Body:
{
  "reason": "Thay đổi kế hoạch"
}

Response 200:
{
  "success": true,
  "data": { /* registration with status: CANCELLED */ },
  "message": "Đã hủy đăng ký tour"
}

Errors: 400 (đã hoàn thành/đã hủy)
```

---

### 4.6 Payment Endpoints

#### `POST /api/v1/payments`
```
Request Body:
{
  "registrationId": "uuid",
  "method": "MOMO",
  "amount": 10000000
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "registrationId": "uuid",
    "amount": 10000000,
    "method": "MOMO",
    "status": "PENDING",
    "paymentUrl": "https://pay.momo.vn/..."   // cho cổng thanh toán
  },
  "message": "Đã tạo yêu cầu thanh toán"
}
```

#### `GET /api/v1/payments/:id`
```
Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "registrationId": "uuid",
    "amount": 10000000,
    "method": "MOMO",
    "status": "COMPLETED",
    "transactionId": "momo_txn_123",
    "paidAt": "2026-06-12T10:30:00Z",
    "registration": { /* basic info */ },
    "createdAt": "..."
  }
}
```

#### `POST /api/v1/payments/:id/confirm` (Webhook callback)
```
Request Body:
{
  "transactionId": "momo_txn_123",
  "status": "COMPLETED"
}

Response 200:
{
  "success": true,
  "message": "Thanh toán đã được xác nhận"
}
```

---

### 4.7 Review Endpoints

#### `POST /api/v1/reviews`
```
Request Body:
{
  "tourId": "uuid",
  "rating": 5,
  "comment": "Tour tuyệt vời!"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "tourId": "uuid",
    "userId": "uuid",
    "rating": 5,
    "comment": "Tour tuyệt vời!",
    "user": { "name": "Nguyễn Văn A", "avatar": "..." },
    "createdAt": "..."
  },
  "message": "Đánh giá đã được gửi"
}

Errors: 409 (đã review tour này)
```

#### `GET /api/v1/tours/:tourId/reviews`
```
Query Parameters:
  page?: number
  limit?: number

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Tour tuyệt vời!",
      "user": { "name": "Nguyễn Văn A", "avatar": "..." },
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

### 4.8 Customer Endpoints (Admin)

#### `GET /api/v1/customers`
```
Query Parameters:
  search?: string
  page?: number
  limit?: number

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "...",
      "email": "...",
      "phone": "...",
      "totalRegistrations": 3,
      "totalSpent": 15000000,
      "joinedAt": "..."
    }
  ],
  "pagination": { ... }
}
```

#### `GET /api/v1/customers/:id`
```
Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "...",
    "email": "...",
    "phone": "...",
    "avatar": "...",
    "role": "CUSTOMER",
    "registrations": [ /* recent registrations */ ],
    "totalRegistrations": 3,
    "totalSpent": 15000000,
    "createdAt": "..."
  }
}
```

---

### 4.9 Dashboard Endpoints (Admin)

#### `GET /api/v1/dashboard/stats`
```
Query Parameters:
  period?: 'week'|'month'|'year'    // default: month

Response 200:
{
  "success": true,
  "data": {
    "totalTours": 25,
    "totalCustomers": 150,
    "totalRegistrations": 320,
    "totalRevenue": 500000000,
    "recentRegistrations": [
      {
        "id": "uuid",
        "tour": { "title": "..." },
        "user": { "name": "...", "email": "..." },
        "participants": 2,
        "totalPrice": 10000000,
        "status": "CONFIRMED",
        "createdAt": "..."
      }
    ],
    "monthlyStats": [
      { "month": "2026-01", "revenue": 50000000, "registrations": 30 },
      { "month": "2026-02", "revenue": 65000000, "registrations": 35 }
    ],
    "statusDistribution": {
      "registrations": { "PENDING": 10, "CONFIRMED": 50, "COMPLETED": 40, "CANCELLED": 5 },
      "payments": { "PENDING": 8, "COMPLETED": 80, "FAILED": 2, "REFUNDED": 3 }
    }
  }
}
```

---

### 4.10 Contact Endpoints

#### `POST /api/v1/contact`
```
Request Body:
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "subject": "Thắc mắc về tour Đà Lạt",
  "message": "Tôi muốn hỏi về lịch trình..."
}

Response 201:
{
  "success": true,
  "message": "Tin nhắn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất."
}
```

#### `GET /api/v1/contact` (Admin)
```
Query Parameters:
  isRead?: boolean
  page?: number
  limit?: number

Response 200:
{
  "success": true,
  "data": [ /* contact messages */ ],
  "pagination": { ... }
}
```

#### `PUT /api/v1/contact/:id/read` (Admin — mark as read)
```
Response 200:
{
  "success": true,
  "message": "Đã đánh dấu đã đọc"
}
```

---

## V. Gợi ý về kiến trúc Backend

### Công nghệ đề xuất
| Component | Recommendation | Lý do |
|-----------|---------------|-------|
| Framework | NestJS / Express.js / Hono | NestJS best cho enterprise, Hono nếu serverless |
| Language | TypeScript | Đồng bộ với frontend |
| Database | PostgreSQL 16 | JSONB cho itinerary, full-text search |
| ORM | Prisma / Drizzle | Prisma mạnh về migration, Drizzle nhanh hơn |
| Authentication | JWT (access + refresh token) | Bổ sung refresh token so với frontend hiện tại |
| File Upload | Cloudinary / AWS S3 + Sharp | Resize ảnh, CDN |
| Validation | Zod / class-validator | Zod nhẹ hơn, integration tốt với TypeScript |
| Documentation | OpenAPI (Swagger) | Tự động từ code (nestjs/swagger) |

### Middleware stack đề xuất
1. **CORS** — allow frontend origin
2. **Rate Limiting** — express-rate-limiter / @nestjs/throttler
3. **Auth Guard** — JWT verification + role check
4. **Validation** — Zod schema validation
5. **Error Handler** — Global exception filter
6. **Logger** — Morgan / Pino

### Business logic cần lưu ý
1. **availableSlots calculation**: `maxParticipants - SUM(participants WHERE status IN ('PENDING','CONFIRMED'))` — query, không stored
2. **Tour status auto-update**: Khi availableSlots = 0 → status = 'FULLY_BOOKED'
3. **Rating auto-update**: Trigger/event khi review thay đổi
4. **Total price auto-calc**: `tour.price * participants` khi tạo registration
5. **Payment status flow**: PENDING → COMPLETED/FAILED; COMPLETED → REFUNDED
6. **File validation**: Chỉ chấp nhận JPEG, PNG, WebP; max 5MB

---

## VI. Các điểm mở rộng tiềm năng (Future)

| Tính năng | Mô tả |
|-----------|-------|
| Coupon/Discount | Bảng `coupons`, áp mã giảm giá cho registration |
| Wishlist/Favorites | Bảng `wishlists` (user_id, tour_id) |
| Notifications | Bảng `notifications` (in-app + email) |
| Blog/Tin tức | Bảng `posts` + `post_categories` |
| Multi-language | i18n cho tour description, itinerary |
| Tour Guide | Bảng `guides`, liên kết với tour |
| Cancellation Policy | Policy theo từng tour (miễn phí/phí hủy) |
| Invoice/Hóa đơn | PDF generation cho payment |
| Activity Log | Audit log cho admin actions |
| Real-time chat | WebSocket cho hỗ trợ khách hàng |

---

*Tài liệu được tạo từ quá trình phân tích toàn bộ frontend PMC Tour Management (Next.js 16, React 19, TypeScript).*
