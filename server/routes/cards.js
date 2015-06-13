var fetch = require('node-fetch');
var Router = require('koa-router');
var router = new Router({
  prefix: '/api/cards'
})

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
  response = response.replace(/\r/g, "");
  var lines = response.trim().split('\n');
  var keys = lines[0].split('\t').map(function(key){
    var lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
    switch (lowerKey) {
      case 'set #':
        lowerKey = 'number';
        break;
      case 'hP':
        lowerKey = 'hp';
        break;
    }
    return lowerKey;
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
  .get('/',  function *() {
    this.body = yield Promise
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
      .then((cardData) => {
        return cardData.reduce(function(a, b) {
          return a.concat(b);
        });
      });
  });

module.exports = router;
