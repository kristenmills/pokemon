var Router = require('koa-router');
var jwt = require('koa-jwt');
var fetch = require('node-fetch');

var User = require('../db/helpers/user');

var keys = require('../config/keys');

var expiresIn = 60;

var router = new Router({
  prefix: '/api/token'
})

function signAndSend(payload) {
  var response = jwt.sign(payload, keys.secret, {expiresInMinutes: expiresIn, algorithm: 'RS256'});

  return {token: response, exp: new Date((new Date()).getTime() + expiresIn*60000) };
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function json(response) {
  return response.json();
}

router
  .get('/', function *(){
    if(this.query.refresh) {
      var token;
      if (this.headers && this.headers.authorization) {
        var parts = this.headers.authorization.split(' ');
        if (parts.length == 2) {
          var scheme = parts[0];
          var credentials = parts[1];

          if (/^Bearer$/i.test(scheme)) {
            token = credentials;
          }
        } else {
          this.throw(401, 'Bad Authoriaztion header format')
        }
      }

      if (!token) {
        this.throw(401, 'Could not find token in authorization header');
      }

      this.body = yield new Promise(function(resolve, reject) {
        jwt.verify(token, keys.pub, {algorithm: 'RS256'}, function(err, decoded) {
          if (err) {
            reject(err)
          } else {
            resolve(decoded)
          }
        });
      }).then(signAndSend);
    } else {
      var ctx = this;
      this.body = yield fetch('https://graph.facebook.com/me?access_token=' + this.query.token)
        .then(status)
        .then(json)
        .then(function(json) {
          var user = {
            email: json.email,
            facebookId: json.id,
            name: json.name
          }
          return User.findOrCreateByFacebookId(user).then(signAndSend)

        }).catch(function(e) {
          ctx.throw(401, 'Invalid response from facebook');
        });
    }
  });

module.exports = router;