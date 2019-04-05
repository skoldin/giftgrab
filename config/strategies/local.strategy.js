const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');
const { getCol } = require('../../db')();
const bcrypt = require('bcrypt');

module.exports = function localStrategy() {
  async function getUser(email, password) {
    let user = null;

    try {
      const col = await getCol('users');

      user = await col.findOne({ email });

      debug('Found user by email');
      debug(user);

      if (!user) {
        return { error: 'The username or password is wrong', user };
      }

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        return { user };
      }

      return { error: 'The username or password is wrong', user: null };
    } catch (e) {
      debug(e.stack);
    }

    client.close();
  }

  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req, email, password, done) => {
        getUser(email, password).then((response) => {
          if (response.error) {
            req.flash('error', response.error);
          }

          done(null, response.user);
        });
      }
    )
  );
};
