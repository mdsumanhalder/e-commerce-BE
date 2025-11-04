const userService = require('../services/user.service');
const cartService = require('../services/cart.service');
const  jwtProvider = require('../config/jwtProvider');
const bcrypt = require('bcrypt');


const  register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtProvider.generateToken(user._id);

        await cartService.createCart(user);

       return res.status(200).send({ jwt, message: 'register success'})
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).send({ error: 'User not found with email :', email });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid password...' });
        }

        const jwt = jwtProvider.generateToken(user._id);
        return res.status(200).send({ jwt, message: 'Login successful' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { register, login };