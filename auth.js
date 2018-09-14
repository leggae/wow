const _ = require('lodash')
const isAppman = function (email){
    return ( 'appman.co.th' === email.replace(/.*@/, '') )
}
module.exports.isAuthorized  = function(req, res, next) {
    if( _.has(req, 'session.email') ){
        console.log(req.session.email)
        if(isAppman(req.session.email))
            return next();
        req.session = null
        return res.status(403).send({
            success: false,
            error: `Not Appman's account. Session terminate.`
        })
    } 
    return res.redirect('/login')
}