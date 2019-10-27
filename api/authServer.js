// The purpose of authServer.js is to handle all authentication on a separate server fromt
// the normal Rest API requests. authServer.js runs on local host 4000 
// Configuration is in the www fine

const createError = require('http-errors');
const express = require('express');
// var user_controller = require('./controllers/userController');
const auth_controller = require('./controllers/authController');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcryptjs')
const { body,check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const cors = require('cors');


require('dotenv').config();
const User = require('./models/user'); //temporarily being used for authentication tutorial
const mid = require('./middleware/index');
const jwt = require('jsonwebtoken');

const app = express();

//allow OPTIONS on all resources
app.options('*', cors())

//CORS
app.use(function(req, res, next){
  // res.header("Access-Control-Expose-Headers", "Location");
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
//Set up default mongoose connection
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
//Get the default connect
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection erros)
db.on('error', console.error.bind(console, 'MongoDB connection error'));


app.use(session({
  secret: 'flashcardAppSecret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
  })
}));

// Use middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// The idea of refresh token is that you save the refresh token in a safe spot
// then your normal access tokens expire after a specified period of time
// Access is then revoked and the user needs to login to get a new token

const refreshTokens = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVAcC5jb20iLCJpYXQiOjE1NzEyOTgyNDF9.nCqkSAOus_GB3ulnmX2XCTpPT_Cv6m7WyBNsabOU2vw']

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
        const accessToken = generateAccessToken( { name: user.name } );
        res.json({ accessToken: accessToken });
    })
})

// A post request to /login at localhost 4000 will log in a user by authenticating 
// their credentials
app.post('/login', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      const err = new Error('Email and password are required');
      err.status = 401;
      res.json(err);
    } else {
      User.authenticate(req.body.email, req.body.password, function(error, user) {
        if (error || !user) {
          const err = new Error('Credentials do not match')
          err.status = 401;
          res.json(err);
        } else {
          // user._id is what we get back from the authenticate method when credentials match
          // req.session.userId = user._id;
          //
        //   return res.redirect('/profile');
        const user = {
          email: req.body.email
        }
        // generate access token
        const accessToken = generateAccessToken(user);
        // generate a refresh token
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        res.json( { accessToken: accessToken, refreshToken: refreshToken } )
        // return res.redirect('/catalog/user/' + user._id)
        }
      });
    }
  });

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
  // if (!errors.isEmpty()) {
  //     // Use the Array `map()` method to get a list of error messages.
  //     const errorMessages = errors.array().map(error => error.msg);
  //     // Create custom error with 400 status code
  //     res.status(400);
  //     return res.json(errorMessages);
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
            jwt.sign(
              { id: user._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '45m' },
              // callback
              (err, token) => {
                if(err) {
                  res.json(err)
                } 
                req.session.token = token;
                res.json({
                  token,
                  user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                  }
                })
              }
          )  
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
      // User.findOne({ where: {email: req.body.email} })
      // .then((user) => {
      //     if (user) {
      //         res.status(400);
      //         const errorMessages = [];
      //         errorMessages.push("A user")
      //         return res.json(errorMessages);
      //     } else {
      //         //req.body contains a json object with the values of the form which maps 1:1 to the Course model.
      //         req.body.userId = req.currentUser.id;                
      //         Course.create(req.body)
      //         .then((course)=>{
      //             if(!course){
      //                 const error = new Error('There was a problem posting the course'); //throw custom error
      //                 error.status =400;
      //                 next(error); // pass error along to global error handler
      //             } else {
      //                 res.locals.courseId = course.Id;
      //                 res.location(`/api/courses/${course.id}`);                        
      //                 res.status(201)                    
      //                 res.json({course: 100});                      
      //             }
      //         }).catch((error)=> {  // check for errors within body
      //             if (error.name === "SequelizeValidationError") {
      //                 // Use Sequelize ORM to catch any validation errors
      //                 // If errors exist, map over array of error objects and return array
      //                 // with error messages
      //                 const errorsArray = error.errors.map((error) => {
      //                     return error.message;                
      //                 })
      //                 const err = new Error(errorsArray); //custom error message
      //                 err.status = 400;
      //                 next(err) // pass error along to global error handler
      //             } else {
      //                 // catch any other errors and pass errors to global error handler
      //                 next(error);
      //             }
      //         });
      //         return null;
      //     };
      // }).catch((error) => {
      //     // catch any other errors and pass errors to global error handler
      //     next(error);
      // });
  };      
});

// app.post('/user/login', auth_controller.user_login_post);

app.post('/user/create',  auth_controller.user_create_post);


// Returns an access token which expires after 10 minutes
function generateAccessToken(user) {
   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'})
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

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
