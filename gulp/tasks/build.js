var gulp = require('gulp');

gulp.task('build', [
    'jshint',
    'clean',
    'assemble',
    'webpack'
  ]
);
