$(document).ready( function () {
  console.log('we are on');

  var today = new Date();
  console.log(today);
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();

  if (dd < 10) dd = '0'+dd;
  if (mm < 10) mm = '0'+mm;

  today = yyyy+'-'+mm+'-'+dd;
  todayH1 = dd+'.'+mm+'.'+yyyy;
  console.log(today);

  $('h1').append('<small>'+todayH1+'</small>');

  $('#location').on('click', function (){
    $('#main').empty();
    ///setting today's date.

    var city = ($('input[name="city"]')).val();
    var state = ($('input[name="state"]')).val();
    var miles = ($('input[name="radius"]')).val();
    console.log(city);
    console.log(state);
    console.log(miles);

    $.ajax({
      url: 'https://api.bandsintown.com/events/search.json?api_version=2.0&app_id=CoolApp&location='+city+','+state+'&radius='+miles+'&date='+today,
      type: 'GET',
      dataType: 'jsonp',
      success: function(res) {
        console.log(res);
        console.log(res.length);
        for (var i = 0; i < res.length; i++) {
          // console.log(res[i]);
          var musician = res[i].artists[0].name;
          var venue = res[i].venue.name;
          var url = res[i].venue.url;
          // console.log(res[i].artists[0].name);
          // console.log(res[i].venue.name);
          // console.log(res[i].venue.url);
          $('#main').append('<tr><td>'+ musician +'</td><td>'+ venue + '</td><td><a href='+ url +' target="_blank"><button>Tickets</button></a></td></tr>');
        }
      }

    });
  });

});
