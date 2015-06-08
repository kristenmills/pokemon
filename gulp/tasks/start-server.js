var gulp = require('gulp');
var app = require('../../server');

gulp.task('start-server', function() {
  var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Express server listening on port ' + server.address().port);
  });
});
