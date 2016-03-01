
// var markers = [
//     ['foo', 40.018228, -105.2864265 ],
//     ['bar', 40.01, -105.29 ],
//     ['baz', 40.02, -105.275 ],
//     ['buzz', 40.025, -105.2864265 ],
// ];


// var map;
//
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: 40.018228, lng: -105.2864265},
//     zoom: 14,
//     mapTypeId: google.maps.MapTypeId.ROADS //SATELLITE ROADS TERRAIN
//   })
//
// }

//MAP TEST WITH MARKERS

var markers = [
    ['foo', 40.018228, -105.2864265 ],
    ['bar', 40.01, -105.29 ],
    ['baz', 40.02, -105.275 ],
    ['buzz', 40.025, -105.2864265 ],
];


var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.018228, lng: -105.2864265},
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.HYBRID //SATELLITE ROADS TERRAIN HYBRID
  })

// 1. Adding a basic marker to the map

  // var marker = new google.maps.Marker({
  // position: {lat: 40.018228, lng: -105.2864265},
  // map: map,
  // title: 'Hello World!'
  // });

// // 2. Adding an infoWindow to the marker

  var infoWindow = new google.maps.InfoWindow()
  //
  // var content = "<h1>I'm Content!</h1>"
  //
  // marker.addListener('click', function() {
  //   infoWindow.setContent(content);
  //   infoWindow.open(map, this)
  // })

// 3. Adding multiple markers to the map


  for (var i = 0; i < markers.length; i++) {

    var position = {lat: markers[i][1], lng: markers[i][2]}

    marker = new google.maps.Marker({
        position: position,
        map: map,
        title: markers[i][0]
    })

    marker.addListener('click', function() {
      infoWindow.setContent(this.title);
      infoWindow.open(map, this)
    })

  }
}


///// geolocation tutorial

navigator.geolocation.getCurrentPosition(success);

function success(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  var coords = new google.maps.LatLng(lat, long);

  var options = {
    zoom: 15,
    center: coords,
    mapTypeControl: false,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcontainer"), options);

  var marker = new google.maps.Marker({
    position: coords,
    map: map,
    title:"You are here!"
  });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  } else {
    error('Geo Location is not supported');
}
