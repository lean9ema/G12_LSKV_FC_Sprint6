const db = require('../database/models');

module.exports = (req,res,next) => {
    db.Users.findAll()
     .then(resU => {
        let  user = resU
        let logged = null;

    if(req.cookie && req.cookie.email){
        logged = user.call().find(user => user.email === req.cookie.email)
        req.session.a = logged
    }

    if(req.session && req.session.a) {
        logged = req.session.a
    }

    res.locals.user = logged
    console.log("usuario logeado",res.locals.user)

    return next()
        
    })
}