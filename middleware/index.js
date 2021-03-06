const jwt = require('jsonwebtoken');
require('dotenv').config();

// process.env.ACCESS_TOKEN_SECRET

function loggedOut(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/user/' + req.session.userId)
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

function auth(req, res, next) {
    // authHeader holds the value of the authorization header sent in the request body
    // const token = req.header('x-auth-token') || req.headers['authorization'];
    const authHeader = req.headers['authorization'];
    // console.log(authHeader)
    // // We split the authHeader because there should be a space between 'Bearer' and the Token
    // // token returns undefined if authHeader doesn't exist
    const token = authHeader && authHeader.split(' ')[1];
    
    // Check for token
    // Token returns undefined if authHeader doesn't exist

    if (token == null) {
        res.status(400);
        const errorMessages = [];
        errorMessages.push("Insufficient Credentials")
        return res.json(errorMessages);
    }    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('error token')
            res.status(400);
            const errorMessages = [];
            errorMessages.push("Insufficient Credentials")
            return res.json(errorMessages);
        }
        // Add user from payload
        // user contains token with subjects id
        // formatted like this...
//         { id: '5da54d1a8d782aa485a25f3f',
//           iat: 1571685501,
//           exp: 1571686101 }
        req.user = user;
        next();
    })
}

module.exports.requiresLogin = requiresLogin;
module.exports.loggedOut = loggedOut;
module.exports.auth = auth;
