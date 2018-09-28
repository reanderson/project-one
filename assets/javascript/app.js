

var queryURL = "https://favqs.com/api/qotd"

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
  $("body").html("<h1>" + response.quote.body + "</h1>" + "<h2>" + response.quote.author +"</h2>");
  
});

 