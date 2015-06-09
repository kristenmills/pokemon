var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var app = require('../../server');

gulp.task('start-server', function() {
  nodemon({
    script: 'server/bin/www',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    nodeArgs: ['--harmony']
  })

});
