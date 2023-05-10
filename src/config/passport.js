const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const conn = require('../database');
passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'pass'
}, (user, pass, done) => {
    const sql = 'SELECT * FROM users WHERE username=?';
    conn.query(sql, [user], (err, rows) => {
        if (err) return console.log(err);
        
        const usuario = rows[0];
        
        if (usuario == undefined) {
            return done(null, false, { message: 'usuario incorrecto' });
        } else {
            const sql = 'SELECT * from users WHERE (username = ?) AND (password = ?)';
            conn.query(sql, [user, pass], (err, rows) => {
                if (err) return console.log(err);
                const password = rows[0];

                if (password != undefined) {
                    return done(null, usuario);
                } else {
                    return done(null, false, { message: 'contraseña incorrecta' });
                }
            });

        }
    });


}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});
passport.deserializeUser((id, done) => {
    const sql = 'SELECT * FROM users WHERE id=?';
    conn.query(sql, [id], (err, rows) => {
        done(err, rows);
    })
});