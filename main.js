// $(document).ready( function () {
  // console.log('we are on');

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

  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      // center: {lat: 40.018228, lng: -105.2864265},
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADS //SATELLITE ROADS TERRAIN HYBRID
    })
  }

  var markers = [];

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function clearMarkers() {
    setMapOnAll(null);
  }

//searching for events.

$('#location').on('click', function (){

  clearMarkers();
  $('body').css('background', 'none');
  $('aside').css({'align-items': 'flex-start','justify-content': 'flex-start', 'padding-left': '1.5%'});
  $('input, button').css({'font-size': '100%', 'padding': '0', 'width': '10%'});
  $('#map').show();
  google.maps.event.trigger(map, 'resize');
  $('#table').empty();

  var city = ($('input[name="city"]')).val();
  var state = ($('input[name="state"]')).val();
  var miles = ($('input[name="radius"]')).val();


    function addMarker(location,label) {
      var marker =new google.maps.Marker({
        position: location,
        map: map,
        label: label
      });
      var infoWindow = new google.maps.InfoWindow()

      marker.addListener('click', function() {
        infoWindow.setContent(this.label);
        infoWindow.open(map, this)
      })
      markers.push(marker);
    }

    console.log("foo");
    $.ajax({
      url: 'https://api.bandsintown.com/events/search.json?api_version=2.0&app_id=CoolApp&location='+ city +','+ state +'&radius='+ miles +'&date='+ today,
      type: 'GET',
      dataType: 'jsonp',
      success: function(res) {

        for (var i = 0; i < res.length; i++) {
          // arr = []
          var musician = res[i].artists[0].name;
          var venue = res[i].venue.name;
          var url = res[i].venue.url;
          var venueLat = res[i].venue.latitude;
          var venueLng = res[i].venue.longitude;
          map.setCenter({lat: venueLat, lng: venueLng})
          $('#table').append('<tr><td>'+ musician +'</td><td>'+ venue + '</td><td><a href='+ url +' target="_blank">Tickets</a></td></tr>');
          // arr.push(venue, venueLat, venueLng);
          // markers.push(arr);
          addMarker({lat: venueLat, lng: venueLng}, venue);
        }

      }
    });

});

// }); // document ready end.
