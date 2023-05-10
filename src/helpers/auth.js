const helpers = {};

helpers.isAuthenticated = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Primero debe iniciar session');
    res.redirect('/user/signin');
}

module.exports = helpers;