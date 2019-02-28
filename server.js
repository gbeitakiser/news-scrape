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
            // console.log("dbNote ID: " + dbNote._id);
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
                res.render("index");
            }).catch(function(err) {
                res.json(err);
            })
        }).catch(function(err) {
            res.json(err);
        })
});

// Below could be DELETE
app.get("/note/:id/:articleID", function(req, res) {
    db.Note.deleteOne({
        _id: req.params.id
    }).then(function() {
        console.log("req.params.articleID: " + req.params.articleID + "\n");
        console.log("req.params.id: " + req.params.id + "\n");
        db.Article.findOneAndUpdate({
            _id: req.params.articleID
        },{
            $pull: {
                note: req.params.id
            }
        })

    }).then(function(deleted) {
        res.json(deleted);
        //res.render("index");
    })
    .catch(function(err) {
        res.json(err)
    })
})


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});