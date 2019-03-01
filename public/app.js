$(function() {
    
    $(document).on("click", "#makenew", function() {
      event.preventDefault()

      var articleID = $(this).attr("data-id");

      var notesBody = {};

      notesBody.body = $(this).parent().children("#bodyInput").val();

      $.ajax({
        method: "POST",
        url: "/note/" + articleID,
        data: notesBody
      }).then(function(data) {
          window.location.replace("/")
        });
    });


    $(document).on("click", "#note-click", function() {
      event.preventDefault();

      var noteID = $(this).attr("note-id");

      $.ajax({
        method: "GET",
        url: "/note/api/" + noteID
      }).then(function(data) {
        window.location.replace("/note/api/" + noteID);
      })
    })

    $(document).on("click", "#scrape", function() {
      event.preventDefault();

      $.ajax({
        method: "GET",
        url: "/scrape"
      }).then(function(data) {
        window.location.replace("/");
      })
    })


    $(document).on("click", "#delete", function() {
      event.preventDefault();

      var deleteID = $(this).attr("data-id");
      var articleID = $(this).parent().attr("data-id");

      $.ajax({
        method: "DELETE", // Could be DELETE
        url: "/note/" + deleteID + "/" + articleID
      }).then(function(data) {
        // window.location.replace("/note/api/" + deleteID);
        window.location.replace("/");
        console.log(data);

      })

    })


})