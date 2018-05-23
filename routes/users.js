const router = require('express').Router();
const UsersController = require('./../controllers/users');
const { validateBody, schemas } = require('./../helpers/routeHelpers');
const passport = require('passport');

router.route('/signup')
    .post(validateBody(schemas.userSignUp), UsersController.signUp);

router.route('/signin')
    .post(validateBody(schemas.userSignIn), passport.authenticate('local', { session: false }), UsersController.signIn);

router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false }), UsersController.googleOAuth);

router.route('/secret')
    .get(passport.authenticate('jwt', { session: false }), UsersController.secret);

module.exports = router;