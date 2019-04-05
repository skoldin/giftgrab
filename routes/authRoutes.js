const express = require('express');
const debug = require('debug')('app:authRouter');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { getCol } = require('../db')();

const authRouter = express.Router();

function router() {
  async function signUp(userData) {
    const { firstName, lastName, email, password, passwordRepeat } = userData;

    if (!password) {
      return { error: 'Password should not be empty' };
    }

    if (password !== passwordRepeat) {
      return { error: 'Passwords do not match' };
    }

    if (!email) {
      return { error: 'Email is a required field' };
    }

    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const col = await getCol('users');
      const user = {
        email,
        firstName,
        lastName,
        password: passwordHash
      };

      const check = await col.findOne({ email });

      if (check) {
        return { error: 'The user with this email already exists' };
      }

      const results = await col.insertOne(user);

      return results.ops[0];
    } catch (e) {
      debug(e.stack);
    }
  }

  authRouter
    .route('/signup')
    .get((req, res) => {
      res.render('signup');
    })
    .post((req, res) => {
      signUp(req.body).then((response) => {
        if (response.error) {
          req.flash('error', response.error);
          res.redirect('/');
        }

        req.login(response, () => {
          res.redirect('/');
        });
      });
    });

  authRouter.route('/signin').post(
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
  authRouter.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
  });

  return authRouter;
}

module.exports = router;
