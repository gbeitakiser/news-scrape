// Requirements
var express = require("express");
var mongoose = require("mongoose");

// Scrapers
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

// Connection
var PORT = process.env.PORT ||3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));  // <---- Do I need this??

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// Route
// Show index.handlebars. app.js triggers "show" route to render data on page.
app.get("/", function(req, res) {
    res.render("index");
});


var results = [];

// First scrape site for articles...
app.get("/scrape", function(req, res) {


    // First load database and store articles to later check and ensure we're not adding duplicates
    var checker;
    var checkerArray = []

    db.Article.find({})
        .then(function(scrape1) {
            // console.log(scrape1 + "\n")
            scrape1.forEach(function(isThere) {
                checkerArray.push(isThere.headline)
            })
            console.log(checkerArray);
        })

    // Then scrape
    axios.get("https://www.sunnyskyz.com/good-news").then(function(response) {
        var $ = cheerio.load(response.data);

        



    $("a.newslist").each(function(i, element) {
        var result = {}

        result.headline = $(this).children('.titlenews').text();
        result.link = "https://www.sunnyskyz.com" + $(this).attr("href");
        result.summary = $(this).children('.intronews').text();
        checker = checkerArray.includes(result.headline)

        if (!checker) {
            results.push(result)
        

        db.Article.create(result)
            .then(function(dbnewsScraper) {
                console.log("\n Article saved to database.");
            }).catch(function(err) {
                console.log(err);
            });
        }
    })
    res.render("index", {
        articles: results
    })
    })    
});



app.get("/show", function(req, res) {
    // // ...then render results on page
    db.Article.find({})
      .then(function(dbnewsScraper) {
        res.json(dbnewsScraper);
      })
      .catch(function(err) {
        res.json(err);
      });
  });



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});