const rp = require('request-promise');
const c = require('cheerio');
const url = 'https://people.com/movies/alec-baldwin-canceling-other-projects-rust-shooting-halyna-hutchins-death-source/';


rp(url)
  .then(function(html){
    //success!
    const $ = c.load(html)
    // console.log(html);
    var results = [];
    $('p').each(function(i, elem) {
        results[i] = $(this).text();
    });
    console.log(results);
    // console.log($('p', html).length);
    // console.log($('p', html));
  })
  .catch(function(err){
    console.log("BAD")
    console.log(err);
    //handle error
  });