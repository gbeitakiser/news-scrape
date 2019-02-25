  
// $.getJSON("/show", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     // Change this to reflect handlebars
//     $("#article").append("<h3>Article</h3><p data-id='" + data[i]._id + "'>" + data[i].headline + "</br>" + data[i].summary + "<br/><a href='" + data[i].link + "'>Link</a></br><button class='note' id='" + data[i]._id + "'>Notes</button>");
//   }
// });


$(function() {

  $(document).on("click", ".note", function() {
    console.log("Click works");
      $(".note").empty();
      var articleID = $(this).attr("data-id");
    
      $.ajax({
        method: "GET",
        url: "/note/" + articleID
      })
        .then(function(data) {
          console.log(data);

          $("#note").append("<h2>" + data.title + "</h2>");
          $("#note").append("<input id='titleinput' name='title' >");
          $("#note").append("<textarea id='bodyinput' name='body'></textarea>");
          $("#note").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    
          if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
          }
        });
    });
    
    $(document).on("click", "#savenote", function() {
      var articleID = $(this).attr("data-id");
    
      $.ajax({
        method: "POST",
        url: "/note/" + articleID,
        data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
        }
      })
        .then(function(data) {
          console.log(data);
          $("#notes").empty();
        });
    
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
})