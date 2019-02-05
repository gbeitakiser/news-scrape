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
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/news-scraper", { useNewUrlParser: true });

