const express = require('express');
const path = require('path');
const http = require('http');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

//iniciando el servidor
const app = express();
//settings
app.set('port', process.env.PORT || 1970);
app.set('views', path.join(__dirname, 'views'));
// config view engine
app.set("view engine", "ejs");
//middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//auntenticando si inicio session
const {isAuthenticated} = require('./helpers/auth');
//routes
app.use(require('./routes/user.routes'));
app.use(require('./routes/menu.routes'));

app.get('/',isAuthenticated, (req,res)=>{
    res.send('hola');
})
//static files
app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;