const user = require ('../model/jsonUsersDataBase');
module.exports = (req,res,next) => {

    let logged = null;

    if(req.cookie && req.cookie.email){
        logged = user.call().find(user => user.email === req.cookie.email)
        req.session.a = logged
    }

    if(req.session && req.session.a) {
        logged = req.session.a
    }

    res.locals.user = logged

    return next()
}