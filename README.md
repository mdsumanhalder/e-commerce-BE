# E-Commerce Backend API

A comprehensive RESTful API for an e-commerce application built with Node.js, Express.js, MongoDB, and Stripe payment integration.

## 🏗️ Architecture Overview

### **Technology Stack**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe Payment Gateway
- **Security**: bcrypt for password hashing
- **Environment**: dotenv for configuration management

### **Project Structure**
```
src/
├── config/          # Configuration files
│   ├── db.js           # MongoDB connection
│   ├── jwtProvider.js  # JWT utilities
│   ├── stripe.js       # Stripe configuration
│   └── environment.js  # Environment validation
├── controller/      # Route handlers/controllers
├── middleware/      # Custom middleware (authentication, etc.)
├── models/          # Mongoose models/schemas
├── routes/          # API route definitions
├── services/        # Business logic layer
├── staticFile/      # Static assets
├── index.js         # Express app configuration
└── server.js        # Server entry point
```

### **Architecture Pattern**
The application follows **MVC (Model-View-Controller)** pattern with an additional **Service Layer**:

- **Models**: Define data structure and database schemas
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Routes**: Define API endpoints and middleware
- **Middleware**: Handle authentication, validation, etc.

## 🔐 Authentication Flow

### **User Registration & Login Flow**
```
1. User registers → Password hashed → Stored in MongoDB
2. User logs in → Credentials verified → JWT token generated
3. Protected routes → JWT validated → User authenticated
4. Token expires → User needs to re-authenticate
```

### **JWT Token Structure**
```javascript
{
  "userId": "user_mongodb_id",
  "iat": "issued_at_timestamp",
  "exp": "expiration_timestamp"
}
```

## 📊 Database Models

### **User Model**
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "CUSTOMER"),
  mobile: String,
  addresses: [Address],
  paymentInformation: [PaymentInformation],
  ratings: [ObjectId],
  reviews: [ObjectId],
  createdAt: Date
}
```

### **Product Model**
```javascript
{
  title: String,
  description: String,
  price: Number,
  discountedPrice: Number,
  discountPersent: Number,
  quantity: Number,
  brand: String,
  color: String,
  sizes: [{name: String, quantity: Number}],
  imageUrl: String,
  ratings: [ObjectId],
  reviews: [ObjectId],
  numRatings: Number,
  category: ObjectId (ref: Category),
  createdAt: Date
}
```

### **Order Model**
```javascript
{
  user: ObjectId (ref: User),
  orderItems: [ObjectId] (ref: OrderItem),
  orderDate: Date,
  deliveryDate: Date,
  shippingAddress: Address,
  paymentDetails: PaymentDetails,
  totalPrice: Number,
  totalDiscountedPrice: Number,
  discount: Number,
  orderStatus: String,
  totalItem: Number,
  createdAt: Date
}
```

## 🛣️ API Endpoints

### **Base URL**: `http://localhost:5454`

### **Authentication Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/signup` | User registration | None |
| POST | `/auth/signin` | User login | None |

**Example Request - Register:**
```json
POST /auth/signup
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Example Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Register Success"
}
```

### **Product Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/products` | Get all products (with filters) | Required |
| GET | `/api/products/id/:id` | Get product by ID | Required |
| POST | `/api/products/sample` | Create sample products | Required |
| GET | `/api/public/products` | Get products (public) | None |

**Query Parameters for Product Filtering:**
- `category` - Filter by category name
- `color` - Filter by color (comma-separated)
- `sizes` - Filter by sizes (comma-separated)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minDiscount` - Minimum discount percentage
- `sort` - Sort by price (price_low/price_high)
- `stock` - Filter by stock (in_stock/out_of_stock)
- `pageNumber` - Page number for pagination
- `pageSize` - Number of items per page

**Example Request:**
```
GET /api/products?category=Electronics&minPrice=100&maxPrice=1000&sort=price_low&pageNumber=1&pageSize=20
```

### **Admin Product Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/admin/products` | Create new product | Required (Admin) |
| POST | `/api/admin/products/creates` | Create multiple products | Required (Admin) |
| DELETE | `/api/admin/products/:id` | Delete product | Required (Admin) |

### **Cart Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/cart` | Get user's cart | Required |
| POST | `/api/cart/add` | Add item to cart | Required |

**Example - Add to Cart:**
```json
POST /api/cart/add
{
  "productId": "product_mongodb_id",
  "size": "M",
  "quantity": 2
}
```

### **Cart Item Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| PUT | `/api/cart_items/:id` | Update cart item | Required |
| DELETE | `/api/cart_items/:id` | Remove cart item | Required |

### **Order Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/orders` | Create new order | Required |
| POST | `/api/orders/with-payment` | Create order with payment | Required |
| GET | `/api/orders/user` | Get user's order history | Required |
| GET | `/api/orders/:id` | Get order by ID | Required |

### **Payment Endpoints** (Stripe Integration)
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/payments/create-payment-intent` | Create Stripe payment intent | Required |
| POST | `/api/payments/confirm-payment` | Confirm payment | Required |
| POST | `/api/payments/refund` | Create refund | Required |
| POST | `/api/payments/webhook` | Stripe webhook handler | None |

### **User Management Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/users/profile` | Get user profile | Required |
| GET | `/api/users` | Get all users | Required |

### **Review & Rating Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/reviews` | Create product review | Required |
| GET | `/api/reviews/product/:id` | Get product reviews | Required |
| POST | `/api/ratings` | Rate a product | Required |

### **Admin Order Endpoints**
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/admin/orders` | Get all orders | Required (Admin) |
| PUT | `/api/admin/orders/:id/confirmed` | Confirm order | Required (Admin) |
| PUT | `/api/admin/orders/:id/ship` | Ship order | Required (Admin) |
| PUT | `/api/admin/orders/:id/deliver` | Deliver order | Required (Admin) |
| PUT | `/api/admin/orders/:id/cancel` | Cancel order | Required (Admin) |
| DELETE | `/api/admin/orders/:id` | Delete order | Required (Admin) |

## 🔄 Complete UX Flow

### **1. User Registration & Authentication Flow**
```
Frontend → POST /auth/signup → Backend validates → Password hashed → 
User saved to MongoDB → JWT generated → Returned to frontend → 
Frontend stores JWT → User authenticated for future requests
```

### **2. Product Browsing Flow**
```
Frontend loads → GET /api/products → Backend queries MongoDB → 
Applies filters/pagination → Returns product list → 
Frontend displays products → User can filter/sort → 
New API call with query parameters → Updated results
```

### **3. Shopping Cart Flow**
```
User browses products → Selects product → POST /api/cart/add → 
Backend validates user → Checks product availability → 
Updates/creates cart → Returns updated cart → 
Frontend updates cart UI → User can modify quantities → 
PUT /api/cart_items/:id → Cart updated
```

### **4. Checkout & Payment Flow**
```
User proceeds to checkout → POST /api/payments/create-payment-intent → 
Stripe creates payment intent → Frontend collects payment details → 
POST /api/payments/confirm-payment → Stripe processes payment → 
POST /api/orders/with-payment → Order created in database → 
Inventory updated → Email notifications sent → Order confirmation
```

### **5. Order Management Flow**
```
User places order → Admin receives notification → 
Admin updates order status → PUT /api/admin/orders/:id/confirmed → 
Inventory allocated → PUT /api/admin/orders/:id/ship → 
Tracking info updated → PUT /api/admin/orders/:id/deliver → 
Order completed → User can review products
```

## 🛡️ Security Features

### **Authentication & Authorization**
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Token expiration handling

### **Data Validation**
- Mongoose schema validation
- Input sanitization
- Email format validation
- Required field validation

### **Environment Security**
- Sensitive data in environment variables
- `.env` file excluded from version control
- Environment validation on startup

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account for payments

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd BE

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev        # Development mode
npm start          # Production mode
```

### **Required Environment Variables**
```bash
MONGO_URL=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
PORT=5454
```

## 📱 Frontend Integration

### **Headers Required**
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + jwt_token
}
```

### **Error Handling**
The API returns consistent error responses:
```json
{
  "error": "Error message",
  "status": false,
  "code": 400
}
```

### **Success Responses**
Successful responses include:
```json
{
  "data": { ... },
  "message": "Success message",
  "status": true
}
```

## 🔧 Advanced Features

### **Pagination**
```javascript
// Request
GET /api/products?pageNumber=1&pageSize=20

// Response
{
  "content": [...products],
  "currentPage": 1,
  "totalPages": 5,
  "totalElements": 100,
  "pageSize": 20
}
```

### **Filtering & Sorting**
- Multiple filter criteria
- Price range filtering
- Category-based filtering
- Color and size filtering
- Stock availability filtering
- Price sorting (ascending/descending)

### **Real-time Features**
- Stripe webhook integration
- Inventory management
- Order status updates
- Payment confirmation

## 🔍 Monitoring & Logging

### **Console Logging**
- Environment validation logs
- Database connection status
- API request logging
- Error tracking

### **Health Check**
```
GET / → Returns server status and information
```

## 🚀 Deployment Considerations

### **Environment Setup**
- Production MongoDB Atlas connection
- Production Stripe keys
- Secure JWT secret
- CORS configuration for production domain

### **Performance Optimization**
- Database indexing
- Query optimization
- Response caching strategies
- Image optimization

This backend provides a complete foundation for a modern e-commerce application with secure authentication, comprehensive product management, shopping cart functionality, and integrated payment processing.