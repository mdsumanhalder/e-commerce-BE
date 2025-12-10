const productService = require('../services/product.service');
const auditLogService = require('../services/auditLog.service');

const listSellerProducts = async (req, res) => {
  try {
    const products = await productService.getSellerProducts(req.user._id, req.query);
    return res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createSellerProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_CREATED_SELLER',
      targetType: 'PRODUCT',
      targetId: product._id.toString(),
      metadata: { title: product.title },
      request: req
    });
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateSellerProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_UPDATED_SELLER',
      targetType: 'PRODUCT',
      targetId: req.params.id,
      metadata: { fields: Object.keys(req.body) },
      request: req
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteSellerProduct = async (req, res) => {
  try {
    const product = await productService.softDeleteProduct(req.params.id, req.user);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'PRODUCT_DELETED_SELLER',
      targetType: 'PRODUCT',
      targetId: req.params.id,
      metadata: {},
      request: req
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  listSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct
};
