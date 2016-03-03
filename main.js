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

  function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADS //SATELLITE ROADS TERRAIN HYBRID
  })

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

  //navigation menu
$('.fa-reorder').on('click', function () {
    $('navigation').slideToggle('slow');
  })

//searching for events.

$('#location').on('click', function (){
  // event.preventDefault();
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

//add validation for search inputs.
//or add location using geolocation.


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

///local storage

  $(document).on('click','tr', function () {
    var yourShowArr= [];
    yourShowArr.push($(this)[0].innerHTML);
    // window.localStorage.history = yourShowArr; //the JS way.
    localStorage.setItem('history', yourShowArr); // the Jquery way.
  });

});

var myHtmlFromLocalStorage = localStorage.getItem('history'); //the Jquery way.
// var myHtmlFromLocalStorage = window.localStorage.history; // the JS way.

$("#mainAppend").append(myHtmlFromLocalStorage);
