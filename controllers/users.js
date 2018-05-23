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
            const foundUser = await User.findOne({ 'local.email': email });

            if (foundUser) {
                return res.status(403).json({ error: 'This Email is already exist!!!!' });
            }
// 
            const newUser = new User({
                method: 'local',
                local: {
                    email,
                    password
                }
            });

            await newUser.save();

            const access_token = signToken(newUser);

            res.status(200).json({
                access_token,
                user: newUser
            });
        } catch (error) {
            next(error);
        }
    },

    async signIn(req, res, next) {
        try {
            const { user } = req;
            const access_token = signToken(user);

            res.status(200).json({
                access_token,
                user
            });
        } catch (error) {
            next(error);
        }
    },

    async googleOAuth(req, res, next) {
        const { user } = req;
        const access_token = signToken(user);
        
        res.status(200).json({
            access_token,
            user
        });
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