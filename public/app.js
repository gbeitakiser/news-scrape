$(function() {

  $(document).on("click", ".note", function() {
    console.log("Click works");
      $(".note").empty();
      var articleID = $(this).attr("data-id"); //Change
    
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
    
    $(document).on("click", "#makenew", function() {
      event.preventDefault()

      var articleID = $(this).attr("data-id");
      var note = $("#bodyInput").val();
  
      $.ajax({
        method: "POST",
        url: "/note/" + articleID,
        data: note
      })
        .then(function(data) {
          // console.log(data);
        });
      $("#bodyInput").val("");
    });
})