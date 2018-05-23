const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require('./models/user');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const config = require('./config/config');


// JWT STRATEGY
const jwtStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}, async (jwtPayload, next) => {
    try {
        const user = await User.findById(jwtPayload.sub);

        if(!user) {
            return next(null, false);
        }

        return next(null, user);

    } catch (error) {
        next(error, false);
    }
});

// GOOGLE PLUS OAUTH STRATEGY
const googlePlusStrategy = new GooglePlusTokenStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret
}, async (accessToken, refreshToken, profile, next) => {
    try {
        const user = await User.findOne({ 'google.id': profile.id });
        if (user) {
            return next(null, user);
        }

        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        console.log(profile.emails[0].value);
        await newUser.save();

        return next(null, newUser);
    } catch (error) {
        next(error, false, error.message);
    }
});

// LOCAL STRATEGY
const localStrategy = new LocalStrategy({
    usernameField: 'email'
}, async (email, password, next) => {
    try {
        const user = await User.findOne({ 'local.email': email });

        if (!user) {
            return next(null, false);
        }

        const isMatch = await user.isValidPassword(password);
        if(!isMatch) {
            return next(null, false);
        }

        return next(null, user);
    } catch (error) {
        next(error, false);
    }
});



passport.use(jwtStrategy);
passport.use(localStrategy);
passport.use('googleToken', googlePlusStrategy);

module.exports = passport;