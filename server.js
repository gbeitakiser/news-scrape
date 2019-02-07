// Requirements
var express = require("express");
var mongoose = require("mongoose");

// Scrapers
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

// Connection
var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));  <---- Do I need this??

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });


// Route

app.get("/scrape", function(req, res) {
    axios.get("https://www.sunnyskyz.com/good-news").then(function(response) {
        var $ = cheerio.load(response.data);

    $("a.newslist").each(function(i, element) {

        var result = {};

        result.headline = $(this).children('.titlenews').text();
        result.link = $(this).attr("href");
        result.summary = $(this).children('.intronews').text();
        result.image = $(this).children("img").attr("src");

        db.Article.create(result)
            .then(function(dbnewsScraper) {
                console.log(dbnewsScraper);
            }).catch(function(err) {
                console.log(err);
            });
    });
        res.send("Scrape Complete")
    });
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});