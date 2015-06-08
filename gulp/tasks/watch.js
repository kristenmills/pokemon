var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['build'], function () {
  gulp.watch(config.source.scripts, ['build:scripts']);
  gulp.watch(config.source.stylesheets, ['build:stylesheets']);
  gulp.watch(config.source.html, ['build:html']);
});
