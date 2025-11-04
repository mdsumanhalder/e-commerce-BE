# Environment Configuration Setup

## Prerequisites
Make sure you have the following ready:

1. **MongoDB Connection String** - Get this from MongoDB Atlas or your local MongoDB setup
2. **JWT Secret Key** - Generate a secure random string
3. **Stripe API Keys** - Get these from your Stripe Dashboard

## Setup Instructions

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Update Environment Variables
Edit the `.env` file with your actual values:

```bash
# Environment Configuration
NODE_ENV=development
PORT=5454

# Database Configuration
MONGO_URL=mongodb+srv://your-username:your-password@cluster0.mongodb.net/your-database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# CORS Configuration
FRONTEND_URL=http://localhost:4200
```

### 3. Required Variables
These environment variables are **required** for the application to start:
- `MONGO_URL` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `STRIPE_SECRET_KEY` - Your Stripe secret key

### 4. Optional Variables
These have default values but can be customized:
- `NODE_ENV` - Environment mode (default: development)
- `PORT` - Server port (default: 5454)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:4200)

## Security Notes

⚠️ **Important**: Never commit your `.env` file to version control!

- The `.env` file is already added to `.gitignore`
- Only commit `.env.example` with placeholder values
- Team members should copy `.env.example` to `.env` and fill in their values

## Generating Secure Values

### JWT Secret
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Connection
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<database>` with your values

### Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API Keys
3. Copy your Publishable Key and Secret Key
4. For webhooks, go to Developers > Webhooks and get the signing secret