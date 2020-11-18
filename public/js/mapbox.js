console.log('hello mapbox');
//  here we want to access the locations array from tour
// so will store all the location in tour.pug file in #map
// then we will use it here

const locations = JSON.parse(document.getElementById('map').dataset.locations)
console.log(locations);