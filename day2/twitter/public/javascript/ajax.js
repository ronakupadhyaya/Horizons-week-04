$(document).ready(function(){

  $('.followMe').on('click', function(event){
    var userId = $(this).attr('id');
    var self = $(this);
    console.log("USER", userId);
    $.ajax({
      url: `/followMe/${userId}`,
      method: 'post',
      success: function(resp){
        self.hide();
        self.siblings('.unfollow').show();
      }
    })
  })

  $('.unfollow').on('click', function(event){
    var userId = $(this).attr('id');
    var self = $(this);
    $.ajax({
      url: `/unFollow/${userId}`,
      method: 'post',
      success: function(resp){
        self.hide();
        self.siblings('.followMe').show();
      }
    })
  })

})
