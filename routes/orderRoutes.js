const express = require('express');
const debug = require('debug')('app:orderRoutes');
const unf = require('unique-file-name');
const sendOrderEmail = require('../mail');
const { getDb } = require('../db')();

const namer = unf({
  format: '%16b_%6r%8e',
  dir: 'uploads'
});

const orderRouter = express.Router();

function router() {
  async function uploadPhotos(photos) {
    const uploadedPhotos = [];

    photos.forEach((photo) => {
      const photoName = namer(photo.name);

      uploadedPhotos.push({ namePromise: photoName, file: photo });
    });

    try {
      await Promise.all(uploadedPhotos.map((photo) => photo));

      uploadedPhotos.forEach((photo) => {
        const { file, namePromise } = photo;

        const allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];

        if (!allowedTypes.includes(file.mimetype)) {
          throw new Error('Please upload only jpg, png or gif images');
        }

        namePromise.then((name) => {
          file.mv(name, (err) => {
            if (err) {
              debug(err);
            }
          });
        });
      });
    } catch (e) {
      debug(e.stack);
      return { error: e.message };
    }

    return uploadedPhotos;
  }

  async function postOrder(order, photos, userEmail) {
    let uploadedPhotos = [];

    if (photos && photos.length) {
      const uploadedPhotosResponse = await uploadPhotos(photos);

      if (uploadedPhotosResponse.error) {
        return { error: uploadedPhotosResponse.error };
      }
    }

    try {
      const db = await getDb();
      const usersCol = db.collection('users');
      const ordersCol = db.collection('orders');

      // get the current user ID to reference in the order
      const user = await usersCol.findOne(
        { email: userEmail },
        { projection: { _id: 1, firstName: '', lastName: '' } }
      );

      debug('User ID in the database');
      debug(user);

      const orderData = { ...order, uploadedPhotos, user: user._id };

      const results = await ordersCol.insertOne(orderData);

      debug('Order created');
      debug(results.insertedId);

      // use different user details for email
      order.user = `${user.firstName} ${user.lastName} ${user.email}`;

      sendOrderEmail(order);

      return true;
    } catch (e) {
      debug(e.stack);
      return { error: e.stack };
    }
  }

  orderRouter
    .route('/')
    .get((req, res) => {
      // redirect to sign up if not logged in
      if (req.user) {
        res.render('order');
      } else {
        req.flash('info', 'Please sign up or sign in to order');
        res.redirect('/auth/signup');
      }
    })
    .post((req, res) => {
      let photos;

      if (req.files.photoUpload && Array.isArray(req.files.photoUpload)) {
        photos = req.files.photoUpload;
      } else if (req.files.photoUpload) {
        photos = [req.files.photoUpload];
      }

      postOrder(req.body, photos, req.user).then((response) => {
        if (response.error) {
          req.flash('error', response.error);
          res.redirect('back');
        }

        res.send('Thank you for your order!');
      });
    });

  return orderRouter;
}

module.exports = router;
