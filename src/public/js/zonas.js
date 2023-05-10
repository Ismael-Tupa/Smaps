var lat = -32.896524;
var lng = -68.837681;
let mymap = L.map('mymap').setView([lat, lng], 10);

googlemap = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(mymap);

var Vpoligons = [];
var table = "";
index();
async function index() {
    Vpoligons = [];
    let datos = await axios.get('https://axiosqwertyuiop.herokuapp.com/zon');
    let zona = datos.data;

    table = "<table id='tables' class='table table-hover table-borderless'><thead><tr><th>Zonas registradas:</th></tr></thead><tbody>";
    var autoComplete = "";
    for (let i = 0; i < zona.length; i++) {
        table += "<tr><td class='fw-semibold' onClick='vistapoligon(" + zona[i].id + ")'>" + zona[i].nombre + "</td><td><button class='btn btn-light rounded-circle' value='" + zona[i].id + "' onClick='editZona(value)'><i class='bx bx-edit-alt'></i></button><button class='btn btn-light rounded-circle' value='" + zona[i].id + "' onClick='deletZona(value)'><i class='bx bxs-trash'></i></button></td></tr>";
        var latlngs = JSON.parse(zona[i].dimencion);

        var polygon = L.polygon(latlngs, { color: 'red' }).bindPopup(zona[i].nombre).openPopup();

        mymap.addLayer(polygon);
        Vpoligons.push({ id: zona[i].id, poli: polygon, nombre: zona[i].nombre, dimencion: zona[i].dimencion });
        //es del autocomplete
        if (i == 0) {
            autoComplete = autoComplete + zona[i].nombre;
            continue;
        } else {
            autoComplete = autoComplete + ",";
        }
        autoComplete = autoComplete + zona[i].nombre;
    }
    table = table + "</tbody></table>";
    console.log(Vpoligons);
    var inputAuto = "<input class='awesomplete form-control me-2' type='search' id='buscard'  autocomplete='off' placeholder='buscar' data-list='" + autoComplete + "' aria-label='Search' data-minChars='2'>";
    document.getElementById("InputAuto").innerHTML = inputAuto;
    document.getElementById('tzona').innerHTML = table;
    translet(zona);
}
async function busquedas() {

    table = "";
    let datos = await axios.get('https://axiosqwertyuiop.herokuapp.com/zon');
    let zona = datos.data;
    table = table + "<table id='tables' class='table table-hover table-borderless'><thead><tr><th>Zonas registradas:</th></tr></thead><tbody>";
    var shears = document.getElementById('buscard').value;
    console.log(shears)
    const result = zona.filter(zon => {
        return zon.nombre.toLowerCase().indexOf(shears) > -1;
    });

    console.log(result);

    for (let i = 0; i < result.length; i++) {

        table = table + "<tr><td class='fw-semibold' onClick='vistapoligon(" + result[i].id + ")'>" + result[i].nombre + "</td><td><button class='btn btn-light rounded-circle' value='" + result[i].id + "' onClick='editZona(value)'><i class='bx bx-edit-alt'></i></button><button class='btn btn-light rounded-circle' value='" + result[i].id + "' onClick='deletZona(value)'><i class='bx bxs-trash'></i></button></td></tr>";

    }
    table = table + "</tbody></table>";

    document.getElementById('tzona').innerHTML = table;
}
function vistapoligon(a) {
    console.log(a)
    for (i = 0; i < Vpoligons.length; i++) {
        if (Vpoligons[i].id == a) {
            mymap.fitBounds(Vpoligons[i].poli.getBounds());
        }

    }
}
var zonaBK;
function translet(v) {
    zonaBK = v;

}

//edit 
let map2 = L.map('map2').setView([lat, lng], 10);

google = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map2);
const element2 = document.getElementById("element2");
const close1 = document.getElementById("close1");
var IndexVec;
var poliEdit;
function editZona(a) {
    const element = document.getElementById("element");
    const element1 = document.getElementById("element1");
    element2.setAttribute("class", "saw");

    element2.style.display = "inline";
    element.style.display = "none";
    element1.style.display = "none";
    console.log(a)

    for (let i = 0; i < Vpoligons.length; i++) {
        if (Vpoligons[i].id == a) {
            document.getElementById("nameE").value = Vpoligons[i].nombre;
            var latlgn = JSON.parse(Vpoligons[i].dimencion)
            var p = L.polygon(latlgn, { color: 'red' }).bindPopup(Vpoligons[i].nombre);
            map2.addLayer(p);
            map2.fitBounds(p.getBounds());
            poliEdit = p;
        }
    }
    IndexVec = a;
}

let clickMap2 = 0;
const points2 = [];
var poli2;
let polilineas2 = [];
let punteroPoli2 = 0;

function atrasDibujo2() {
    map2.removeLayer(polilineas2[polilineas2.length - 1]);
    polilineas2.pop();
    points.pop();
}
function resetMap() {
    for (let i = 0; i < Vpoligons.length; i++) {
        if (Vpoligons[i].id == IndexVec) {
            mymap.removeLayer(Vpoligons[i].poli);
            map2.removeLayer(poliEdit);
        }

    }
    map2.on('click', (e = { latlng: LatLng }) => {
        console.log("mouseup", e.latlng);
        points2.push(e.latlng);
        clickMap2 += 1;
        if (clickMap2 === 1) {
            poli2 = L.polyline(points2, {
                color: 'grey',
                weight: 2,
            });
            map2.addLayer(poli2);
            polilineas2.push(poli2);
            clickMap2 = 0;
            punteroPoli2 += 1;
        }

    });
}
async function guardaEdit() {
    var inputDato = document.getElementById("nameE").value;
    var objson = JSON.stringify(points2);

    if (objson == "[]") {
        for (let i = 0; i < Vpoligons.length; i++) {
            if (Vpoligons[i].id == IndexVec) {
                let res = await axios.post('https://axiosqwertyuiop.herokuapp.com/zon/' + IndexVec, {
                    nombre: inputDato,
                    dimencion: Vpoligons[i].dimencion
                });
            }
        }
    } else {
        let res = await axios.post('https://axiosqwertyuiop.herokuapp.com/zon/' + IndexVec, {
            nombre: inputDato,
            dimencion: objson
        });
    }
    const element = document.getElementById("element");

    element.style.display = "inline";
    element2.style.display = "none";
    index();
    for (let i = 0; i < Vpoligons.length; i++) {
        mymap.removeLayer(Vpoligons[i].poli)
    }
}

close1.addEventListener('click', () => {
    const element = document.getElementById("element");

    element.style.display = "inline";
    element2.style.display = "none";
});


async function deletZona(a) {
    console.log(a)
    let res = await axios.delete('https://axiosqwertyuiop.herokuapp.com/zon/' + a);
    index();
}

function exportReportToExcel() {
    var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById("tables");
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        // Specify file name
        filename = "Zonas.xls";

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob( blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
  }