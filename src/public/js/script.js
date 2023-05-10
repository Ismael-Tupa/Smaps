let map = L.map('map').setView([-32.896524, -68.837680], 10);

//Agregar tilelAyer mapa base desde openstreetmap
var mymap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
mymap.addTo(map);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googlemap = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var baseMaps = {
    "Openstreetmap": mymap,
    "Satellite": googleSat,
    "map": googlemap
};


var layerControl = L.control.layers(baseMaps).addTo(map);

geo();
async function geo() {
    let datos = await axios.get('https://axiosqwertyuiop.herokuapp.com/mar/');

    var markers = datos.data;
    for (i = 0; i < markers.length; i++) {
        infoD(i, markers[i].latitud, markers[i].longitud);
    }
    markerV(markers);
    //encontramos elementos repetidos
    const busqueda = markers.reduce((acc, marke) => {
        acc[marke.fecha] = ++acc[marke.fecha] || 0;
        return acc;
    }, {});
    //Esto me de vuelve un obj con solo con sus atributos
    let claves = Object.keys(busqueda);
    localStorage.setItem("fechas", JSON.stringify(claves));
    var menu = "";

    for (i = claves.length - 1; i >= 0; i--) {
        menu += "<li class='nav-item'><label class='nav-link'><input type='button' id='fecha' value='" + claves[i] + "' onClick='rMenu(this.value)'>" + claves[i] + "</label></li>";
    }

    document.getElementById("menu").innerHTML = menu;

}
var marcadores = new Array();
function markerV(v) {

    console.log(marcadores)
    for (i = 0; i < marcadores.length; i++) {
        map.removeLayer(marcadores[i]);
    }
    marcadores = [];
    console.log(marcadores)
    var Icon_azul = new L.Icon({
        iconUrl: '/img/alfiler_azul.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25]
    });
    var Icon_rojo = new L.Icon({
        iconUrl: '/img/alfiler_rojo.png',
        iconSize: [25, 25],
        iconAnchor: [8, 25]
    });
    var Icon_verde = new L.Icon({
        iconUrl: '/img/alfiler_verde.png',
        iconSize: [25, 25],
        iconAnchor: [10, 25]
    });

    for (i = 0; i < v.length; i++) {
        if (v[i].movimiento == "inicio") {
            var LamMarker = new L.marker([v[i].latitud, v[i].longitud], { icon: Icon_azul })
                .bindPopup(v[i].username + "</br>" + v[i].fecha + "</br>" + v[i].hora);
            marcadores.push(LamMarker);
            map.addLayer(LamMarker);
        } else if (v[i].movimiento == "fin") {
            var LamMarker = new L.marker([v[i].latitud, v[i].longitud], { icon: Icon_rojo })
                .bindPopup(v[i].username + "</br>" + v[i].fecha + "</br>" + v[i].hora);
            marcadores.push(LamMarker);
            map.addLayer(LamMarker);
        } else if (v[i].movimiento == "rondin") {
            var LamMarker = new L.marker([v[i].latitud, v[i].longitud], { icon: Icon_verde })
                .bindPopup(v[i].username + "</br>" + v[i].fecha + "</br>" + v[i].hora);
            marcadores.push(LamMarker);
            map.addLayer(LamMarker);
        }
    }
    console.log("set", v);
    map.fitBounds([
        ...v.map(point => [point.latitud, point.longitud])
    ]);
    localStorage.setItem("backL", JSON.stringify(v));

}
async function rMenu(a) {

    let datosx = await axios.get('https://axiosqwertyuiop.herokuapp.com/mar/' + a);
    var markers = datosx.data;

    markerV(markers);

}
async function infoD(i, lat, lon) {

    var requestOptions = { method: 'GET' };

    fetch("https://api.geoapify.com/v1/geocode/reverse?lat=" + lat + "&lon=" + lon + "&apiKey=47d920dc1fc540b9a96b6f7d5e959c61", requestOptions)
        .then(response => response.json())
        .then(result => {
            localStorage.setItem(("dato" + i), JSON.stringify(result.features[0].properties.formatted));
        })
        .catch(error => console.log('error', error));
}

