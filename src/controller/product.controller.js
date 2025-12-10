const productService = require('../services/product.service');

const findProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productService.findProductById(id);
        return res.status(201).send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query);
        return res.status(201).send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const createSampleProducts = async (req, res) => {
    try {
        const sampleProducts = [
            {
                title: "Casual Cotton T-Shirt",
                color: "Blue",
                description: "Comfortable cotton t-shirt for daily wear",
                discountedPrice: 299,
                discountPersent: 20,
                imageUrl: "https://via.placeholder.com/300x400/007bff/white?text=Blue+T-Shirt",
                brand: "FashionCo",
                price: 399,
                size: [{ name: "S", quantity: 10 }, { name: "M", quantity: 15 }, { name: "L", quantity: 12 }],
                quantity: 37,
                topLevelCategory: "Men",
                secondLevelCategory: "Clothing",
                thirdLevelCategory: "T-Shirts"
            },
            {
                title: "Sports Running Shoes",
                color: "Red",
                description: "High-quality running shoes for athletes",
                discountedPrice: 1299,
                discountPersent: 15,
                imageUrl: "https://via.placeholder.com/300x400/dc3545/white?text=Red+Shoes",
                brand: "SportMax",
                price: 1499,
                size: [{ name: "7", quantity: 5 }, { name: "8", quantity: 8 }, { name: "9", quantity: 10 }],
                quantity: 23,
                topLevelCategory: "Footwear",
                secondLevelCategory: "Sports",
                thirdLevelCategory: "Running"
            },
            {
                title: "Elegant Evening Dress",
                color: "Black",
                description: "Beautiful black dress for special occasions",
                discountedPrice: 2499,
                discountPersent: 25,
                imageUrl: "https://via.placeholder.com/300x400/000000/white?text=Black+Dress",
                brand: "ElegantWear",
                price: 3299,
                size: [{ name: "S", quantity: 3 }, { name: "M", quantity: 5 }, { name: "L", quantity: 4 }],
                quantity: 12,
                topLevelCategory: "Women",
                secondLevelCategory: "Clothing",
                thirdLevelCategory: "Dresses"
            },
            {
                title: "Wireless Bluetooth Headphones",
                color: "White",
                description: "High-quality wireless headphones with noise cancellation",
                discountedPrice: 1999,
                discountPersent: 30,
                imageUrl: "https://via.placeholder.com/300x400/ffffff/000000?text=White+Headphones",
                brand: "TechSound",
                price: 2799,
                size: [{ name: "One Size", quantity: 20 }],
                quantity: 20,
                topLevelCategory: "Electronics",
                secondLevelCategory: "Audio",
                thirdLevelCategory: "Headphones"
            },
            {
                title: "Leather Office Bag",
                color: "Brown",
                description: "Professional leather bag for office use",
                discountedPrice: 1799,
                discountPersent: 10,
                imageUrl: "https://via.placeholder.com/300x400/8b4513/white?text=Brown+Bag",
                brand: "LeatherCraft",
                price: 1999,
                size: [{ name: "Medium", quantity: 8 }, { name: "Large", quantity: 5 }],
                quantity: 13,
                topLevelCategory: "Accessories",
                secondLevelCategory: "Bags",
                thirdLevelCategory: "Office"
            }
        ];

        // Create additional products to test pagination (total 25 products for multiple pages)
        const additionalProducts = [];
        const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Gray"];
        const categories = [
            { top: "Men", second: "Clothing", third: "Shirts" },
            { top: "Women", second: "Clothing", third: "Tops" },
            { top: "Electronics", second: "Mobile", third: "Smartphones" },
            { top: "Footwear", second: "Casual", third: "Sneakers" }
        ];

        for (let i = 6; i <= 25; i++) {
            const color = colors[i % colors.length];
            const category = categories[i % categories.length];
            
            additionalProducts.push({
                title: `Sample Product ${i}`,
                color: color,
                description: `This is sample product number ${i} for testing pagination`,
                discountedPrice: 199 + (i * 50),
                discountPersent: 10 + (i % 40),
                imageUrl: `https://via.placeholder.com/300x400?text=Product+${i}`,
                brand: "SampleBrand",
                price: 299 + (i * 50),
                size: [{ name: "M", quantity: 10 }, { name: "L", quantity: 8 }],
                quantity: 18,
                topLevelCategory: category.top,
                secondLevelCategory: category.second,
                thirdLevelCategory: category.third
            });
        }

        const allProducts = [...sampleProducts, ...additionalProducts];
        await productService.createMultipleProduct(allProducts, req.user);
        
        return res.status(201).send({
            message: `${allProducts.length} sample products created successfully`,
            count: allProducts.length
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    findProductById,
    getAllProducts,
    createSampleProducts
};
