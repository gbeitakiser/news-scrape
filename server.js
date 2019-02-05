// Requirements
var express = require("express");
var mongoose = require("mongoose");

// Scrapers
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

// Connection
var PORT = 3000;

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));  <---- Do I need this??

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/news-scraper", { useNewUrlParser: true });

