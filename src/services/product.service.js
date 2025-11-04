const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function createProduct(reqData) {
  let topLevel = await Category.findOne({name: reqData.topLevelCategory});

    if (!topLevel) {
        topLevel = new Category({ name: reqData.topLevelCategory, level: 1 });
    }
    await topLevel.save();

    let secondLevel = await Category.findOne({name: reqData.secondLevelCategory, parentCategory: topLevel._id});

    if (!secondLevel) {
        secondLevel = new Category({ name: reqData.secondLevelCategory, parentCategory: topLevel._id, level: 2 });
    }

    await secondLevel.save();

    let thirdLevel = await Category.findOne({name: reqData.thirdLevelCategory, parentCategory: secondLevel._id});

    if (!thirdLevel) {
        thirdLevel = new Category({ name: reqData.thirdLevelCategory, parentCategory: secondLevel._id, level: 3 });
    }

    await thirdLevel.save();

    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrice: reqData.discountedPrice,
        discountPersent: reqData.discountPersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: reqData.price,
        sizes: reqData.size,
        quantity: reqData.quantity,
        category: thirdLevel._id,
    })
const savedProduct = await product.save();
console.log(savedProduct)
const findProduct = await Product.findById(savedProduct._id).populate('category');
    return findProduct;
}

async function deleteProduct(productId){
    const product = await Product.findById(productId);
    await Product.findByIdAndDelete(product);
    return "Product deleted successfully";
}

async function updateProduct(productId, reqData){
    return await Product.findByIdAndUpdate(productId, reqData);
}


async function findProductById(id){
    const product = await Product.findById(id).populate('category').exec();
    if(!product){
       throw new Error("Product not found with id: " + id);
    }
    return product;
}

async function getAllProducts(reqQuery) {
    let {
        category,
        color,
        sizes,
        minPrice,
        maxPrice,
        minDiscount,
        sort,
        stock,
        pageNumber,
        pageSize
    } = reqQuery;

    // Ensure numbers and defaults
    pageNumber = Number(pageNumber) || 1;
    pageSize = Number(pageSize) || 10;

    let query = Product.find().populate('category');

    if (category) {
        const existCategory = await Category.findOne({ name: category });
        if (existCategory) {
            query = query.where('category').equals(existCategory._id);
        } else {
            return { content: [], currentPage: 1, totalPages: 0 };
        }
    }

    if (color) {
        const colorSet = new Set(color.split(',').map(c => c.trim().toLowerCase()));
        if (colorSet.size > 0) {
            const colorRegex = new RegExp([...colorSet].join("|"), "i");
            query = query.where('color').regex(colorRegex);
        }
    }

    if (sizes) {
        const sizesSet = new Set(sizes.split(',').map(s => s.trim()));
        query = query.where('sizes.name').in([...sizesSet]);
    }

    if (minPrice != null && maxPrice != null) {
        query = query.where('discountedPrice').gte(Number(minPrice)).lte(Number(maxPrice));
    }

    if (minDiscount != null) {
        query = query.where('discountPersent').gte(Number(minDiscount));
    }

    if (stock) {
        if (stock === "in_stock") {
            query = query.where('quantity').gt(0);
        } else if (stock === "out_of_stock") {
            query = query.where('quantity').equals(0);
        }
    }

    if (sort) {
        const sortDirection = sort === "price_high" ? -1 : 1; // Corrected typo
        query = query.sort({ discountedPrice: sortDirection });
    }

    const totalProducts = await Product.countDocuments(query);
    const skip = Math.max((pageNumber - 1) * pageSize, 0); // Ensure skip >= 0

    const products = await query.skip(skip).limit(pageSize).exec();
    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
        content: products,
        currentPage: pageNumber,
        totalPages: totalPages,
        totalElements: totalProducts,
        pageSize: pageSize
    };
}


// For ADMIN this method : Creating many products at once
async function createMultipleProduct(products){
 for(let product of products){
    await createProduct(product);
 }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    findProductById,
    createMultipleProduct
}