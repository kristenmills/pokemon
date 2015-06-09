var path = require('path');
var sendFile = require('koa-send');

var app = require('..');

module.exports = function() {
  app.use(require('./cards').routes());
  app.use(function *(next) {
    if(this.accepts('html')){
      yield sendFile(this, path.join(__dirname, '..', '..', 'dist', 'index.html'));
    } else {
      yield next;
    }
  });
}