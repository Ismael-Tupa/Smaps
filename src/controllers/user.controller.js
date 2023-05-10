const passport = require("passport");

const userCtrl = {};

userCtrl.renderSignupForm = (req,res)=>{
    res.render('user/signup');
}
userCtrl.signup = (req,res)=>{
    res.send('signup'); 
}
userCtrl.renderSigninForm = (req,res)=>{
    res.render('user/login');
}
userCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/user/signin',
    successRedirect: '/marcador',
    failureFlash: true 
});

userCtrl.logout = async (req, res, next) => {
    await req.logout((err) => {
      if (err) return next(err);
      req.flash("success_msg", "Session cerrada");
      res.redirect("/user/signin");
    });
  };
module.exports = userCtrl;