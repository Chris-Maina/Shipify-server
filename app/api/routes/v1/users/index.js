const passport = require('passport');
const router = require('express').Router();
const User = require('../../../../models/user');
const auth = require('../../../middlewares/auth');
require('./passport');

router.post('/signup', auth.optional, async (req, res) => {
    const { body: { email, firstName, lastName, password } } = req;

    if (!email) {
        return res.status(422).json({
            message: 'Email is required'
        });
    }
    if (!password) {
        return res.status(422).json({
            message: 'Password is required'
        })
    }

    try {
        let user = await User.query().findOne('email', email)

        if (user) return res.status(409).json({
            message: 'A user with that email exists'
        })
        // create a user instance
        user = await User.query().insert({
            email,
            last_name: lastName,
            first_name: firstName,
        });
        user.setPassword(password);

        // save user
        await user.$query().patch();

        return res.status(201).json({ user: user.toAuthJSON() });

    } catch (error) {
        return res.status(422).json({
            message: error.message,
            error
        })
    }

});

router.post('/login', auth.optional, async (req, res, next) => {
    const { body: { email, password } } = req;

    if (!email) {
        return res.status(422).json({
            message: 'Email is required'
        });
    }
    if (!password) {
        return res.status(422).json({
            message: 'Password is required'
        })
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }
        if (!passportUser) return res.status(400).json(info);

        return res.status(200).json({ user: passportUser.toAuthJSON() });
    })(req, res, next);
});

router.get('/user', auth.required, async (req, res) => {
    const { user } = req;

    try {
        let userInToken = await User.query().findById(user.id);

        userInToken = {
            id: userInToken.id,
            email: userInToken.email,
            first_name: userInToken.first_name,
            last_name: userInToken.last_name,
        }
        return res.status(200).json({ user: userInToken });
    } catch (error) {
        return res.status(403).json({
            message: error.message,
            error,
        })
    }
});

module.exports = router;
