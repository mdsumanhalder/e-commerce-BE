const User = require('../models/user.model');
const Address = require('../models/address.model');
const bcrypt = require('bcrypt');

const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

const createUser = async (userData, { allowRoleOverride = false } = {}) => {
  try {
    let { firstName, lastName, email, password, role = 'CUSTOMER', mobile } = userData;

    const normalizedEmail = email.toLowerCase().trim();
    const isUserExists = await User.findOne({ email: normalizedEmail });
    if (isUserExists) {
      throw new Error(`User already exists with this email: ${normalizedEmail}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!allowRoleOverride) {
      role = 'CUSTOMER';
    }

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      mobile
    });

    return sanitizeUser(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserById = async (userId, { lean = false } = {}) => {
  try {
    const query = User.findById(userId).populate('address');
    const user = lean ? await query.lean() : await query;
    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUserProfile = async (userId, payload) => {
  const allowedFields = ['firstName', 'lastName', 'mobile', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = payload[field];
    }
  });

  if (payload.password) {
    updates.password = await bcrypt.hash(payload.password, 10);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  ).populate('address');

  return sanitizeUser(user);
};

const setUserActiveState = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { isActive } },
    { new: true }
  );
  return sanitizeUser(user);
};

const updateUserRole = async (userId, role) => {
  if (!['CUSTOMER', 'SELLER', 'ADMIN'].includes(role)) {
    throw new Error('Invalid role value');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true }
  );
  return sanitizeUser(user);
};

const addAddress = async (userId, payload) => {
  const address = await Address.create({
    ...payload,
    user: userId
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { address: address._id } },
    { new: true }
  ).populate('address');

  return sanitizeUser(user);
};

const updateAddress = async (userId, addressId, payload) => {
  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    payload,
    { new: true }
  );
  if (!address) {
    throw new Error('Address not found');
  }
  const user = await User.findById(userId).populate('address');
  return sanitizeUser(user);
};

const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, user: userId });
  if (!address) {
    throw new Error('Address not found');
  }

  await User.findByIdAndUpdate(
    userId,
    { $pull: { address: addressId } }
  );

  const user = await User.findById(userId).populate('address');
  return sanitizeUser(user);
};

const getAllUsers = async () => {
  try {
    const users = await User.find().populate('address');
    return users.map(sanitizeUser);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { 
  createUser, 
  findUserById, 
  findUserByEmail, 
  updateUserProfile,
  setUserActiveState,
  updateUserRole,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  sanitizeUser
};
