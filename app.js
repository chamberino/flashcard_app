const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const auth_controller = require('./controllers/authController');
const user_controller = require('./controllers/userController');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcryptjs');
const { check,validationResult } = require('express-validator');


const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

require('dotenv').config();
const User = require('./models/user');
const mid = require('./middleware/index');
const jwt = require('jsonwebtoken');

const app = express();

app.use(compression()); //Compress all routes
app.use(helmet());

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
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })

// Get the default connect
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection erros)
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// Use middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
// for JWT
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: db,
  })
}));

app.use('/api', catalogRouter);  // Adds catalog routes to middleware chain.

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {

  // Set static folder
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    message: err.message,
    errorStatus: err.status,
  });
});

// The idea of refresh token is that you save the refresh token in a safe spot
// then your normal access tokens expire after a specified period of time
// Access is then revoked and the user needs to login to get a new token

const refreshTokens = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYTU0ZDFhOGQ3ODJhYTQ4NWEyNWYzZiIsImlhdCI6MTU3MjI5NjIzMn0.cG6Mq2BSC2f9OFSAhOGd7m1FFJej2MLaCcLbG6G7YBo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVAcC5jb20iLCJpYXQiOjE1NzEyOTgyNDF9.nCqkSAOus_GB3ulnmX2XCTpPT_Cv6m7WyBNsabOU2vw']

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken( { id: user._id } );
        res.json({ accessToken: accessToken });
    })
})


// Tutorial on JWT (JSON Web Tokens)
// https://www.youtube.com/watch?v=mbsmsi7l3r4&feature=youtu.be
app.post('/user/login', [
  check('email')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Email required'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Password required'),
], (req, res, next) => {
    // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);
  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `forEach()` method to push a list of error messages received from 
    // Mongoose validation to errorMessages array.
    const errorMessages = [];
        errors.array().forEach(error => errorMessages.push(error.msg))
        return res.json(errorMessages)
  } else {
    User.findOne({email: req.body.email})
    .then((user)=>{
      if (!user) {        
        const errorMessages = [];
        errorMessages.push("User not found")
        return res.json(errorMessages)
      }
      if (user) {
        bcrypt.compare(req.body.password, user.password, function(error, result) {
          if (result === true) {
            token = generateAccessToken({ id: user._id })
            refreshToken = generateRefreshToken({ id: user._id })
          //   jwt.sign(
          //     { id: user._id },
          //     process.env.ACCESS_TOKEN_SECRET,
          //     { expiresIn: '45m' },
          //     // callback
          //     (err, token) => {
          //       if(err) {
          //         res.json(err)
          //       } 
          //       // req.session.token = token;
          //       res.json({                  
          //         token,
          //         refreshToken: refreshToken,
          //         test:'test',
          //         user: {
          //           id: user._id,
          //           name: user.name,
          //           email: user.email
          //         }
          //       })
          //     }
          // )  
          req.session.refreshToken = refreshToken;
          console.log(req.session.refreshToken)
          res.json({token,
                    refreshToken: refreshToken,
                    test:'test',
                    user: {
                      id: user._id,
                      name: user.name,
                      email: user.email
                    }
                  })
          } else {
            const errorMessages = [];
            errorMessages.push("Credentials don't match")
            return res.json(errorMessages)
          }
      })
      }
    }).catch((error) => {  
      // catch any other errors and pass errors to global error handler
      next(error);
  });
  };      
});

app.post('/user/create',  user_controller.user_create_post);

app.get('/user/logout', auth_controller.user_logout);

// Returns an access token which expires after 10 minutes
function generateAccessToken(user) {
  //  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45m'})
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // set status and send error
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;