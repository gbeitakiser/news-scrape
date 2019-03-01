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


app.post("/note/:id", async function(req, res) {
    
        const note = await db.Note.create(req.body)
        await note.save();
        const article = await db.Article.findById(req.params.id);
    
        article.note.push(note);
        await article.save();
        console.log(article);
        res.render('index');
});

// Below could be DELETE
app.delete("/note/:id/:articleID", async function(req, res) {
    const article = await db.Article.findById(req.params.articleID)
    article.note.remove({_id: req.params.id})
    await article.save();
    const notes = await db.Note.deleteOne({_id: req.params.id});
    console.log(notes);
    res.render("index");
})


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});