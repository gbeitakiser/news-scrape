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

mongoose.connect("mongodb://localhost/news-scraper", { useNewUrlParser: true });


// Route

app.get("/scrape", function(req, res) {
    axios.get("https://www.goodnewsnetwork.org/category/news/").then(function(response) {
        var $ = cheerio.load(response.data);

    $("h3.entry-title").each(function(i, element) {

        var result = {};

        var title = $(element).text();
        var link = $(element).children().attr("href");

        result.headline = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");
            // Need a summary section too.
            // Image URL would be nice as well.
        

    })
    console.log(result);
})
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});