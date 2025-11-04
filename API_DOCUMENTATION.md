# API Documentation - Detailed Examples

## 🔗 Complete API Reference with Request/Response Examples

### **Base URL**: `http://localhost:5454`

---

## 🔐 Authentication APIs

### **1. User Registration**
```http
POST /auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "mobile": "+1234567890"
}
```

**Response (Success - 201):**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTQzMjEwOTg3NjU0MzIxIiwiaWF0IjoxNjk4ODY0MzIxLCJleHAiOjE2OTkwMzcxMjF9.abc123def456",
  "message": "Register Success"
}
```

### **2. User Login**
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Success"
}
```

---

## 🛍️ Product APIs

### **3. Get All Products (With Filtering)**
```http
GET /api/products?category=Electronics&color=Black,Blue&minPrice=100&maxPrice=1000&sort=price_low&pageNumber=1&pageSize=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "content": [
    {
      "_id": "654321098765432100000001",
      "title": "Wireless Bluetooth Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 299.99,
      "discountedPrice": 249.99,
      "discountPersent": 17,
      "quantity": 50,
      "brand": "AudioTech",
      "color": "Black",
      "sizes": [
        {"name": "One Size", "quantity": 50}
      ],
      "imageUrl": "https://example.com/headphones.jpg",
      "category": {
        "_id": "654321098765432100000010",
        "name": "Electronics",
        "level": 1
      },
      "ratings": [],
      "reviews": [],
      "numRatings": 0,
      "createdAt": "2023-10-01T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalElements": 47,
  "pageSize": 10
}
```

### **4. Get Product by ID**
```http
GET /api/products/id/654321098765432100000001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "_id": "654321098765432100000001",
  "title": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones with 30-hour battery life...",
  "price": 299.99,
  "discountedPrice": 249.99,
  "discountPersent": 17,
  "quantity": 50,
  "brand": "AudioTech",
  "color": "Black",
  "sizes": [{"name": "One Size", "quantity": 50}],
  "imageUrl": "https://example.com/headphones.jpg",
  "category": {
    "_id": "654321098765432100000010",
    "name": "Electronics",
    "level": 1,
    "parentCategory": null
  },
  "ratings": ["rating_id_1", "rating_id_2"],
  "reviews": ["review_id_1", "review_id_2"],
  "numRatings": 15,
  "createdAt": "2023-10-01T10:30:00.000Z"
}
```

### **5. Create Sample Products**
```http
POST /api/products/sample
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 201):**
```json
{
  "message": "25 sample products created successfully",
  "count": 25
}
```

---

## 🛒 Cart APIs

### **6. Get User Cart**
```http
GET /api/cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "_id": "654321098765432100000020",
  "user": "654321098765432100000005",
  "cartItems": [
    {
      "_id": "654321098765432100000021",
      "product": {
        "_id": "654321098765432100000001",
        "title": "Wireless Bluetooth Headphones",
        "price": 299.99,
        "discountedPrice": 249.99,
        "imageUrl": "https://example.com/headphones.jpg"
      },
      "size": "One Size",
      "quantity": 2,
      "price": 249.99,
      "discountedPrice": 249.99,
      "userId": "654321098765432100000005"
    }
  ],
  "totalPrice": 499.98,
  "totalItem": 2,
  "totalDiscountedPrice": 499.98,
  "discount": 0
}
```

### **7. Add Item to Cart**
```http
POST /api/cart/add
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "productId": "654321098765432100000001",
  "size": "M",
  "quantity": 2
}
```

**Response (Success - 200):**
```json
{
  "message": "Item added to cart",
  "cartItem": {
    "_id": "654321098765432100000022",
    "product": "654321098765432100000001",
    "size": "M",
    "quantity": 2,
    "price": 49.99,
    "discountedPrice": 39.99,
    "userId": "654321098765432100000005"
  }
}
```

---

## 📦 Order APIs

### **8. Create Order**
```http
POST /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "streetAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "mobile": "+1234567890"
  }
}
```

**Response (Success - 201):**
```json
{
  "_id": "654321098765432100000030",
  "user": "654321098765432100000005",
  "orderItems": [
    {
      "_id": "654321098765432100000031",
      "product": {
        "_id": "654321098765432100000001",
        "title": "Wireless Bluetooth Headphones"
      },
      "size": "One Size",
      "quantity": 2,
      "price": 249.99,
      "discountedPrice": 249.99
    }
  ],
  "orderDate": "2023-11-04T10:30:00.000Z",
  "deliveryDate": "2023-11-10T10:30:00.000Z",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "streetAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "mobile": "+1234567890"
  },
  "paymentDetails": {
    "paymentMethod": "PENDING",
    "status": "PENDING"
  },
  "totalPrice": 499.98,
  "totalDiscountedPrice": 499.98,
  "discount": 0,
  "orderStatus": "PENDING",
  "totalItem": 2,
  "createdAt": "2023-11-04T10:30:00.000Z"
}
```

### **9. Get Order History**
```http
GET /api/orders/user
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
[
  {
    "_id": "654321098765432100000030",
    "orderDate": "2023-11-04T10:30:00.000Z",
    "deliveryDate": "2023-11-10T10:30:00.000Z",
    "totalPrice": 499.98,
    "totalDiscountedPrice": 499.98,
    "orderStatus": "DELIVERED",
    "totalItem": 2,
    "orderItems": [
      {
        "product": {
          "title": "Wireless Bluetooth Headphones",
          "imageUrl": "https://example.com/headphones.jpg"
        },
        "quantity": 2,
        "discountedPrice": 249.99
      }
    ]
  }
]
```

---

## 💳 Payment APIs

### **10. Create Payment Intent**
```http
POST /api/payments/create-payment-intent
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "orderId": "654321098765432100000030"
}
```

**Response (Success - 200):**
```json
{
  "clientSecret": "pi_3O1234567890_secret_abcdef123456",
  "paymentIntentId": "pi_3O1234567890",
  "amount": 49998,
  "currency": "usd"
}
```

### **11. Confirm Payment**
```http
POST /api/payments/confirm-payment
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "paymentIntentId": "pi_3O1234567890",
  "orderId": "654321098765432100000030"
}
```

**Response (Success - 200):**
```json
{
  "message": "Payment confirmed successfully",
  "order": {
    "_id": "654321098765432100000030",
    "orderStatus": "CONFIRMED",
    "paymentDetails": {
      "paymentMethod": "stripe",
      "status": "COMPLETED",
      "paymentId": "pi_3O1234567890"
    }
  }
}
```

---

## 👤 User APIs

### **12. Get User Profile**
```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "_id": "654321098765432100000005",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "mobile": "+1234567890",
  "role": "CUSTOMER",
  "addresses": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "streetAddress": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "mobile": "+1234567890"
    }
  ],
  "createdAt": "2023-10-01T08:00:00.000Z"
}
```

---

## 🔧 Admin APIs

### **13. Create Product (Admin)**
```http
POST /api/admin/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Premium Cotton T-Shirt",
  "description": "100% organic cotton t-shirt with comfortable fit",
  "price": 29.99,
  "discountedPrice": 24.99,
  "discountPersent": 17,
  "quantity": 100,
  "brand": "EcoWear",
  "color": "Navy Blue",
  "size": [
    {"name": "S", "quantity": 25},
    {"name": "M", "quantity": 35},
    {"name": "L", "quantity": 25},
    {"name": "XL", "quantity": 15}
  ],
  "imageUrl": "https://example.com/tshirt.jpg",
  "topLevelCategory": "Men",
  "secondLevelCategory": "Clothing",
  "thirdLevelCategory": "T-Shirts"
}
```

**Response (Success - 201):**
```json
{
  "_id": "654321098765432100000040",
  "title": "Premium Cotton T-Shirt",
  "description": "100% organic cotton t-shirt with comfortable fit",
  "price": 29.99,
  "discountedPrice": 24.99,
  "discountPersent": 17,
  "quantity": 100,
  "brand": "EcoWear",
  "color": "Navy Blue",
  "sizes": [
    {"name": "S", "quantity": 25},
    {"name": "M", "quantity": 35},
    {"name": "L", "quantity": 25},
    {"name": "XL", "quantity": 15}
  ],
  "imageUrl": "https://example.com/tshirt.jpg",
  "category": {
    "_id": "654321098765432100000012",
    "name": "T-Shirts",
    "level": 3
  },
  "ratings": [],
  "reviews": [],
  "numRatings": 0,
  "createdAt": "2023-11-04T11:00:00.000Z"
}
```

### **14. Update Order Status (Admin)**
```http
PUT /api/admin/orders/654321098765432100000030/confirmed
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "_id": "654321098765432100000030",
  "orderStatus": "CONFIRMED",
  "message": "Order confirmed successfully"
}
```

---

## ⭐ Review & Rating APIs

### **15. Create Product Review**
```http
POST /api/reviews
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "productId": "654321098765432100000001",
  "review": "Excellent product! The sound quality is amazing and battery life is great."
}
```

**Response (Success - 201):**
```json
{
  "_id": "654321098765432100000050",
  "review": "Excellent product! The sound quality is amazing and battery life is great.",
  "product": "654321098765432100000001",
  "user": {
    "_id": "654321098765432100000005",
    "firstName": "John",
    "lastName": "Doe"
  },
  "createdAt": "2023-11-04T12:00:00.000Z"
}
```

### **16. Rate Product**
```http
POST /api/ratings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "productId": "654321098765432100000001",
  "rating": 5
}
```

**Response (Success - 201):**
```json
{
  "_id": "654321098765432100000051",
  "rating": 5,
  "product": "654321098765432100000001",
  "user": "654321098765432100000005",
  "createdAt": "2023-11-04T12:05:00.000Z"
}
```

---

## ❌ Error Responses

### **Authentication Error (401)**
```json
{
  "error": "Token is required",
  "status": false
}
```

### **Validation Error (400)**
```json
{
  "error": "Email already exists",
  "status": false
}
```

### **Not Found Error (404)**
```json
{
  "error": "Product not found with id: 654321098765432100000999",
  "status": false
}
```

### **Server Error (500)**
```json
{
  "error": "Internal server error",
  "status": false
}
```

---

## 🔍 Query Parameters Reference

### **Product Filtering Parameters**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | String | Filter by category name | `Electronics` |
| `color` | String | Comma-separated colors | `Black,Blue,Red` |
| `sizes` | String | Comma-separated sizes | `S,M,L` |
| `minPrice` | Number | Minimum price filter | `50` |
| `maxPrice` | Number | Maximum price filter | `500` |
| `minDiscount` | Number | Minimum discount percentage | `20` |
| `sort` | String | Sort order | `price_low`, `price_high` |
| `stock` | String | Stock availability | `in_stock`, `out_of_stock` |
| `pageNumber` | Number | Page number (1-based) | `1` |
| `pageSize` | Number | Items per page | `20` |

### **Example Complex Query**
```
GET /api/products?category=Men&color=Blue,Black&sizes=M,L&minPrice=20&maxPrice=100&minDiscount=10&sort=price_low&stock=in_stock&pageNumber=2&pageSize=12
```

This comprehensive API documentation provides all the details needed to integrate with the e-commerce backend effectively.