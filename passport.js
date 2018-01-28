const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require('./models/user');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local').Strategy;
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


// LOCAL STRATEGY
const localStrategy = new LocalStrategy({
    usernameField: 'email'
}, async (email, password, next) => {
    try {
        const user = await User.findOne({ email });

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

module.exports = passport;