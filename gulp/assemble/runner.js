'use strict';
var gulp = require('gulp');
var ext = require('gulp-extname');
var through = require('through2');
var path = require('path');

process.env.lastRunTime = process.env.lastRunTime || null;

module.exports = function(callback) {
  var done = callback;

  var assemble = require('assemble');
  var mergeLayoutContext = require('./middleware/merge-layout-context');

  var config = require('./config/_assemble');
  var options = config.options;

  var renameKey = assemble.option('renameKey');
  var renameKeys = require('./utils/rename-keys')(renameKey);

  assemble.data(options.data);

  assemble.set('data.assetsDir', options.assetsDir);
  assemble.set('data.siteTitle', options.title);
  assemble.set('data.environment', options.environment);

  assemble.layouts([options.layouts]);
  assemble.partials(options.partials);
  assemble.helpers(options.helpers);

  function normalizeSrc (cwd, sources) {
    sources = Array.isArray(sources) ? sources : [sources];
    return sources.map(function (src) {
      if (src[0] === '!') {
        return path.join('!' + cwd, src.substring(1));
      }
      return path.join(cwd, src);
    });
  }

  assemble.preRender(/\.hbs/, mergeLayoutContext(assemble));

  assemble.option('renameKey', renameKeys.noExtPath);

  assemble.task('pages', function () {
    var start = process.hrtime();

    var files = config.pages.files[0];
    return assemble.src(normalizeSrc(files.cwd, files.src))
    .pipe(ext())
    .pipe(assemble.dest(files.dest.substr(1)))
    .on('end', function () {
      var end = process.hrtime(start);
      console.log('finished rendering pages', end);
    });
  });

  assemble.run(['pages'], function (err) {
    if (err) {
      return done(err);
    }
    process.env.lastRunTime = new Date();
    done();
  });
};
