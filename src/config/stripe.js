const stripe = require('stripe');

// Initialize Stripe with your secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY environment variable is not set!');
    console.log('Please set your Stripe secret key in the .env file');
    process.exit(1);
}

const stripeInstance = stripe(stripeSecretKey);

module.exports = stripeInstance;