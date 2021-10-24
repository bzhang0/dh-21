"use strict";

const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const rp = require('request-promise');
const cheerio = require('cheerio');


const app = express();

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

// constants amd magic numbers
const DEFAULT_PORT = 8000;
const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;

const TENSOR_LENGTH = 100;


app.get("/hello", async function(req, res) {
  res.type("text").send("hello");
});

app.get("/evaluate/:website", async function(req, res) {
  let website = req.params.website;

  res.type("text").send(website);
});

app.post("/test", async function(req, res) {
  console.log("hi");

  if (req.body.website) {

    console.log("passed");

    res.json({
      "title" : await grabTitle(req.body.website),
      "contents" : await parse(req.body.website)
    });
  } else {
    res.type("text").send("BAD");
  }
})

// node.js program that parses an html website and returns all the elements with the <p> tags
// function process() {
//   var fs = require('fs');
//   var cheerio = require('cheerio');
//   var $ = cheerio.load(fs.readFileSync('index.html'));
//   var results = [];
//   $('p').each(function(i, elem) {
//       results[i] = $(this).text();
//   });
// }

function parse (url) {
  return rp(url)
    .then(function(html){
      const $ = cheerio.load(html);
      // console.log(html);
      let res = '';
      let stop = false;
      $('p').each(function(i, elem) {
          let words = $(this).text().split(" ");
          // console.log(words);
          // console.log($(this).text());
          for (let word of words) {
            if (stop || res.length + word.length + 1 > TENSOR_LENGTH) {
              stop = true;
              break;
            }

            res += word + " ";
          }
      });

      return res;
      // console.log($('p', html).length);
      // console.log($('p', html));
    })
    .catch(function(err){
      console.log("BAD")
      console.log(err);
      //handle error
    });
}

function grabTitle (url) {
  return rp(url)
    .then(function(html) {
      const $ = cheerio.load(html);
      // console.log(html);
      return $('h1', html).text();
    })
    .catch(function(err) {
      console.log("BAD")
      console.log(err);
      //handle error
    });
}



/*
pass in the website link
  - get the title
  - parse the site
  - run the tensor
*/


app.use(express.static("public"));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
