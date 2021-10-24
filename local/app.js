"use strict";

const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const rp = require('request-promise');
const cheerio = require('cheerio');
const http = require('http');
const debug = require('debug')('myexpressapp:server');
const fetch = require('node-fetch');
const FormData = require('form-data');

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

const tensorEngine = require('./tensorflow/predict');


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

app.post('/process', async function(req, res) {
  console.log("hi");

  if (req.body.website) {

    console.log("passed");

    let BASE_URL = "https://dh21woooo.azurewebsites.net/main/process";

    let params = new FormData();
    params.append("website", req.body.website);

    fetch(BASE_URL, {method : "POST", body : params})
      .then(statusCheck)
      .then(response => response.json())
      .then(async function(response) {
        let title = response.title;
        let contents = response.contents;

        let tensorScore = await evaluateContents(contents);

        console.log("tensorScore = " + tensorScore);

        // if (true) {

        //   let recommended = await getRecommended(title);
        //   console.log(recommended);

        //   for (let key of recommended.keys()) {
        //     jsonObj.push({
        //       "website" : key[0],
        //       "title"   : key[1],
        //       "score"   : recommended[key]
        //     });
        //   }
        // } else {
        res.json({
          "website" : req.body.website,
          "title"   : title,
          "score"   : tensorScore
        });
      })
      .catch(function(err) {
        console.log("SADGE");
        handleError(err);
      });
  } else {
    res.type("text").send("BAD");
  }
})

async function evaluateContents(contents) {
  return await tensorEngine.predict(contents);
}


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

async function parse (url) {
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

async function grabTitle (url) {
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


/**
 * Checks if the fetch call returned an error code.
 *
 * @param {Response} response - the response to check
 * @returns {Response} the response if the response was ok, throw error otherwise
 */
async function statusCheck(response) {
  if (!response.ok) {
    throw new Error(await response.text);
  }

  return response;
}

function handleError(err) {
  console.log(err);
}

app.use(express.static("public"));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
