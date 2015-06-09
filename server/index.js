var koa = require('koa');
var bodyParser = require('koa-body');
var logger = require('koa-logger');
var cors = require('koa-cors');
var jwt = require('koa-jwt');
var static = require('koa-static');

var env = process.env.NODE_ENV || 'development';

var app = module.exports = koa();

// var keys = require('./helpers/keys');

app.use(cors());
// app.use(jwt({algorithms: ['RS256','RS384','RS512' ], secret: keys.pub}).unless({ path: ['/api/token'] }));
if(env === 'development') {
  app.use(logger());
}

app.use(static(path.join(__dirname, '..', 'dist')));
app.use(bodyParser());

require('./routes')();

// error handlers

app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    if(env === 'production') {
      this.body = 'Internal Server Error';
    } else {
      this.body = err;
    }
    this.app.emit('error', err, this);
  }
});

