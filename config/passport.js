const passport = require('passport');
const debug = require('debug')('app:passport');

require('./strategies/local.strategy')();

module.exports = function passportConfig(app) {
  // this will add login to our request
  app.use(passport.initialize());

  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });
  passport.deserializeUser((email, done) => {
    done(null, email);
  });
};
