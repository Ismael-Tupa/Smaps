info();
async function info() {

    let datos = await axios.get('https://api-monitoreo-rkl7.onrender.com/mar/');
    var infos = datos.data;
    let datos1 = await axios.get('https://api-monitoreo-rkl7.onrender.com/api/');
    var users = datos1.data;
    console.log(users)
    
    var tabla = "<table id='example' class='table table-bordered table-hover' style='width:100%'><thead class='table-info'><tr><td colspan='7'>Reporte hasta el "+fecha()+"</td></tr><tr><th>Usuario</th><th>Nombre</th><th>Apellido</th><th>Cuit</th><th>Movimiento</th><th>Fecha</th><th>Direccion</th></tr></thead><tbody>";
    var resul = "";
    for (i = 0; i < infos.length; i++) {
        for(y=0; y<users.length;y++){
            if(infos[i].username == users[y].username){
                resul = users[y];
            }
        }
        tabla += "<tr><td>" + infos[i].username + "</td><td>" + resul.nombre + "</td><td>" + resul.apellido + "</td><td>" + resul.cuit + "</td><td>" + infos[i].movimiento + "</td><td>" + infos[i].fecha+" : "+ infos[i].hora + "</td><td>" + JSON.parse(localStorage.getItem("dato" + i)) + "</td></tr>";
    }
    tabla = tabla + "</tbody></table>";

    document.getElementById("tablaR").innerHTML = tabla;
    datatable();
}

function datatable(){
    $(document).ready(function() {
        $('#example').DataTable( {
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
            },
            dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="bx bxs-download"></i>&nbsp;&nbsp;Descarga',
                    titleAttr: 'Exportar a excel',
                    className: 'btn btn-secondary'
                }
            ]
        } );
    } );
}

//odtine la fecha de hoy
function fecha(){
    var res = "";
    var f = new Date();
    console.log(f)
    var dd = ("0"+f.getDate()).slice(-2);
    var mm = ("0"+(f.getMonth()+1)).slice(-2);
    var yy = f.getFullYear();
    var hh = f.toLocaleTimeString();
    
    res = yy +"-"+mm+"-"+dd+":"+hh;
    return res;
}