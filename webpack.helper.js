var fs = require('fs');
var path = require('path');
var candelaWebpack = require('candela/webpack');

function ramp (hexvalue) {
  return Math.pow(parseInt(hexvalue, 16) / 255, 2);
}

function generateColorTable (dir) {
  // Grab the list of colors.
  const colorText = fs.readFileSync(path.resolve(dir, 'style/colors.styl'), {
    encoding: 'utf8'
  });

  // Extract all color specs.
  const lines = colorText.split('\n');

  let colors = {};
  lines.forEach(line => {
    const parts = line.split(' = #');
    if (parts.length === 2) {
      const hex = parts[1].slice(0, -1).toLowerCase();

      colors[hex] = {
        r: ramp(hex.slice(0, 2)),
        g: ramp(hex.slice(2, 4)),
        b: ramp(hex.slice(4, 6))
      };
    }
  });

  fs.writeFileSync(path.resolve(dir, 'style/colors.json'), JSON.stringify(colors, null, 2));
}

module.exports = function (config, data) {
  var pluginSourceDir = path.resolve(data.pluginDir, 'web_external');
  var nativeSourceDir = /resonantlab\/web_external/;
  var dataTablesDir = /node_modules\/datatables-all/;

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
      test: /\.json$/,
      include: sourceDirs,
      loader: 'json-loader'
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
      include: [
        sourceDirs,
        dataTablesDir
      ],
      loaders: ['style-loader', 'css-loader']
    },
    {
      test: /\.styl$/,
      include: sourceDirs,
      loaders: ['style-loader', 'css-loader', 'stylus-loader']
    },
    {
      test: /\.svg$|\.png$|\.gif$/,
      include: [
        sourceDirs,
        dataTablesDir
      ],
      loader: 'url-loader'
    }
  ].concat(config.module.loaders);

  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias['~reslab'] = pluginSourceDir;

  generateColorTable(pluginSourceDir);

  return candelaWebpack(config, path.resolve(pluginSourceDir, '..', 'node_modules', 'candela'));
};
