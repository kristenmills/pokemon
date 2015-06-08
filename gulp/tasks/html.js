var gulp = require('gulp');
var config = require('../config');

gulp.task('build:html', function() {
  gulp.src(config.source.html)
    .pipe(gulp.dest(config.build.all))
});
