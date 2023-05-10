const mysql = require('mysql');

const {DB_HOSTX,DB_USERX,DB_PASSWORDX,DB_DATABASEX} = process.env;

const connection = mysql.createConnection({
    host: DB_HOSTX,
    user: DB_USERX,
    password: DB_PASSWORDX,
    database: DB_DATABASEX
});

connection.connect((err)=>{
    if(err){
        console.log('El error de conexion es: '+err);
        return;
    }
    console.log("¡Conexion exitosa!");
});
module.exports = connection;