export const displayMap = (locations) => {

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FjaGluY2hvZHUwMDEiLCJhIjoiY2tiNzJtNXh6MDFydjJwcWx6cDlqbTgycyJ9.928MHTd_sfPmxMzAybLeuw';
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
        //  loc.day and loc.description has came from locations array 
        new mapboxgl.Popup().setLngLat(loc.coordinates).setHTML(`<p> Day${loc.day} : ${loc.description}</p>`).addTo(map)

        //  extends map bounds to include current location
        bounds.extend(loc.coordinates)
    });
    //  it zoom to the map to actual fit the markers
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 200,
            right: 200,
            left: 200
        }
    })
}

