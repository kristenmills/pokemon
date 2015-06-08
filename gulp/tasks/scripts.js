var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var config = require('../config');
var handleErrors = require('../util/handle-errors');
var notify = require('gulp-notify');

var logName = 'main scripts';

gulp.task('build:scripts', function () {
  return browserify({
    extensions: ['.jsx'],
    debug: true
  })
    .transform(function (f) { return reactify(f, { es6: true }) }) // use the reactify transform
    .add(config.source.jsMain)
    .bundle()
      .on('error', handleErrors)
      .pipe(source('main.js'))
      .pipe(gulp.dest(config.build.js))
      .pipe(notify('Scripts done!'));
});
