var path = require('path');
var candelaWebpack = require('candela/webpack');

module.exports = function (config, data) {
  var pluginSourceDir = path.resolve(data.pluginDir, 'web_external');
  var nativeSourceDir = /resonantlab\/web_external/;

  var sourceDirs = [pluginSourceDir, nativeSourceDir];

  config.module = config.module || {};
  config.module.loaders = [
    {
      test: /\.yml$/,
      include: [
        pluginSourceDir,
        nativeSourceDir
      ],
      loaders: [
        'json-loader',
        'yaml-loader'
      ]
    }
  ].concat(config.module.loaders);

  return candelaWebpack(config, path.resolve(pluginSourceDir, '..', 'node_modules', 'candela'));
};
