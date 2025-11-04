const mongoose = require('mongoose');
const sampleProducts = require('./data/sampleProducts.json');
const productService = require('./services/product.service');

const MONGODB_URL = 'mongodb://localhost:27017/ecommerce';

async function addSampleProducts() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB');
    
    console.log('Adding sample products...');
    await productService.createMultipleProduct(sampleProducts);
    console.log('Sample products added successfully!');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error adding sample products:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  addSampleProducts();
}

module.exports = addSampleProducts;