var path = require('path');
var candelaWebpack = require('candela/webpack');

module.exports = function (config, data) {
  var pluginSourceDir = path.resolve(data.pluginDir, 'web_external');
  var nativeSourceDir = /resonantlab\/web_external/;

  var sourceDirs = [pluginSourceDir, nativeSourceDir];

  config.module = config.module || {};
  config.module.loaders = [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: sourceDirs,
      query: {
        presets: ['es2015']
      }
    },
    {
      test: /\.yml$/,
      include: sourceDirs,
      loaders: [
        'json-loader',
        'yaml-loader'
      ]
    },
    {
      test: /\.jade$/,
      include: sourceDirs,
      loader: 'jade-loader'
    },
    {
      test: /\.css$/,
      include: sourceDirs,
      loaders: ['style-loader', 'css-loader']
    },
    {
      test: /\.styl$/,
      include: sourceDirs,
      loaders: ['style-loader', 'css-loader', 'stylus-loader']
    },
    {
      test: /\.svg$|\.png$/,
      include: sourceDirs,
      loader: 'url-loader'
    }
  ].concat(config.module.loaders);

  return candelaWebpack(config, path.resolve(pluginSourceDir, '..', 'node_modules', 'candela'));
};
