var path = require('path');

var app = require('..');

module.exports = function() {
  app.use('/api/cards', require('./cards'));
  app.use(function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
  });
}