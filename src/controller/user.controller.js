const userService = require('../services/user.service');
const auditLogService = require('../services/auditLog.service');

const getUserProfile = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user._id);
    return res.status(200).send(userService.sanitizeUser(user));
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated = await userService.updateUserProfile(req.user._id, req.body);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'USER_PROFILE_UPDATED',
      targetType: 'USER',
      targetId: req.user._id.toString(),
      metadata: { fields: Object.keys(req.body) },
      request: req
    });
    return res.status(200).send(updated);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const user = await userService.addAddress(req.user._id, req.body);
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const user = await userService.updateAddress(req.user._id, req.params.id, req.body);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await userService.deleteAddress(req.user._id, req.params.id);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const setUserRole = async (req, res) => {
  try {
    const updated = await userService.updateUserRole(req.params.id, req.body.role);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'USER_ROLE_UPDATED',
      targetType: 'USER',
      targetId: req.params.id,
      metadata: { role: req.body.role },
      request: req
    });
    return res.status(200).send(updated);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const toggleUserActive = async (req, res) => {
  try {
    const updated = await userService.setUserActiveState(req.params.id, req.body.isActive);
    await auditLogService.recordLog({
      actor: req.user._id,
      action: 'USER_STATUS_UPDATED',
      targetType: 'USER',
      targetId: req.params.id,
      metadata: { isActive: req.body.isActive },
      request: req
    });
    return res.status(200).send(updated);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  setUserRole,
  toggleUserActive
};
