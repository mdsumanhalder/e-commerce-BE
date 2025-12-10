// Environment configuration validation
const requiredEnvVars = [
    'MONGO_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'STRIPE_SECRET_KEY'
];

const optionalEnvVars = {
    'NODE_ENV': 'development',
    'PORT': '5454',
    'FRONTEND_URL': 'http://localhost:4200',
    'ACCESS_TOKEN_EXPIRES_IN': '15m',
    'REFRESH_TOKEN_EXPIRES_IN': '7d',
    'JWT_LEGACY_SECRET': '',
    'STRIPE_PUBLISHABLE_KEY': '',
    'STRIPE_WEBHOOK_SECRET': '',
    'MAIL_FROM': '',
    'MAIL_HOST': '',
    'MAIL_PORT': '',
    'MAIL_USER': '',
    'MAIL_PASS': ''
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
        const legacySecret = process.env.JWT_SECRET || process.env.JWT_LEGACY_SECRET;
        if (missingVars.includes('JWT_ACCESS_SECRET') && legacySecret) {
            process.env.JWT_ACCESS_SECRET = legacySecret;
            missingVars.splice(missingVars.indexOf('JWT_ACCESS_SECRET'), 1);
            console.warn('⚠️  Using legacy JWT_SECRET as JWT_ACCESS_SECRET. Please update your .env.');
        }
        if (missingVars.includes('JWT_REFRESH_SECRET') && legacySecret) {
            process.env.JWT_REFRESH_SECRET = legacySecret;
            missingVars.splice(missingVars.indexOf('JWT_REFRESH_SECRET'), 1);
            console.warn('⚠️  Using legacy JWT_SECRET as JWT_REFRESH_SECRET. Please update your .env.');
        }

        if (missingVars.length > 0) {
            console.error('❌ Missing required environment variables:');
            missingVars.forEach(varName => {
                console.error(`   - ${varName}`);
            });
            console.error('\n📝 Please check your .env file and ensure all required variables are set.');
            console.error('💡 See .env.example for reference.');
            process.exit(1);
        }
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
    console.log(`📬 Email notifications: ${process.env.MAIL_HOST && process.env.MAIL_USER ? 'Enabled' : 'Console mode'}`);
}

module.exports = { validateEnvironment };
