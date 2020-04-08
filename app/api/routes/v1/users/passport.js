const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../../../../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.query().findOne('email', email);

        // Handle when user is not found 
        if (!user) {
            return done(null, false, { errors: { message:  'Provide a valid email' } });
        }
        
        // Handle password is not valid
        if (!user.validatePassword(password)) {
            return done(null, false, { errors: { message:  'Provide a valid password' } });
        }
        // return user 
        return done(null, user);
    } catch (error) {
        // handle error cause by failed findOne query
        done(error);
    }
}));
