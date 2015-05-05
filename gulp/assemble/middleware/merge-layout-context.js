var createStack = require('layout-stack');
var extend = require('extend-shallow');

module.exports = function(assemble) {
  // transform the layout front matter into an object
  // that `layout-stack` requires
  var mapLayouts = function (layouts) {
    return Object.keys(layouts).reduce(function (acc, key) {
      acc[key] = layouts[key].data;
      return acc;
    }, {});
  };

  // middleware to merge the layout context into the current page context
  return function mergeLayoutContext (file, next) {
    //the layout for the current file
    var layout = file.layout || file.options.layout || file.data.layout;
    var layouts = mapLayouts(assemble.views.layouts);
    var stack = createStack(layout, layouts, assemble.options);

    var data = {};
    var name = null;
    /* jshint ignore:start */
    while (name = stack.shift()) {
      extend(data, layouts[name]);
    }
    /* jshint ignore:end */
    extend(data, file.data);

    file.data = data;
    next();
  };
};
