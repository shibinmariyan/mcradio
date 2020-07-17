const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./../model/userModel');
module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = "community";
    passport.use(new JwtStrategy(opts, (jwtpayload, done) => {
        console.log("got call")

        User.findOne({ userName: jwtpayload.userName }, (err, user) => {
            console.log("-----", err, user, "------")
            if (err)
                return done(err, false);
            if (user)
                return done(null, user);
            else
                return done(null, false);
        });
    }));
};