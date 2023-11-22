
empleadosT();
async function empleadosT() {
    let datos = await axios.get('https://api-monitoreo-rkl7.onrender.com/api');
    var empleados = datos.data;
    console.log(empleados)

    var tablaE = "<table id='table_id' class='table table-bordered table-hover mt-4' style='width:100%'><thead class='bg-primary text-white'><tr><th>Usuario</th><th>Nombre</th><th>Apellido</th><th>Cuit</th><th>Action</th></tr></thead><tbody>";

    for (i = 0; i < empleados.length; i++) {
        tablaE += "<tr><td>" +empleados[i].username+ "</td><td>" + empleados[i].nombre + "</td><td>" + empleados[i].apellido + "</td><td>" + empleados[i].cuit + "</td><td><div class='text-center'><button class='btn btn-primary btnEdit' type='button' value='"+ empleados[i].id+"' onClick='editar(value)'><i class='bx bx-edit-alt'></i></button><button class='btn btn-danger btnDelete' type='button' value='"+ empleados[i].id+"' onClick='eliminar(value)'><i class='bx bxs-trash'></i></button></div></td></tr>";
    }
    tablaE = tablaE + "</tbody></table>";
    
    document.getElementById("empleadoss").innerHTML = tablaE;
    Dtable();
}
function Dtable() {
    $(document).ready(function () {
        $('#table_id').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
            },
            responsive: "true",
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
        });
    });
}
//ventana emergente de nuevo empleado
const open = document.getElementById("add");
const modalx_conteiner = document.getElementById("modalx-conteiner");
const agregar = document.getElementById("agregar");
const close = document.getElementById("close");

open.addEventListener('click', () => {
    modalx_conteiner.classList.add('show');
});    
close.addEventListener('click', () => {
    modalx_conteiner.classList.remove('show');
});
agregar.addEventListener('click', async () => {
    modalx_conteiner.classList.remove('show');
    var user = document.getElementById("login-name").value;
    var nombre = document.getElementById("login-nombre").value;
    var apellido = document.getElementById("login-apellido").value;
    var cuit = document.getElementById("login-cuit").value;
    var pass = document.getElementById("login-pass").value;
    console.log(user, nombre, apellido, cuit, pass);

    let dato = await axios.post('https://api-monitoreo-rkl7.onrender.com/api', {
        username: user,
        nombre: nombre,
        apellido: apellido,
        password: pass,
        cuit: cuit,
        fec_alta: fecha()
       
    })
    console.log(dato.data)
    empleadosT();
});
//esta es la parte de editar empleado
const modalx_conteiner2 = document.getElementById("modalx-conteiner2");
const close2 = document.getElementById("close2");
var indice = "";
async function editar(a){
    let dato = await axios.get('https://api-monitoreo-rkl7.onrender.com/api/');
    var empleado = dato.data;
    document.getElementById("login-namex").value = empleado[a-1].username;
    document.getElementById("login-nombrex").value = empleado[a-1].nombre;
    document.getElementById("login-apellidox").value = empleado[a-1].apellido;
    document.getElementById("login-cuitx").value = empleado[a-1].cuit;
    document.getElementById("login-passx").value = empleado[a-1].password;

    modalx_conteiner2.classList.add("show");
    console.log("hola",a-1,empleado)
    indice = a;
}

async function nexteditar(){ 
    
    var a = indice;
    console.log("hola1",a)
    var user = document.getElementById("login-namex").value;
    var nombre = document.getElementById("login-nombrex").value;
    var apellido = document.getElementById("login-apellidox").value;
    var cuit = document.getElementById("login-cuitx").value;
    var pass = document.getElementById("login-passx").value;
    console.log(user, nombre, apellido, cuit, pass);

    let dato = await axios.post('https://api-monitoreo-rkl7.onrender.com/api/'+a, {
        username: user,
        nombre: nombre,
        apellido: apellido,
        password: pass,
        cuit: cuit,
        fec_modi: fecha()
       
    })
    console.log(dato.data)
    empleadosT();
    console.log("hola2",a)
    modalx_conteiner2.classList.remove('show');
}
close2.addEventListener('click', () => {
    modalx_conteiner2.classList.remove('show');
});

//eliminamos empleado
async function eliminar(a){
    console.log(a)
    if(confirm("¿Esta seguro?")){
        let dato = await axios.delete('https://api-monitoreo-rkl7.onrender.com/api/'+a);
        console.log(dato.data)
        empleadosT();
    }
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
    
    res = yy +"-"+mm+"-"+dd;
    return res;
}