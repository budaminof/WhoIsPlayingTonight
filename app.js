$('#imageSearchButton').on('click', function(){

  var image = $('#imageSearchInput').val();

  $.ajax({
    url: 'http://api.pixplorer.co.uk/image?word=' + image + '&amount=1&size=m',
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
      console.log(res);
      $('body').css('background-image', 'url('+ res.images[0].imageurl +')')
      $('body').css('background-size', 'cover');
      $('body').css('background-repeat', 'no-repeat');
    }
  });

});
