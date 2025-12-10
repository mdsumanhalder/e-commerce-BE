const Category = require("../models/category.model");
const Product = require("../models/product.model");

const productStatusFilter = (query = {}) => {
  const filter = { isDeleted: false, status: 'APPROVED' };
  if (query.status) {
    filter.status = query.status;
  }
  if (query.includeDeleted === 'true') {
    delete filter.isDeleted;
  }
  return filter;
};

async function ensureCategories(reqData) {
  let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

  if (!topLevel) {
    topLevel = new Category({ name: reqData.topLevelCategory, level: 1 });
    await topLevel.save();
  }

  let secondLevel = await Category.findOne({ name: reqData.secondLevelCategory, parentCategory: topLevel._id });

  if (!secondLevel) {
    secondLevel = new Category({ name: reqData.secondLevelCategory, parentCategory: topLevel._id, level: 2 });
    await secondLevel.save();
  }

  let thirdLevel = await Category.findOne({ name: reqData.thirdLevelCategory, parentCategory: secondLevel._id });

  if (!thirdLevel) {
    thirdLevel = new Category({ name: reqData.thirdLevelCategory, parentCategory: secondLevel._id, level: 3 });
    await thirdLevel.save();
  }

  return thirdLevel._id;
}

async function createProduct(reqData, seller) {
  if (!seller) {
    throw new Error('Seller context is required to create product');
  }
  const sellerId = seller._id || seller;
  const categoryId = await ensureCategories(reqData);

  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice: reqData.discountedPrice,
    discountPersent: reqData.discountPersent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price: reqData.price,
    sizes: reqData.size || reqData.sizes,
    quantity: reqData.quantity,
    category: categoryId,
    seller: sellerId,
    status: seller.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
    approvalHistory: [{
        status: seller.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        changedBy: sellerId,
        reason: seller.role === 'ADMIN' ? 'Created by admin' : 'Awaiting admin approval'
    }]
  });

  const savedProduct = await product.save();
  return await Product.findById(savedProduct._id).populate('category').populate('seller');
}

async function updateProduct(productId, reqData, user) {
  const existing = await Product.findById(productId);
  if (!existing) {
    throw new Error("Product not found");
  }

  if (user.role !== 'ADMIN' && existing.seller.toString() !== user._id.toString()) {
    throw new Error('You do not have permission to update this product');
  }

  if (user.role !== 'ADMIN') {
    existing.status = 'PENDING';
    existing.approvalHistory.push({
      status: 'PENDING',
      changedBy: user._id,
      reason: 'Awaiting approval after update'
    });
  }

  Object.assign(existing, reqData);
  await existing.save();
  return await Product.findById(productId).populate('category').populate('seller');
}

async function softDeleteProduct(productId, user) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  if (user.role !== 'ADMIN' && product.seller.toString() !== user._id.toString()) {
    throw new Error('You do not have permission to delete this product');
  }

  product.isDeleted = true;
  product.deletedAt = new Date();
  product.deletedBy = user._id;
  product.status = 'ARCHIVED';
  product.approvalHistory.push({
    status: 'ARCHIVED',
    changedBy: user._id,
    reason: 'Soft delete'
  });
  await product.save();
  return product;
}

async function restoreProduct(productId, adminUser) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.isDeleted = false;
  product.deletedAt = null;
  product.deletedBy = null;
  product.status = 'PENDING';
  product.approvalHistory.push({
    status: 'PENDING',
    changedBy: adminUser._id,
    reason: 'Restored by admin'
  });
  await product.save();
  return product;
}

async function approveProduct(productId, adminUser, { reason } = {}) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.status = 'APPROVED';
  product.approvedAt = new Date();
  product.approvedBy = adminUser._id;
  product.rejectionReason = null;
  product.approvalHistory.push({
    status: 'APPROVED',
    changedBy: adminUser._id,
    reason: reason || 'Approved'
  });
  await product.save();
  return product;
}

async function rejectProduct(productId, adminUser, reason) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.status = 'REJECTED';
  product.rejectionReason = reason;
  product.approvalHistory.push({
    status: 'REJECTED',
    changedBy: adminUser._id,
    reason
  });
  await product.save();
  return product;
}

async function findProductById(id) {
  const product = await Product.findById(id)
    .populate('category')
    .populate('seller')
    .exec();
  if(!product){
     throw new Error("Product not found with id: " + id);
  }
  return product;
}

async function buildBaseQuery(queryParams = {}, options = {}) {
  let {
      category,
      color,
      sizes,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      stock,
      pageNumber = 1,
      pageSize = 10,
      status
  } = queryParams;

  pageNumber = Number(pageNumber) || 1;
  pageSize = Number(pageSize) || 10;

  let query = Product.find();

  if (!options.includeAllStatuses) {
    query = query.find(productStatusFilter({ status }));
  }

  if (category) {
      const existCategory = await Category.findOne({ name: category });
      if (existCategory) {
          query = query.where('category').equals(existCategory._id);
      } else {
          return { query: Product.find().limit(0), pageNumber, pageSize };
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
      const sortDirection = sort === "price_high" ? -1 : 1;
      query = query.sort({ discountedPrice: sortDirection });
  }

  if (options.sellerId) {
    query = query.where('seller').equals(options.sellerId);
    if (options.includeAllStatuses !== true) {
      query = query.where('isDeleted').equals(false);
    }
  }

  return { query, pageNumber, pageSize };
}

async function getAllProducts(reqQuery, options = {}) {
    const { query, pageNumber, pageSize } = await buildBaseQuery(reqQuery, options);
    const queryFilter = query.getFilter ? query.getFilter() : query.getQuery();
    const totalProducts = await Product.countDocuments(queryFilter);
    const skip = Math.max((pageNumber - 1) * pageSize, 0);

    const products = await query
      .populate('category')
      .populate('seller')
      .skip(skip)
      .limit(pageSize)
      .exec();
    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
        content: products,
        currentPage: pageNumber,
        totalPages: totalPages,
        totalElements: totalProducts,
        pageSize: pageSize
    };
}

async function getSellerProducts(userId, query) {
  return getAllProducts(query, { sellerId: userId, includeAllStatuses: true });
}

async function getAdminProducts(query = {}) {
  const includeAllStatuses = !query.status;
  return getAllProducts(query, { includeAllStatuses });
}

async function createMultipleProduct(products, seller) {
  if (!seller) {
    throw new Error('Seller context is required to create products');
  }
  const created = [];
  for(let product of products){
     const createdProduct = await createProduct(product, seller);
     created.push(createdProduct);
  }
  return created;
}

module.exports = {
    createProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    approveProduct,
    rejectProduct,
    getAllProducts,
    getSellerProducts,
    getAdminProducts,
    findProductById,
    createMultipleProduct
};
