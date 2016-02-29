// $(document).ready( function () {
  console.log('we are on');

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();

  if (dd < 10) dd = '0'+dd;
  if (mm < 10) mm = '0'+mm;

  today = yyyy+'-'+mm+'-'+dd;
  todayH1 = dd+'.'+mm+'.'+yyyy;
  $('h1').append('<small>'+todayH1+'</small>');

  $('#location').on('click', function (){
    $('#main').empty();

    var city = ($('input[name="city"]')).val();
    var state = ($('input[name="state"]')).val();
    var miles = ($('input[name="radius"]')).val();

//getting api information

    $.ajax({
      url: 'https://api.bandsintown.com/events/search.json?api_version=2.0&app_id=CoolApp&location='+city+','+state+'&radius='+miles+'&date='+today,
      type: 'GET',
      dataType: 'jsonp',
      success: function(res) {
        console.log(res);
        console.log(res.length);
        for (var i = 0; i < res.length; i++) {
          var musician = res[i].artists[0].name;
          var venue = res[i].venue.name;
          var url = res[i].venue.url;
          $('#main').append('<tr><td>'+ musician +'</td><td>'+ venue + '</td><td><a href='+ url +' target="_blank">Tickets</a></td></tr>');
        }
      }

    });
  });

///google map
//
// function initMap() {
//   var mapDiv = document.getElementById('map');
//   var map = new google.maps.Map(mapDiv, {
//     center: {lat: 44.540, lng: -78.546},
//     zoom: 8
//   });
// }

// function initMap() {
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},
//     scrollwheel: false,
//     zoom: 8
//   });
// }


// }); // document ready end.

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


// function initMap() {
//   var map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},
//     scrollwheel: false,
//     zoom: 8
//   });
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
