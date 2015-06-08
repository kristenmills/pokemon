var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('autoprefixer-core');
var postcss = require('gulp-postcss');
var config = require('../config');

gulp.task('build:stylesheets', function () {
  return gulp.src(config.source.stylesheets)
    .pipe(stylus())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
    .pipe(gulp.dest(config.build.css));
});