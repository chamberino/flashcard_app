const jwt = require('jsonwebtoken');
require('dotenv').config();

// process.env.ACCESS_TOKEN_SECRET

function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/catalog/user/' + req.session.userId)
    }
    return next()
}

function requiresLogin(req, res, next) {
    if (!req.session.userId) {
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
    return next();
}

function authenticateToken(req, res, next) {
    // authHeader holds the value of the authorization header sent in the request body
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    // We split the authHeader because there should be a space between 'Bearer' and the Token
    // token returns undefined if authHeader doesn't exist
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (token == null) {
        var err = new Error("There was a problem processing your login request");
        err.status = 401;
        return next(err);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.send(err)
            next();
            // var err = new Error("Your session has expired. Please log in again");
            // err.status = 403;            
            // return next(err);  
        }
        req.user = user;
        next();
    })
}

function auth(req, res, next) {
    // authHeader holds the value of the authorization header sent in the request body
    const token = req.header('x-auth-token') || req.headers['authorization'];
    // const authHeader = req.headers['authorization'];
    // console.log(authHeader)
    // // We split the authHeader because there should be a space between 'Bearer' and the Token
    // // token returns undefined if authHeader doesn't exist
    // const token = authHeader && authHeader.split(' ')[1];
    
    // Check for token
    // Token returns undefined if authHeader doesn't exist

    if (token == null) {
    var err = new Error("There was a problem processing your login request");
        err.status = 401;
        return next(err);
    }    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.send(err)
            return next(err);
        }
        // Add user from payload
        req.user = user;
        next();
    })
}

module.exports.requiresLogin = requiresLogin;
module.exports.loggedOut = loggedOut;
module.exports.authenticateToken = authenticateToken;
module.exports.auth = auth;