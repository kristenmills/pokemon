var gulp = require('gulp');

var config = require('../config');

gulp.task('build', ['build:scripts', 'build:stylesheets', 'build:html']);
