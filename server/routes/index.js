var path = require('path');
var sendFile = require('koa-send');

var app = require('..');

module.exports = function() {
  app.use('/api/cards', require('./cards'));
  app.use(function *(next) {
    if(this.is('html')){
      yield sendFile(this, path.join(__dirname, '..', '..', 'dist', 'index.html'));
    } else {
      yield next;
    }
  });
}