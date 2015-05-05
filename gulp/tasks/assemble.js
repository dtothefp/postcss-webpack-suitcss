var gulp = require('gulp');
var assemble = require('../assemble/runner');

gulp.task('assemble', ['clean'], assemble);
