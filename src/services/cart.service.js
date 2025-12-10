const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const Product = require('../models/product.model');

async function createCart(user) {
  try {
    const userId = typeof user === 'object' && user._id ? user._id : user;
    const cart = new Cart({ user: userId, cartItems: [] });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

const attachCartItems = async (cart) => {
  if (!cart) return null;
  const cartItems = await CartItem.find({ cart: cart._id }).populate('product');
  cart.cartItems = cartItems;

  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItem = 0;
  for (let cartItem of cart.cartItems) {
      totalPrice += cartItem.price * cartItem.quantity;
      totalDiscountedPrice += cartItem.discountedPrice * cartItem.quantity;
      totalItem += cartItem.quantity;
  }
  cart.totalPrice = totalPrice;
  cart.totalDiscountedPrice = totalDiscountedPrice;
  cart.totalItem = totalItem;
  cart.discounte = totalPrice - totalDiscountedPrice;

  return cart;
};

async function findUserCart(userId) {
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await createCart(userId);
    }
    return await attachCartItems(cart);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function addCartItem(userId, payload) {
  try {
    const cart = await Cart.findOne({ user: userId }) || await createCart(userId);
    const product = await Product.findById(payload.productId);
    if (!product) throw new Error("Product not found");

    const quantityToAdd = payload.quantity && payload.quantity > 0 ? payload.quantity : 1;

    let cartItem = await CartItem.findOne({ cart: cart._id, product: product._id, userId, size: payload.size });

    if (cartItem) {
        cartItem.quantity += quantityToAdd;
    } else {
        cartItem = new CartItem({
            product: product._id,
            cart: cart._id,
            quantity: quantityToAdd,
            userId,
            price: product.price,
            discountedPrice: product.discountedPrice,
            size: payload.size,
        });
        cart.cartItems.push(cartItem._id);
    }

        cartItem.price = product.price;
        cartItem.discountedPrice = product.discountedPrice;

    await cartItem.save();
    await cart.save();

    return await attachCartItems(cart);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function clearCart(userId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;
  await CartItem.deleteMany({ cart: cart._id });
  cart.cartItems = [];
  cart.totalItem = 0;
  cart.totalPrice = 0;
  cart.totalDiscountedPrice = 0;
  cart.discounte = 0;
  await cart.save();
  return cart;
}

module.exports ={ createCart, findUserCart, addCartItem, clearCart };
