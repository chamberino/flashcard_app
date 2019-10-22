const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

// const options = {
//   dialect: 'sqlite',
//   storage: './fsjstd-restapi.db',
//   // This option configures Sequelize to always force the synchronization
//   // of our models by dropping any existing tables.
//   sync: { force: true },
//   define: {
//     // This option removes the `createdAt` and `updatedAt` columns from the tables
//     // that Sequelize generates from our models. These columns are often useful
//     // with production apps, so we'd typically leave them enabled, but for our
//     // purposes let's keep things as simple as possible.
//     timestamps: false,
//   },
// };


require('dotenv').config();
const User = require('./models/user'); //temporarily being used for authentication tutorial
const mid = require('./middleware/index');
const jwt = require('jsonwebtoken');


// const mongoDB = require('./config.js');

const app = express();

//allow OPTIONS on all resources
app.options('*', cors())

//CORS
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Location");
  if(req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
      return res.status(200).json({});
  }
  next();
});

//Import the mongoose module
const mongoose = require('mongoose');
// Mongo Atlas Connection String
const mongoDB = process.env.mongoURI;
// Set up default mongoose connection
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  // .then((error, result) => {
  //     if (error) {
  //       res.json('cannot connect to server');
  //     } else {
  //       return result
  //     }
  // }).catch((err)=> err)

// Get the default connect
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection erros)
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(session({
  secret: 'flashcardAppSecret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
  })
}));

// app.use( (req, res, next) => {
//     res.locals.currentUser = req.session.userId;
//     console.log(req.session.userId)
//     console.log(req.session.token)
//     next();
//   })

// make user ID available in templates
// Locals provides a way for you to add information to the response object
// All views have access to the response's locals object
// app.use( (req, res, next) => {
//   res.locals.currentUser = req.session.userId;
//   next();
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// route uses authenticateToken middleware to check for valid user
// user information is returned if successful
app.get('/posts', mid.authenticateToken, (req, res)=>{
  req.user;
  console.log(req.user)
  res.send(req.user);
})

app.post('/login', (req, res, next) => {
  // user info is expected to be sent in body of the request
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  // token is created using users information, signed with token secret
  // and returned to user.
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json( { accessToken: accessToken} )

  // if (user.email && user.password) {
  //   User.authenticate(user.email, user.password, function(error, user) {
  //     if (error || !user) {
  //       const err = new Error('Credentials do not match')
  //       err.status = 401;
  //       return next(err);
  //     } else {
  //       // user._id is what we get back from the authenticate method when credentials match
  //       req.session.userId = user._id;
  //     //   return res.redirect('/profile');
  //         return res.redirect('/catalog/user/' + user._id)
  //     }
  //   });
  // } else {
  //   const err = new Error('Email and password are required');
  //   err.status = 401;
  //   return next(err);
  // }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
