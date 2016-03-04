console.log('we are on');
//setting today's date

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
  var desLat;
  var desLng;
  var directionsDisplay;
  var directionsService;

  function initMap() {
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADS //SATELLITE ROADS TERRAIN HYBRID
  })
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions'));

    // check for Geolocation support

    if (navigator.geolocation) console.log('Geolocation is supported!');
    else alert('Geolocation is not supported for this Browser/OS version yet.');

    window.onload = function() {
      var startPosition;
      var geoSuccess = function(position) {
        startPosition = position;
        myLat = startPosition.coords.latitude;
        myLng = startPosition.coords.longitude;
        var startingMarker = new google.maps.Marker({
          position: {lat: myLat, lng: myLng},
          map: map,
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

//navigation menu

$('.fa-reorder').on('click', function () {
    $('navigation').slideToggle('slow');
  })

//searching for events.

$('#location').on('click', function (){

  var city = $('input[name="city"]').val();
  var state = $('input[name="state"]').val();
  var miles = $('input[name="radius"]').val();

  var filterCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
  if(!filterCity.test(city)){
    $('input[name="city"]').css({'background-color': 'rgb(246, 54, 54)'});
    return false;
  }

  if($('input[name="state"]').val() == "") {
    $('input[name="state"]').css({'background-color': 'rgb(246, 54, 54)'});
    return false;
  }

  clearMarkers();
  $('#mainAppend').hide();
  $('body').css('background', 'none');
  $('nav').css({'align-items': 'flex-start','justify-content': 'flex-start', 'padding-left': '1.5%', 'margin-top': '1%'});
  $('input, button').addClass('happening');
  $('.fa-reorder').show();
  $('#map').show();
  $('aside').show();
  google.maps.event.trigger(map, 'resize');
  $('#table').empty();
  $('navigation').hide();
  $('i').addClass('burgerTime');
  $('main').addClass('after');
  $('#table').removeClass('error');



///google map markers
    function addMarker(location,label) {

      var marker = new google.maps.Marker({
        position: location,
        map: map,
        label: label,
        animation: google.maps.Animation.DROP
      });

      var infoWindow = new google.maps.InfoWindow()

      marker.addListener('click', function() {
        desLat = this.position.lat();
        desLng = this.position.lng();
        var contentString = label + '<br/><a href="https://www.google.com/maps/dir/' + myLat + ',' + myLng + '/'+ desLat +','+ desLng +'" target="_blank">directions</a>';
        infoWindow.setContent(contentString);
        infoWindow.open(map, this);
        calcRoute(desLat, desLng);
        $('#directions').show();
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
          $('#table').append('<tr><td><h3>'+ musician +'</h3></td><td>'+ venue + '</td><td class="tickets"><a href='+ url +' target="_blank">Tickets</a></td></tr>');
          addMarker({lat: venueLat, lng: venueLng}, venue);

        }

        if($('#table').children().length == 0) {
          $('#table').append('<h1>What did you do to my program?!</h1>');
          $('#table').addClass('error');
        }
      }

  });

///local storage

  $(document).on('click','tr', function () {
    var yourShowArr= [];
    yourShowArr.push($(this)[0].innerHTML);
    localStorage.setItem('history', yourShowArr);
  });

///error if search done bad.

});

function calcRoute(desLat, desLng) {

  start = new google.maps.LatLng(myLat, myLng);
  end = new google.maps.LatLng(desLat, desLng);

  directionsService.route({
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.BICYCLING
      }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

}

var myHtmlFromLocalStorage = localStorage.getItem('history');
$('#mainAppend').append(myHtmlFromLocalStorage);
