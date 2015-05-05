var path = require('path');
var config = require('../../config');
var templatesCwd = process.cwd() + config.src;
var globby = require('globby');
var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};

var options = minimist(process.argv.slice(2), knownOptions);

var getGlob = function(fp) {
  return globby.sync(fp, {cwd: templatesCwd});
};

module.exports = {
  options: {
    assetsDir: 'assets',
    layouts: templatesCwd +'/templates/layouts/*.hbs',
    data: templatesCwd + '/pages/**/*.{json,yml}',
    partials: templatesCwd + '/templates/partials/*.hbs',
    environment: options.env === 'development' ? 'dev' : 'prod',
    helpers: 'app/helpers/*.js',
    title: 'React Calendar'
  },
  pages: {
    files: [
      { 
        cwd: path.join(process.cwd(), 'app'), 
        src: ['pages/**/*.hbs'],
        dest: config.dest + '/'
      }
    ]
  }
};
