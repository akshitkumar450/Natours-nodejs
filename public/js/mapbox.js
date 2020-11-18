console.log('hello mapbox');
//  here we want to access the locations array from tour
// so will store all the location in tour.pug file in #map
// then we will use it here

const locations = JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FjaGluY2hvZHUwMDEiLCJhIjoiY2tobnBscnR1MGVvMjJyazhuempwaWtuZCJ9.JeSoqNOInvDOs3bQUc79aQ';
var map = new mapboxgl.Map({
    container: 'map', // here we need an id where we can put our map  so we have #map in tour page so map will be shown there
    style: 'mapbox://styles/sachinchodu001/ckhnq0ynu13dw19lyvtm6i0a5',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 4,
    // interactive:false
});

//  automatic figre out locations of certain tour 
const bounds = new mapboxgl.LngLatBounds() // this will be the area which will be displayed on map

locations.forEach(loc => {
    //  create  a marker
    //  new HTML element
    const el = document.createElement('div')
    el.className = 'marker' // in css we have a class of marker
    //    add  a marker

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom' // bottom of the pin we located at exact location on map
    }).setLngLat(loc.coordinates).addTo(map)

    //  add a popup
    new mapboxgl.Popup().setLngLat(loc.coordinates).setHTML(`<p> Day${loc.day} : ${loc.description}</p>`).addTo(map)

    //  extends amao bounsd to include current location
    bounds.extend(loc.coordinates)
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 200,
        right: 200,
        left: 200
    }
})