var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var config = require('../config');

gulp.task('watch', ['build'], function () {
  gulp.watch(config.source.scripts, ['build:scripts']);
  gulp.watch(config.source.stylesheets, ['build:stylesheets']);
  gulp.watch(config.source.html, ['build:html']);
  nodemon({
    script: 'server/bin/www',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    nodeArgs: ['--harmony']
  })
});
