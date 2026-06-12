# PMC Tour API - API Reference

> **Base URL**: `https://localhost:{port}/api` (or configured `{{baseUrl}}`)  
> **Content-Type**: `application/json`  
> **Auth**: Bearer token (JWT) via `Authorization: Bearer {token}` header  
> **Collection**: [Postman Link](https://go.postman.co/collection/42741868-aa0cf07c-ef22-49a7-be7a-cfdcf9219e35)

---

## 1. Auth

### POST /api/Auth/login
Login, returns JWT token + refresh token.

```
Request:
{
  "username": "string",
  "password": "string"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "userId": 0,
    "username": "string",
    "fullName": "string",
    "token": "string",
    "refreshToken": "string",
    "roles": ["Admin"]
  }
}
```

### POST /api/Auth/register
Register new customer account.

```
Request:
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phone": "string"
}

Response 200: LoginResponse (same as login)
```

### POST /api/Auth/refresh
Refresh expired JWT using refresh token.

```
Request: "string" (raw refresh token)

Response 200: LoginResponse
```

### POST /api/Auth/change-password
🔒 **Auth required**

```
Request:
{
  "oldPassword": "string",
  "newPassword": "string"
}

Response 200: { "success": true, "data": true }
```

---

## 2. Tours

### GET /api/Tours
Get paginated list with filters.

| Query Param | Type | Description |
|---|---|---|
| SearchTerm | string | Search in name/location |
| TourTypeId | int | Filter by type |
| PriceMin | decimal | Min price |
| PriceMax | decimal | Max price |
| DurationDays | int | Filter by duration |
| Location | string | Filter by location |
| IsActive | bool | Active tours only |
| IsFeatured | bool | Featured tours only |
| SortBy | string | Sort field |
| SortDesc | bool | Descending sort |
| Page | int | Page number (default 1) |
| PageSize | int | Page size (default 10) |

```
Response 200:
{
  "data": {
    "items": [TourResponse],
    "totalCount": 0,
    "page": 1,
    "pageSize": 10
  }
}
```

### GET /api/Tours/{id}
Get tour by ID (includes itineraries, images, reviews).

### GET /api/Tours/slug/{slug}
Get tour by slug (SEO-friendly URL).

### POST /api/Tours
🔒 **Auth required**

```
Request:
{
  "tourTypeId": 0,
  "name": "string",
  "slug": "string",
  "durationDays": 0,
  "durationNights": 0,
  "location": "string",
  "priceAdult": 0.0,
  "priceChild": 0.0,
  "maxPeople": 0,
  "description": "string",
  "shortDescription": "string",
  "highlights": "string",
  "includes": "string",
  "excludes": "string",
  "itinerary": "string",
  "startDates": "string",
  "metaTitle": "string",
  "metaDescription": "string",
  "imageUrl": "string"
}
```

### PUT /api/Tours/{id}
🔒 **Auth required** — Update tour. Body: same fields as Create (nullable).

### DELETE /api/Tours/{id}
🔒 **Auth required** — Soft delete.

---

## 3. TourTypes

### GET /api/TourTypes
Get all tour types (e.g., "Trong nước", "Quốc tế").

### GET /api/TourTypes/{id}
Get tour type by ID.

---

## 4. Bookings

### GET /api/Bookings
🔒 **Auth required** — Get paginated bookings.

| Query Param | Type | Description |
|---|---|---|
| CustomerId | int | Filter by customer |
| TourId | int | Filter by tour |
| Status | int | BookingStatus enum |
| StartDate | DateTime | Filter from date |
| EndDate | DateTime | Filter to date |
| SearchTerm | string | Search |
| BookingCode | string | Search by code |
| Page | int | Page number |
| PageSize | int | Page size |

### GET /api/Bookings/{id}
🔒 **Auth required** — Get booking by ID (includes details, payments, discount).

### POST /api/Bookings
🔒 **Auth required** — Create new booking.

```
Request:
{
  "customerId": 0,
  "tourId": 0,
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-05T00:00:00Z",
  "numAdults": 0,
  "numChildren": 0,
  "notes": "string",
  "discountCode": "string",
  "bookingDetail": {
    "fullName": "string",
    "passportNumber": "string",
    "note": "string"
  }
}
```

### PUT /api/Bookings/{id}/status
🔒 **Auth required** — Update booking status.

```
Request: 2  (BookingStatus enum value)
```

---

## 5. Customers

### GET /api/Customers
🔒 **Auth required** — Get paginated customers.

| Query Param | Type |
|---|---|
| Page | int |
| PageSize | int |
| SearchTerm | string |
| SortBy | string |
| SortDesc | bool |

### GET /api/Customers/{id}
🔒 **Auth required** — Get customer by ID.

### POST /api/Customers
🔒 **Auth required** — Create customer.

```
Request:
{
  "userId": 0,
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": 1,
  "nationality": "string",
  "passportNumber": "string",
  "idCard": "string"
}
```

### PUT /api/Customers/{id}
🔒 **Auth required** — Update customer. All fields nullable.

### DELETE /api/Customers/{id}
🔒 **Auth required** — Soft delete.

---

## 6. Discounts

### GET /api/Discounts
🔒 **Auth required** — Get paginated discounts.

| Query Param | Type |
|---|---|
| Page | int |
| PageSize | int |
| SearchTerm | string |
| SortBy | string |
| SortDesc | bool |

### GET /api/Discounts/{id}
🔒 **Auth required** — Get discount by ID.

### GET /api/Discounts/code/{code}
🔒 **Auth required** — Get discount by code (for validation).

### POST /api/Discounts
🔒 **Auth required** — Create discount.

```
Request:
{
  "code": "string",
  "description": "string",
  "discountType": 0,
  "discountValue": 0.0,
  "minOrderValue": 0.0,
  "maxDiscountAmount": 0.0,
  "usageLimit": 0,
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-12-31T00:00:00Z"
}
```

### PUT /api/Discounts/{id}
🔒 **Auth required** — Update discount. All fields nullable.

### DELETE /api/Discounts/{id}
🔒 **Auth required** — Soft delete.

---

## 7. Itineraries

### GET /api/Itineraries/tour/{tourId}
Get all itinerary days for a tour.

### POST /api/Itineraries
🔒 **Auth required** — Add itinerary day.

```
Request:
{
  "tourId": 0,
  "dayNumber": 1,
  "title": "string",
  "description": "string",
  "meals": "string",
  "hotel": "string",
  "activities": "string"
}
```

### PUT /api/Itineraries/{id}
🔒 **Auth required** — Update itinerary day.

### DELETE /api/Itineraries/{id}
🔒 **Auth required** — Delete itinerary day.

---

## 8. Reviews

### GET /api/Reviews/tour/{tourId}
Get all reviews for a tour (public).

### POST /api/Reviews
Create a review (public, from customers).

```
Request:
{
  "tourId": 0,
  "customerId": 0,
  "bookingId": 0,
  "rating": 5,
  "comment": "string"
}
```

### DELETE /api/Reviews/{id}
🔒 **Auth required** — Soft delete review.

---

## 9. Blogs

### GET /api/Blogs
Get paginated blog posts.

| Query Param | Type |
|---|---|
| Page | int |
| PageSize | int |
| SearchTerm | string |
| SortBy | string |
| SortDesc | bool |

### GET /api/Blogs/{id}
Get blog post by ID.

### GET /api/Blogs/slug/{slug}
Get blog post by slug.

### POST /api/Blogs
🔒 **Auth required** — Create blog post.

```
Request:
{
  "title": "string",
  "slug": "string",
  "content": "string",
  "excerpt": "string",
  "author": "string",
  "imageUrl": "string",
  "tags": "string",
  "status": 2
}
```

### PUT /api/Blogs/{id}
🔒 **Auth required** — Update blog post. All fields nullable.

### DELETE /api/Blogs/{id}
🔒 **Auth required** — Soft delete.

---

## 10. Dashboard

### GET /api/Dashboard/stats
🔒 **Auth required** — Get overview statistics.

```
Response 200:
{
  "data": {
    "totalTours": 0,
    "activeTours": 0,
    "totalBookings": 0,
    "pendingBookings": 0,
    "confirmedBookings": 0,
    "totalCustomers": 0,
    "totalReviews": 0
  }
}
```

---

## 11. Reports

### GET /api/Reports/revenue
🔒 **Auth required** — Revenue report.

| Query Param | Type |
|---|---|
| fromDate | DateTime |
| toDate | DateTime |

### GET /api/Reports/tours
🔒 **Auth required** — Tour performance report.

| Query Param | Type |
|---|---|
| fromDate | DateTime |
| toDate | DateTime |

### GET /api/Reports/bookings
🔒 **Auth required** — Booking summary report.

| Query Param | Type |
|---|---|
| fromDate | DateTime |
| toDate | DateTime |

---

## Enums Reference

| Enum | Values |
|---|---|
| BookingStatus | Pending=0, Confirmed=1, InProgress=2, Completed=3, Cancelled=4, Refunded=5 |
| PaymentStatus | Unpaid=0, Partial=1, Paid=2, Refunded=3 |
| PaymentMethod | Cash=0, BankTransfer=1, CreditCard=2, EWallet=3 |
| ReviewStatus | Pending=0, Approved=1, Rejected=2 |
| TourStatus | Active=0, Inactive=1 |
| BlogStatus | Draft=0, Published=1, Archived=2 |
| DiscountType | Percentage=0, FixedAmount=1 |
| Gender | Male=0, Female=1, Other=2 |

---

## Summary

| # | Group | Endpoints |
|---|---|---|
| 4 | Auth | login, register, refresh, change-password |
| 6 | Tours | GET all, GET id, GET slug, POST, PUT, DELETE |
| 2 | TourTypes | GET all, GET id |
| 4 | Bookings | GET all, GET id, POST, PUT status |
| 5 | Customers | GET all, GET id, POST, PUT, DELETE |
| 6 | Discounts | GET all, GET id, GET code, POST, PUT, DELETE |
| 4 | Itineraries | GET by tour, POST, PUT, DELETE |
| 3 | Reviews | GET by tour, POST, DELETE |
| 6 | Blogs | GET all, GET id, GET slug, POST, PUT, DELETE |
| 1 | Dashboard | GET stats |
| 3 | Reports | GET revenue, GET tours, GET bookings |
| **46** | **TOTAL** | |

🔒 = Requires JWT Bearer token in Authorization header
