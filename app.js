const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');

const orderRouter = require('./routes/orderRoutes')();
const authRouter = require('./routes/authRoutes')();

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan('tiny'));

app.use(fileUpload({
  limits: { fileSize: 3 * 1024 * 1024 },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'giftgrab',
  resave: false,
  saveUninitialized: false,
  secure: app.get('env') === 'production',
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  res.locals.info_messages = req.flash('info');
  next();
});

require('./config/passport')(app);

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/js', express.static(path.join(__dirname, '/bootstrap/dist/js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.set('view engine', 'ejs');

// middleware to check if the user logged in
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
});

app.use('/order', orderRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
