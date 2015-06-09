var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var jwt = require('express-jwt');

var env = process.env.NODE_ENV || 'development';

var app = module.exports = express();

// var keys = require('./helpers/keys');

app.use(cors());
// app.use(jwt({algorithms: ['RS256','RS384','RS512' ], secret: keys.pub}).unless({ path: ['/api/token'] }));
if(env === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
  req.models = app.models;
  next();
});

require('./routes')();

// error handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (env === 'production') {
    res.status(err.status || 500).send('internal server error!');
  }
  else {
    if(env === 'development' && err.stack) {
      console.error(err.stack);
    }
    var status = err.status;
    err.status = undefined;
    res.status(status || 500).send(err);
  }
});

