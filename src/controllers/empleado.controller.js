const empleadoCtrl = {};
const conn = require('../database');

empleadoCtrl.empleados = (req,res)=>{
    res.send('employee');
    /*const sql = "SELECT * from users";
    conn.query(sql, (err, rows) => {
        if (err) throw err
        const person = rows;
        res.render('employee/empleados', {user});  
    })*/
    
}
empleadoCtrl.renderFromCreate = (req,res)=>{
    res.send('form');
}
empleadoCtrl.createEmpleado = (req,res)=>{
    res.send('new');
}
empleadoCtrl.renderFromUpdate = (req,res)=>{
    res.send('edit');
}
empleadoCtrl.updateEmpleados = (req,res)=>{
    res.send('update');
}
empleadoCtrl.bajaEmpleado = (req,res)=>{
    res.send('delet');
}

module.exports = empleadoCtrl;