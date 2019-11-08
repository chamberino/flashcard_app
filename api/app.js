const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

require('dotenv').config();
const mid = require('./middleware/index');
const jwt = require('jsonwebtoken');

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

app.use('/', catalogRouter);  // Adds catalog routes to middleware chain.

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

module.exports = app;
