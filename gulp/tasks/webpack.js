var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};

var options = minimist(process.argv.slice(2), knownOptions);
console.log(options);
console.log('******ENVIRONMENT: ' + options.env + '*******');

var runWebpackTask = function(env, callback) {
  var config;

  if(env === 'development') {
   config = require('../../webpack-hot-dev-server.config.js');

   return new WebpackDevServer(webpack(config), {
      contentBase: path.join(process.cwd(), 'build'),
      publicPath: config.output.publicPath,
      hot: true,
      stats: { colors: true }
    }).listen(8000, 'localhost', function (err, result) {
        if(err) {
          throw new gutil.PluginError("webpack-dev-server", err);
        }
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8000/webpack-dev-server/index.html");

        // keep the server alive or continue?
        callback();
    });
  } else if (env === 'production') {
    config = require('../../webpack-production.config.js');

    return webpack(config, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
  }
  
};

gulp.task('webpack', ['clean'], function(callback) {
    runWebpackTask(options.env, callback);
});
