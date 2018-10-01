


  $(document).ready(function () {
    var queryURL = "https://favqs.com/api/qotd"
    
    function loadquote(){
  
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
       $("#dailyquote").html(response.quote.body + "<br/>" + response.quote.author)
    })
  }

  $("#newQuote").on("click", function() {
    loadquote()
  })
  loadquote()
  })

