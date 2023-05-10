//control de la ventana emergente
const open = document.getElementById("addDireccion");
const element = document.getElementById("element");
const element1 = document.getElementById("element1");
//const agregar = document.getElementById("agregar");
const close = document.getElementById("close");

open.addEventListener('click', () => {
    const element2 = document.getElementById("element2");
    element1.setAttribute("class", "saw");

    element1.style.display = "inline";
    element.style.display = "none";
    element2.style.display = "none";

});
close.addEventListener('click', () => {
    element.style.display = "inline";
    element1.style.display = "none";
});

/* 
    The addressAutocomplete takes a container element (div) as a paramete
    el busacador de direcciones 
*/

function addressAutocomplete(containerElement, callback) {
    // create input element
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "Address");
    inputElement.setAttribute("class", "form-control");
    containerElement.appendChild(inputElement);

    /* Active request promise reject function. To be able to cancel the promise when a new request comes */
    var currentPromiseReject;
    var currentItems;

    // add input field clear button
    var clearButton = document.createElement("div");
    clearButton.classList.add("clear-button");
    addIcon(clearButton);
    clearButton.addEventListener("click", (e) => {
        e.stopPropagation();
        inputElement.value = '';
        callback(null);
        clearButton.classList.remove("visible");
        closeDropDownList();
    });
    inputElement.parentNode.appendChild(clearButton);

    /* Execute a function when someone writes in the text field: */
    inputElement.addEventListener("input", function (e) {
        closeDropDownList();
        var currentValue = this.value;

        // Cancel previous request promise
        if (currentPromiseReject) {
            currentPromiseReject({
                canceled: true
            });
        }

        if (!currentValue) {
            clearButton.classList.remove("visible");
            return false;
        }
        // Show clearButton when there is a text
        clearButton.classList.add("visible");

        /* Create a new promise and send geocoding request */
        var promise = new Promise((resolve, reject) => {
            currentPromiseReject = reject;

            var apiKey = "47d920dc1fc540b9a96b6f7d5e959c61";
            var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;

            fetch(url)
                .then(response => {
                    // check if the call was successful
                    if (response.ok) {
                        response.json().then(data => resolve(data));
                    } else {
                        response.json().then(data => reject(data));
                    }
                });
        });

        promise.then((data) => {
            // we will process data here
            currentItems = data.features;

            /*create a DIV element that will contain the items (values):*/
            var autocompleteItemsElement = document.createElement("div");
            autocompleteItemsElement.setAttribute("class", "autocomplete-items");
            containerElement.appendChild(autocompleteItemsElement);

            /* For each item in the results */
            data.features.forEach((feature, index) => {
                /* Create a DIV element for each element: */
                var itemElement = document.createElement("DIV");
                /* Set formatted address as item value */
                itemElement.innerHTML = feature.properties.formatted;
                /* Set the value for the autocomplete text field and notify: */
                itemElement.addEventListener("click", function (e) {
                    inputElement.value = currentItems[index].properties.formatted;
                    callback(currentItems[index]);
                    /* Close the list of autocompleted values: */
                    closeDropDownList();
                });
                autocompleteItemsElement.appendChild(itemElement);
            });
        }, (err) => {
            if (!err.canceled) {
                console.log(err);
            }
        });
    });
    document.addEventListener("click", function (e) {
        if (e.target !== inputElement) {
            closeDropDownList();
        } else if (!containerElement.querySelector(".autocomplete-items")) {
            // open dropdown list again
            var event = document.createEvent('Event');
            event.initEvent('input', true, true);
            inputElement.dispatchEvent(event);
        }
    });

    function closeDropDownList() {
        var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
        if (autocompleteItemsElement) {
            containerElement.removeChild(autocompleteItemsElement);
        }
    }
    function addIcon(buttonElement) {
        var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgElement.setAttribute('viewBox', "0 0 24 24");
        svgElement.setAttribute('height', "24");

        var iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
        iconElement.setAttribute('fill', 'currentColor');
        svgElement.appendChild(iconElement);
        buttonElement.appendChild(svgElement);
    }
}
var nombreDireccion = ""
addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {

    //es para centrar el mapa en la direccions que se encontro
    if (data == null) {
        console.log("nada");
    } else {

        var latx = data.geometry.coordinates[1];
        var lngx = data.geometry.coordinates[0];
        map.fitBounds([
            [latx, lngx]
        ]);
        nombreDireccion = data.properties.address_line1;
        document.getElementById("name").value = nombreDireccion;
    }
    //fin del centrado
});
//fin del busacador 

var lat = -32.896524;
var lng = -68.837680;
let map = L.map('map').setView([lat, lng], 10);

googlemap = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

//para dibujar el poligamo
let clickMap = 0;
const points = [];
var poli;
let polilineas = [];
let punteroPoli = 0;

map.on('click', (e = { latlng: LatLng }) => {
    console.log("mouseup", e.latlng);
    points.push(e.latlng);
    clickMap += 1;
    if (clickMap === 1) {
        poli = L.polyline(points, {
            color: 'grey',
            weight: 2,
        });
        map.addLayer(poli);
        polilineas.push(poli);
        clickMap = 0;
        punteroPoli += 1;
    }

});

function atrasDibujo() {
    map.removeLayer(polilineas[polilineas.length - 1]);
    polilineas.pop();
    points.pop();
}
//fin de dibujo
async function guardarZona() {
    var name = document.getElementById("name").value;

    var objson = JSON.stringify(points);
    let res = await axios.post('https://axiosqwertyuiop.herokuapp.com/zon', {
        nombre: name,
        dimencion: objson
    });

    element.style.display = "inline";
    element1.style.display = "none";

}

