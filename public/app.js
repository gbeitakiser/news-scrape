$.getJSON("/show", function(data) {
    for (var i = 0; i < data.length; i++) {
      // Change this to reflect handlebars
      $("#article").append("<h3>Article:</h3><p data-id='" + data[i]._id + "'>" + data[i].headline + "</br>" + data[i].summary + "<br/><a href='" + data[i].link + "'>Link</a></br><button class='note' id='" + data[i]._id + "'>Notes</button>");
    }
  });


  // Whenever someone clicks a p tag
$(document).on("click", "#note", function() {
    // Empty the notes from the note section
    $("#note").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/note/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#note").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#note").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#note").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#note").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/note/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });