$(document).ready(function(){
  $('.table').on('click', '.btn', function(evt) {
    console.log(evt);
    $(this).toggleClass('btn-warning')
    $(this).toggleClass('btn-success')
    $(this).text() === 'todo' ? $(this).text('done') : $(this).text('todo')
  })
})
