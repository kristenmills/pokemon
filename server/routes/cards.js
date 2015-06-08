var fetch = require('node-fetch');
var express = require('express');
var router = express.Router();

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function text(response) {
  return response.text();
}

function parseTSV(response) {
  var lines = response.trim().split('\n');
  var keys = lines[0].split('\t').map(function(key){
    return key.charAt(0).toLowerCase() + key.slice(1);
  });
  lines.shift();
  return lines.map(function(line) {
    return line.split('\t').reduce(function(obj, value, i) {
      obj[keys[i]] = value;
      return obj
    }, {});
  });
}

//Just incase we want to add more routes in the future
router
  .use(function(req, res, next) {
    Promise
      .all(
        [fetch('https://dl.dropboxusercontent.com/u/73204375/pokemon/carddata.txt')
          .then(status)
          .then(text)
          .then(parseTSV)
        ,
        fetch('https://dl.dropboxusercontent.com/u/73204375/pokemon/carddata2.txt')
          .then(status)
          .then(text)
          .then(parseTSV)
        ]
      )
      .then(function(cardData) {
        req.cards = cardData.reduce(function(a, b) {
          return a.concat(b);
        });
        next();
      })
  });

router
  .route('/')
    .get(function(req, res, next) {
      res.send(req.cards);
    });

module.exports = router;
