var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var loadersByExtension = require('./config/loaders-by-extension');
var webpackPostcssTools = require('webpack-postcss-tools');
var map = webpackPostcssTools.makeVarMap('./app/assets/css/main.css');
var cssMap = require('postcss-map');
var context = require('postcss-plugin-context');

module.exports = function(options) {
  var isDev = options.isDev;

  var entry = {
    bundle: __dirname + '/app/assets/js/index.jsx'
  };

  var devEntry = [
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server'
  ];

  if(isDev) {
    entry = Object.keys(entry).map(function(filename) {
      return entry[filename];
    }).reduce(function(list, bundle) {
      return list.concat([bundle]);
    }, devEntry);
  }

  var preLoaders = {
    'jsx': {
      exclude: /node_modules/,
      loader: 'jsxhint-loader'
    },
    'js': {
      exclude: /node_modules/,
      loader: 'jshint-loader'
    }
  };

  var loaders = [
    { test: /\.jsx$/, exclude: /node_modules/, loaders: [ 'react-hot-loader', 'babel-loader?experimental&optional=runtime' ]},
    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?experimental&optional=runtime'}
  ];

  var stylesheetLoaders = {
    'css': [
      'style-loader',
      'css?importLoaders=1',
      'postcss'
    ]
  };
  console.log(loadersByExtension(stylesheetLoaders));

  var devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];

  var prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({output: {comments: false}}),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NoErrorsPlugin()
  ];

  if(options.separateStylesheet) {
    stylesheetLoaders = [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 version!sass?imagePath=~stylesheets/blocks&includePaths[]=' + require('node-bourbon').includePaths) }
    ];
    prodPlugins.push(new ExtractTextPlugin('main.css', {
        allChunks: true
    }));
  }

  var webpackConfig =  {
    devtool: options.devtool,
    entry: entry,
    output: {
      path: __dirname + (isDev ? '' : '/build') + '/assets/',
      filename: isDev ? 'bundle.js' : '[name].js',
      publicPath: '/assets/'
    },
    plugins: (isDev ? devPlugins : prodPlugins),
    resolve: {
      packageMains: ['webpack', 'browser', 'web', 'style', 'main'],
      extensions: ['', '.js', '.jsx', '.scss', '.css'],
      root: path.join(__dirname, 'app')
    },
    module: {
      //preLoaders: loadersByExtension(preLoaders),
      loaders: loaders.concat(loadersByExtension(stylesheetLoaders))
    },
    postcss: [
      webpackPostcssTools.prependTildesToImports,

      require('postcss-custom-properties')({
        variables: map.vars
      }),

      require('postcss-calc')(),

      cssMap({
        basePath: 'app/assets/maps/',
        maps: [
          'media-queries.yml',
          'colors.yml',
          'sizes.yml'
        ]
      }),

      //context({
        //ui: cssMap({
          //basePath: 'app/assets/maps/',
          //maps: [
            //'media-queries.yml',
            //'colors.yml'
          //]
        //})
      //})
    ]
    //jshint: {
        //emitErrors: true,
        //failOnHint: true
    //},
    //jsx: {
      //insertPragma: 'React.DOM'
    //}
  };

  return webpackConfig;
};
