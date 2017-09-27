$(document).ready(function(){
  $('.follow').on('click', function(){
    var followId = $(this).attr('id');
    var self = $(this);
    if(self.text() === 'Follow'){
      $.ajax({
        url: `/follow/${followId}`,
        success: function(e){
          self.text('Unfollow');
        }
      })
    }
    if(self.text() === 'Unfollow'){
      $.ajax({
        url: `/unfollow/${followId}`,
        success: function(e){
          self.text('Follow');
        }
      })
    }

  })
})
