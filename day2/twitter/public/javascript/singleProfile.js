$(document).ready(function(){
  $('.follow').on('click', function(){
    var followId = $(this).attr('id');
    var self = $(this);
    console.log(self.text());
    if(self.text() === 'Follow'){
      console.log("WHAT");
      $.ajax({
        url: `/follow/${followId}`,
        success: function(e){
          console.log('e', e);
          self.text('Unfollow');
        }
      })
    }
    if(self.text() === 'Unfollow'){
      $.ajax({
        url: `/unfollow/${followId}`,
        success: function(e){
          console.log(e);
          self.text('Follow');
        }
      })
    }

  })
})
