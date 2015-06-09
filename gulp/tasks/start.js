var gulp = require('gulp');

var app = require('../../server');

gulp.task('start', ['build'], function(){
  var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Koa server listening on port ' + server.address().port);
  });
});

