var path = require('path');

module.exports = function(defaultKey) {
  return {
    noExtPath: function (fp) {
      var ext;
      var noExtPath;
      if(/\.hbs/.test(fp)) {
        ext = '.hbs';
      } else if (/.\html/.test(fp)) {
        ext = '.html';
      }
      if(ext) {
        noExtPath = path.join(path.dirname(fp), path.basename(fp, ext));
      } else {
        noExtPath = fp;
      }

      return noExtPath;
    }
  };
};
