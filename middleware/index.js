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

module.exports.requiresLogin = requiresLogin;
module.exports.loggedOut = loggedOut;