const userService = require('../services/user.service');
const cartService = require('../services/cart.service');
const jwtProvider = require('../config/jwtProvider');
const bcrypt = require('bcrypt');
const refreshTokenService = require('../services/refreshToken.service');
const auditLogService = require('../services/auditLog.service');

const buildAuthPayload = async (user, req, refreshOverride, event = 'login') => {
    const accessToken = jwtProvider.generateAccessToken(user);
    const refresh = refreshOverride || await refreshTokenService.createRefreshToken(user);

    await auditLogService.recordLog({
        actor: user._id,
        action: 'AUTH_TOKEN_ISSUED',
        targetType: 'USER',
        targetId: user._id.toString(),
        metadata: { event },
        request: req
    });

    return {
        accessToken,
        refreshToken: refresh.token,
        refreshTokenExpiresAt: refresh.expiresAt,
        user
    };
};

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        await cartService.createCart(user._id);

        const authPayload = await buildAuthPayload(user, req, undefined, 'register');

        res.status(201).send({
            message: 'Registration successful',
            ...authPayload
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).send({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        user.lastLoginAt = new Date();
        await user.save();
        const sanitizedUser = userService.sanitizeUser(user);

        const authPayload = await buildAuthPayload(sanitizedUser, req);

        return res.status(200).send({
            message: 'Login successful',
            ...authPayload
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).send({ error: 'Refresh token is required' });
        }
        const rotated = await refreshTokenService.rotateRefreshToken(refreshToken);

        const accessToken = jwtProvider.generateAccessToken(rotated.user);

        res.status(200).send({
            message: 'Token refreshed',
            accessToken,
            refreshToken: rotated.token,
            refreshTokenExpiresAt: rotated.expiresAt,
            user: rotated.user
        });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await refreshTokenService.revokeRefreshToken(refreshToken);
        } else if (req.user) {
            await refreshTokenService.revokeTokensForUser(req.user._id);
        }

        res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { register, login, refresh, logout };
