const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');

const signToken = user => {
    return jwt.sign({
        iss: 'iss',
        sub: user.id,
        iat: new Date().getTime(), // current Time
        exp: new Date().setDate(new Date().getDate() + 1) // current Time + 1 day
    }, config.jwtSecret);
};

module.exports = {
    async signUp(req, res, next) {
        try {
            const { email, password } = req.value.body;
            const foundUser = await User.findOne({ email });

            if (foundUser) {
                return res.status(403).json({ error: 'This Email is already exist!!!!' });
            }
// 
            const newUser = new User({
                email,
                password
            });

            await newUser.save();

            const token = signToken(newUser);

            res.status(200).json({
                token,
                user: newUser
            });
        } catch (error) {
            next(error);
        }
    },
    async signIn(req, res, next) {
        try {
            const { user } = req;
            const token = signToken(user);

            res.status(200).json({
                token,
                user
            });
        } catch (error) {
            next(error);
        }
    },
    async secret(req, res, next) {
        try {
            console.log('secret');
            res.send({ secret: 'secret data' });
        } catch (error) {
            next(error);
        }
    },
};