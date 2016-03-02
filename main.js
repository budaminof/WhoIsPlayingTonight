// $(document).ready( function () {
  // console.log('we are on');

//setting today's date, in global scope.

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();

  if (dd < 10) dd = '0'+dd;
  if (mm < 10) mm = '0'+mm;

  today = yyyy+'-'+mm+'-'+dd;
  todayH1 = dd+'.'+mm+'.'+yyyy;
  $('h1').append('<small>'+todayH1+'</small>');

//map declaration.


  var map;
  var myLat;
  var myLng;
  function initMap() {

    var directionsService = new google.maps.DirectionsService;

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADS //SATELLITE ROADS TERRAIN HYBRID
    })

    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    directionsDisplay.setMap(map);

    // check for Geolocation support
    if (navigator.geolocation) console.log('Geolocation is supported!');
    else alert('Geolocation is not supported for this Browser/OS version yet.');


    window.onload = function() {
      var startPosition;
      var geoSuccess = function(position) {
        startPosition = position;
        myLat = startPosition.coords.latitude;
        myLng = startPosition.coords.longitude;
        map.setCenter({lat: myLat, lng: myLng});
        var startingMarker = new google.maps.Marker({
          position: {lat: myLat, lng: myLng},
          map: map,
          // label: "*",
          icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7
            },
          animation: google.maps.Animation.DROP
        });

        startingMarker.setMap(map);
        var infoWindow = new google.maps.InfoWindow();

        startingMarker.addListener('click', function() {
          infoWindow.setContent("you are here");
          infoWindow.open(map, this)
        })

      };
      navigator.geolocation.getCurrentPosition(geoSuccess);
    };


  }

////markers on map

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
  event.preventDefault();

  clearMarkers();
  $('body').css('background', 'none');
  $('aside').css({'align-items': 'flex-start','justify-content': 'flex-start', 'padding-left': '1.5%'});
  $('input, button').css({'font-size': '100%', 'padding': '0', 'width': '10%', 'margin-left': '2%'}); /// change to add class
  $('#map').show();
  $('#travel').show();
  google.maps.event.trigger(map, 'resize');
  $('#table').empty();

  var city = ($('input[name="city"]')).val();
  var state = ($('input[name="state"]')).val();
  var miles = ($('input[name="radius"]')).val();

  addToLocalStorage();

    function addMarker(location,label) {
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        label: label,
        animation: google.maps.Animation.DROP
      });
      var infoWindow = new google.maps.InfoWindow()

      marker.addListener('click', function() {
        var desLat = this.position.lat();
        var desLng = this.position.lng();
        var contentString = label + '<br/><a href="https://www.google.com/maps/dir/' + myLat + ',' + myLng + '/'+ desLat +','+ desLng +'" target="_blank">directions</a>';
        infoWindow.setContent(contentString);
        infoWindow.open(map, this);
      })
      markers.push(marker);
    }

    $.ajax({
      url: 'https://api.bandsintown.com/events/search.json?api_version=2.0&app_id=CoolApp&location='+ city +','+ state +'&radius='+ miles +'&date='+ today,
      type: 'GET',
      dataType: 'jsonp',
      success: function(res) {

        for (var i = 0; i < res.length; i++) {
          var musician = res[i].artists[0].name;
          var venue = res[i].venue.name;
          var url = res[i].venue.url;
          var venueLat = res[i].venue.latitude;
          var venueLng = res[i].venue.longitude;
          map.setCenter({lat: myLat, lng: myLng});
          $('#table').append('<tr><td>'+ musician +'</td><td>'+ venue + '</td><td><a href='+ url +' target="_blank">Tickets</a></td></tr>');
          addMarker({lat: venueLat, lng: venueLng}, venue);
        }

      }

  });

  // function calcRoute(desLat, desLng) {
  //   console.log(myLat + ","+ myLng + "to "+ desLat + ", " +desLng);
  // }

  function addToLocalStorage(){
    dataCity = JSON.stringify(city);
    dataState = JSON.stringify(state);
    window.localStorage.cityData = dataCity + dataState;
    window.localStorage.stateData = dataState;
  }


});


// function getDataFromLocalStorage(){
//   if (window.localStorage.cityData && window.localStorage.stateData) {
//     city = JSON.parse(window.localStorage.cityData);
//     state = JSON.parse(window.localStorage.stateData);
//   }
// }


// }); // document ready end.


    //
    // google.maps.event.addListener('click', function () {
      // function calcRoute() {
      //   var start = startPosition; //geolocation
      //   console.log(start);
      //   var end = marker.getPosition(); // button clicked
      //   var request = {
      //     origin:start,
      //     destination:end,
      //     travelMode: google.maps.TravelMode[selectedMode]
      //   };
      //   directionsService.route(request, function(result, status) {
      //     if (status == google.maps.DirectionsStatus.OK) {
      //       directionsDisplay.setDirections(result);
      //     }
      //   });
      // }
    //
    // })
