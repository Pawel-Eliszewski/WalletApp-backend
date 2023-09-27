const passport = require('passport')
const auth = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        const token = req.header('authorization').split(" ")[1];
        if (err) {
            return next(err);
        }
        if (!user || err || !token || user.token !== token) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Unauthorized',
                data: 'Unauthorized',
            })
        }
        req.user = user
        next()
    })(req, res, next)
}

module.exports = auth;