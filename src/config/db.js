const mongoose = require('mongoose')

// Use environment variable for MongoDB URL
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    console.error('MONGO_URL environment variable is not set!');
    process.exit(1);
}

const connectDb = () => {
    return mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to MongoDB successfully');
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });
}

module.exports = {connectDb}