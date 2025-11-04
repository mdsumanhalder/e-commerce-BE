// Environment configuration validation
const requiredEnvVars = [
    'MONGO_URL',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY'
];

const optionalEnvVars = {
    'NODE_ENV': 'development',
    'PORT': '5454',
    'FRONTEND_URL': 'http://localhost:4200',
    'STRIPE_PUBLISHABLE_KEY': '',
    'STRIPE_WEBHOOK_SECRET': ''
};

function validateEnvironment() {
    console.log('🔍 Validating environment variables...');
    
    const missingVars = [];
    
    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\n📝 Please check your .env file and ensure all required variables are set.');
        console.error('💡 See .env.example for reference.');
        process.exit(1);
    }
    
    // Set defaults for optional variables
    Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
        if (!process.env[key] && defaultValue) {
            process.env[key] = defaultValue;
        }
    });
    
    console.log('✅ Environment variables validated successfully');
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🚀 Port: ${process.env.PORT}`);
    console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`💳 Stripe configured: ${process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No'}`);
}

module.exports = { validateEnvironment };