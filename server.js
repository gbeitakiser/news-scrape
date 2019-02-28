var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT ||3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



app.get("/", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.render("index", {
                articles: dbArticle
            });
        })
});


var results = [];
var showLatestScrape = [];

app.get("/scrape", function(req, res) {


    var checker;
    var checkerArray = []

    db.Article.find({})
        .then(function(scrape1) {
            scrape1.forEach(function(isThere) {
                checkerArray.push(isThere.headline)
            })
        })

    axios.get("https://www.sunnyskyz.com/good-news").then(function(response) {
        var $ = cheerio.load(response.data);

    $("a.newslist").each(function(i, element) {
        var result = {}

        result.headline = $(this).children('.titlenews').text();
        result.link = "https://www.sunnyskyz.com" + $(this).attr("href");
        result.summary = $(this).children('.intronews').text();
        checker = checkerArray.includes(result.headline)

        showLatestScrape.push(result);

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
        articles: showLatestScrape
    })
    })    
});

app.get("/note/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
          console.log(dbArticle)
          res.json(dbArticle);
      })
      .catch(function(err) {
          res.json(err)
      });
})

app.get("/note/api/:id", function(req, res) {
    db.Note.findOne({ _id: req.params.id })
      .then(function(dbNote) {
          res.json(dbNote);
      })
      .catch(function(err) {
          res.json(err)
      });
})


app.post("/note/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            console.log("req.params._id: " + req.params._id + "\n");
            console.log("dbNote._id: " + dbNote._id + "\n");
            db.Article.findOneAndUpdate({
                _id: req.params.id
            },
            {
                $push: {
                    note: dbNote._id
                }
            },
            {
                new: true
            })
            .then(function(dbArticle) {
                res.json(dbArticle)
                // console.log(".then function worked")
            }).catch(function(err) {
                // console.log("error 1")
                res.json(err);
            })
        }).catch(function(err) {
            // console.log("error 2")
            res.json(err);
        })
});


app.delete("/note/:id", function(req, res) {
    db.Note.deleteOne({
        _id: req.params.id
    }).then(function(dbNote) {
        db.Article.findOneAndUpdate({
            _id: req.params.id
        },
        {
            $unset: {
                note: dbNote._id
            }
        })
    })
    
    
    
    
    
    
    
    .then(function(deleted) {
        res.json(deleted)
    }).catch(function(err) {
        res.json(err)
    })
})


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});