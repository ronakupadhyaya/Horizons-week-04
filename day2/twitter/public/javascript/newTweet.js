$(document).ready(function(){

  $('#tweet').on('keyup', function(e){
    console.log("asdf", $(this).val().length);
    var textContent = $(this).val();
    if($(this).val().length > 140){
      e.preventDefault();
    }
    $('#count').html(140 - $(this).val().length);
  })
});
