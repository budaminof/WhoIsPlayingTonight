// $(document).ready( function () {
  console.log('we are on');

//setting today's date.
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
    $('#table').empty();
    // setMapOnAll(null);

    var city = ($('input[name="city"]')).val();
    var state = ($('input[name="state"]')).val();
    var miles = ($('input[name="radius"]')).val();

//getting api information

    $.ajax({
      url: 'https://api.bandsintown.com/events/search.json?api_version=2.0&app_id=CoolApp&location='+city+','+state+'&radius='+miles+'&date='+today,
      type: 'GET',
      dataType: 'jsonp',
      success: function(res) {
        markers = [];

        for (var i = 0; i < res.length; i++) {
          arr = []
          var musician = res[i].artists[0].name;
          var venue = res[i].venue.name;
          var url = res[i].venue.url;
          var venueLat = res[i].venue.latitude;
          var venueLng = res[i].venue.longitude;
          $('#table').append('<tr><td>'+ musician +'</td><td>'+ venue + '</td><td><a href='+ url +' target="_blank">Tickets</a></td></tr>');
          arr.push(venue, venueLat, venueLng);
          markers.push(arr);
        }

        // function setMapOnAll(map) {
        //
        //   for (var i = 0; i < markers.length; i++) {
        //
        //     var position = {lat: markers[i][1], lng: markers[i][2]};
        //
        //     marker = new google.maps.Marker({
        //       position: position,
        //       map: map,
        //       title: markers[i][0]
        //     })
        //   }
        // }

      }
    });
  });

// }); // document ready end.

///google map

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.018228, lng: -105.2864265},
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADS //SATELLITE ROADS TERRAIN HYBRID
  })
}



// // 2. Adding an infoWindow to the marker
// var infoWindow = new google.maps.InfoWindow()
//
// marker.addListener('click', function() {
//   infoWindow.setContent(this.title);
//   infoWindow.open(map, this)
// })

  // var content = "<h1>I'm Content!</h1>"
  //
  // marker.addListener('click', function() {
  //   infoWindow.setContent(content);
  //   infoWindow.open(map, this)
  // })
