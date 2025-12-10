const productService = require('../services/product.service');
const auditLogService = require('../services/auditLog.service');

const listProducts = async (req, res) => {
  try {
    const products = await productService.getAdminProducts(req.query);
    return res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_CREATED_ADMIN',
      targetType: 'PRODUCT',
      targetId: product._id.toString(),
      metadata: { title: product.title },
      request: req
    });
    return res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createMultipleProducts = async (req, res) => {
  try {
    const products = await productService.createMultipleProduct(req.body, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCTS_BULK_CREATED',
      targetType: 'PRODUCT',
      targetId: 'BULK',
      metadata: { count: products.length },
      request: req
    });
    return res.status(201).send({ message: 'Products created successfully', count: products.length });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_UPDATED_ADMIN',
      targetType: 'PRODUCT',
      targetId: req.params.id,
      metadata: { fields: Object.keys(req.body) },
      request: req
    });
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.softDeleteProduct(req.params.id, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_SOFT_DELETED',
      targetType: 'PRODUCT',
      targetId: req.params.id,
      metadata: {},
      request: req
    });
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const approveProduct = async (req, res) => {
  try {
    const product = await productService.approveProduct(req.params.id, req.user, req.body);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_APPROVED',
      targetType: 'PRODUCT',
      targetId: req.params.id,
      metadata: { reason: req.body?.reason },
      request: req
    });
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const product = await productService.rejectProduct(req.params.id, req.user, req.body.reason);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_REJECTED',
      targetType: 'PRODUCT',
      targetId: req.params.id,
      metadata: { reason: req.body.reason },
      request: req
    });
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const restoreProduct = async (req, res) => {
  try {
    const product = await productService.restoreProduct(req.params.id, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_RESTORED',
      targetType: 'PRODUCT',
      targetId: req.params.id,
      metadata: {},
      request: req
    });
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  listProducts,
  createProduct,
  createMultipleProducts,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  restoreProduct
};
