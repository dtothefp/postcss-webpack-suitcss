var gulp  = require('gulp');

gulp.task('watch', ['build'], function() {
  gulp.watch('./gulp/**/*.js', ['jshint']);
  gulp.watch('./app/**/*.hbs', ['assemble']);
});
