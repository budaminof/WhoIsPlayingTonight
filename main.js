(function(){
    // expose initMap to global for googleMap's callback
    initMap = initMapFn;

    //variable declaration.
    var map, myLat, myLng, desLat, desLng, directionsDisplay, directionsService, musician;

    //setting today's date
    var today = new Date().toISOString().slice(0, 10).split('-'),
        year = today[0],
        month = today[1],
        day = today[2],
        apiToday = today.join('-');

    $('h1').append('<h2 class="date">' + [month, day, year].join('.') + '</h2>');

    function initMapFn() {
        // clear directions div
        $('#directions').empty();

        // initialize and clear map
        directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap();

        directionsService = new google.maps.DirectionsService;

        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADS,
            zoom: 14
        })
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directions'));

        window.onload = function() {
            var startPosition;
            var geoSuccess = function(position) {
                startPosition = position;
                myLat = startPosition.coords.latitude;
                myLng = startPosition.coords.longitude;
                var startingMarker = new google.maps.Marker({
                    position: {
                        lat: myLat,
                        lng: myLng
                    },
                    map: map,
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


    //myFrom menu
    $('.fa-reorder').on('click', function() {
        $('.myForm').slideToggle('slow');
    })

    //searching for events.
    $('#locationSearchForm').on('submit', function(event) {
        event.preventDefault();

        // reinitialize map
        initMapFn();
        var city = $('input[name="city"]').val();
        var state = $('input[name="state"]').val();
        var miles = $('input[name="radius"]').val();
        var filterCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

        if (!filterCity.test(city)) {
            $('input[name="city"]').addClass('danger');
            return false;
        }

        if ($('input[name="state"]').val() == "") {
            $('input[name="state"]').addClass('danger');
            return false;
        }

        $('#mainAppend').hide();
        $('body').css('background', 'none');
        $('.myForm').css({'margin': '10px 0 0 0'});
        $('input, button').addClass('happening');
        $('.fa-reorder').show();
        $('#map').show();
        $('aside').show();
        google.maps.event.trigger(map, 'resize');
        $('#table').empty();
        $('.myForm').hide();
        $('i').addClass('burgerTime');
        $('main').addClass('after');
        $('#table').removeClass('error');
        $('input').removeClass('danger');
        $('#directions').hide();

        ///google map markers
        function addMarker(location, label) {
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
                var contentString = label + '<br/><a href="https://www.google.com/maps/dir/' + myLat + ',' + myLng + '/' + desLat + ',' + desLng + '" target="_blank">directions</a>';
                infoWindow.setContent(contentString);
                infoWindow.open(map, this);
                calcRoute(desLat, desLng);
                $('#directions').show();
            })
        }

        $.ajax({
            url: 'https://api.bandsintown.com/events/search.json?api_version=2.0&app_id=CoolApp&location=' + city + ',' + state + '&radius=' + miles + '&date=' + apiToday,
            type: 'GET',
            dataType: 'jsonp',
            success: function(res) {
                for (var i = 0; i < res.length; i++) {
                    musician = res[i].artists[0].name;
                    var venue = res[i].venue.name;
                    var url = res[i].venue.url;
                    var venueLat = res[i].venue.latitude;
                    var venueLng = res[i].venue.longitude;
                    map.setCenter({
                        lat: myLat,
                        lng: myLng
                    });
                    $('#table').append('<tr><td><h3>' + musician + '</h3></td><td>' + venue + '</td><td><a href=' + url + ' target="_blank">Tickets</a></td></tr>');
                    addMarker({
                        lat: venueLat,
                        lng: venueLng
                    }, venue);

                }

                if ($('#table').children().length == 0) {
                    $('#table').append('<h1>What did you do to my program?!</h1>');
                    $('#table').addClass('error');
                }
            }

        });

        $(document).on('click', 'tr', function() {
            var yourShowArr = [];
            yourShowArr.push($(this)[0].innerHTML);
            localStorage.setItem('history', yourShowArr);
            console.log($(this));

        });
    });

    function calcRoute(desLat, desLng) {
        console.log(desLat, desLng);
        start = new google.maps.LatLng(myLat, myLng);
        end = new google.maps.LatLng(desLat, desLng);

        directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.BICYCLING
        }, function(response, status) {
            console.log(status);
            console.log(response);
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

    }


    var myHtmlFromLocalStorage = localStorage.getItem('history');
    $('#mainAppend').append(myHtmlFromLocalStorage);
})();
