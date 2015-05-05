var gulp = require('gulp');
var cache = require('gulp-cached');
var jshint = require('gulp-jshint');
var config = require('../config').js;

gulp.task('jshint', function() {
  return gulp.src('{./webpack.config.js,./grunt/**/*.js}')
    .pipe(cache('jshint'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
