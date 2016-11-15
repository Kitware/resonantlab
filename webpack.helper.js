var path = require('path');

module.exports = function (config, data) {
  var pluginSourceDir = path.resolve(data.pluginDir, 'web_external');
  var nativeSourceDir = /resonantlab\/web_external/;

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

  return config;
};
