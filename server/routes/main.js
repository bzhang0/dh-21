var express = require('express');
var router = express.Router();

const multer = require("multer");
const rp = require('request-promise');
const cheerio = require('cheerio');
const { json } = require('express');
const upload = multer();

router.use(upload.array());
router.use(express.static('public'));

const TENSOR_LENGTH = 100;

router.post('/process', async function(req, res) {
  console.log("hi");
  console.log(req.body.website);
  if (req.body.website) {

    console.log("passed");

    let title = await grabTitle(req.body.website);
    let contents = await parse(req.body.website);

    console.log(title);
    console.log(contents);

    res.json({
      "title" : title,
      "contents" : contents
    });
  } else {
    res.type("text").send("BAD");
  }
});

/*
router.post('/evaluate', async function(req, res) {
  console.log("hi");

  if (req.body.website) {

    console.log("passed");

    let title = await grabTitle(req.body.website);
    let contents = await parse(req.body.website);

    let tensorScore = evaluateContents(contents);
    console.log("tensorScore = " + tensorScore);

    let jsonObj = [];

    if (tensorScore < 0.7) {

      let recommended = await getRecommended(title);

      for (let key of recommended.keys()) {
        jsonObj.push({
          "website" : key[0],
          "title"   : key[1],
          "score"   : recommended[key]
        });
      }
    } else {
      jsonObj.push({
        "website" : req.body.website,
        "title"   : title,
        "score"   : tensorScore
      });
    }

    jsonObj.push({
      "website" : req.body.website,
      "title"   : title,
      "score"   : tensorScore
    });

    res.json(jsonObj);
  } else {
    res.type("text").send("BAD");
  }
})

function evaluateContents(contents) {
  return tensorEngine.predict(contents);
}

async function getRecommended(title) {
  let websites = [];

  // get websites from google based on param: title
  // google search code here

  let results = new Map();

  for (let website of websites) {
    let scoreAndURL = [];

    let title = await grabTitle(website);
    let tensorScore = evaluateContents(await parse(website));

    scoreAndURL.push[website];
    scoreAndURL.push[title];

    results.set(scoreAndURL, tensorScore);
  }

  return new Map([...results.entries()].sort((a, b) => b[1] - a[1]));
}
// } */

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

module.exports = router;
