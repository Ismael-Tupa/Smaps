const menuCtrl = {};

menuCtrl.renderEmpleado = (req,res)=>{
    res.render('menu/empleado', {userMar: req.user[0].username });
}
menuCtrl.renderMarcador = (req,res)=>{
    console.log(req.user[0].username)
    res.render('menu/marcador', {userMar: req.user[0].username });
}
menuCtrl.renderReporte = (req,res)=>{
    res.render('menu/reporte', {userMar: req.user[0].username });
}
menuCtrl.renderZona = (req,res)=>{
    res.render('menu/zona', {userMar: req.user[0].username });
}

module.exports = menuCtrl;