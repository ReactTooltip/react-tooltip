var path = require('path');
var fse = require('fs-extra');
var _ = require('lodash');

function ManifestPlugin(opts) {
  this.opts = _.assign({
    basePath: '',
    publicPath: '',
    fileName: 'manifest.json',
    stripSrc: null,
    transformExtensions: /^(gz|map)$/i,
    writeToFileEmit: false,
    cache: null, // TODO: Remove `cache` in next major release in favour of `seed`.
    seed: null,
    filter: null,
    map: null,
    reduce: null,
  }, opts || {});
}

ManifestPlugin.prototype.getFileType = function(str) {
  str = str.replace(/\?.*/, '');
  var split = str.split('.');
  var ext = split.pop();
  if (this.opts.transformExtensions.test(ext)) {
    ext = split.pop() + '.' + ext;
  }
  return ext;
};

ManifestPlugin.prototype.apply = function(compiler) {
  var seed = this.opts.seed || this.opts.cache || {};
  var moduleAssets = {};

  compiler.plugin("compilation", function (compilation) {
    compilation.plugin('module-asset', function (module, file) {
      moduleAssets[file] = path.join(
          path.dirname(file),
          path.basename(module.userRequest)
      );
    });
  });

  compiler.plugin('emit', function(compilation, compileCallback) {
    var stats = compilation.getStats().toJson();

    var files = compilation.chunks.reduce(function(files, chunk) {
      return chunk.files.reduce(function (files, path) {
        // Don't add hot updates to manifest
        if (path.indexOf('hot-update') >= 0) {
          return files;
        }

        var name = chunk.name ? chunk.name.replace(this.opts.stripSrc, '') : null;

        if (name) {
          name = name + '.' + this.getFileType(path);
        } else {
          // For nameless chunks, just map the files directly.
          name = path;
        }

        return files.concat({
          path: path,
          chunk: chunk,
          name: name,
          isInitial: chunk.isInitial ? chunk.isInitial() : chunk.initial,
          isChunk: true,
          isAsset: false,
          isModuleAsset: false
        });
      }.bind(this), files);
    }.bind(this), []);

    // module assets don't show up in assetsByChunkName.
    // we're getting them this way;
    files = stats.assets.reduce(function (files, asset) {
      var name = moduleAssets[asset.name];
      if (!name) {
        return files;
      }

      return files.concat({
        path: asset.name,
        name: name,
        isInitial: false,
        isChunk: false,
        isAsset: true,
        isModuleAsset: true
      });
    }, files);

    // Append optional basepath onto all references.
    // This allows output path to be reflected in the manifest.
    if (this.opts.basePath) {
      files = files.map(function(file) {
        file.name = this.opts.basePath + file.name;
        file.path = this.opts.basePath + file.path;
        return file;
      }.bind(this));
    } else if (this.opts.publicPath) {
      // Similar to basePath but only affects the value (similar to how
      // output.publicPath turns require('foo/bar') into '/public/foo/bar', see
      // https://github.com/webpack/docs/wiki/configuration#outputpublicpath
      files = files.map(function(file) {
        file.path = this.opts.publicPath + file.path;
        return file;
      }.bind(this));
    }

    if (this.opts.filter) {
      files = files.filter(this.opts.filter);
    }

    if (this.opts.map) {
      files = files.map(this.opts.map);
    }

    files = files.sort(function (fileA, fileB) {
      var a = fileA.name;
      var b = fileB.name;

      if (a < b) {
          return -1;
      } else if (a > b) {
          return 1;
      } else {
          return 0;
      }
    });

    var manifest;
    if (this.opts.reduce) {
      manifest = files.reduce(this.opts.reduce, seed);
    } else {
      manifest = files.reduce(function (manifest, file) {
        manifest[file.name] = file.path;
        return manifest;
      }, seed);
    }

    var json = JSON.stringify(manifest, null, 2);

    var outputFolder = compilation.options.output.path;
    var outputFile = path.resolve(compilation.options.output.path, this.opts.fileName);
    var outputName = path.relative(outputFolder, outputFile);

    compilation.assets[outputName] = {
      source: function() {
        return json;
      },
      size: function() {
        return json.length;
      }
    };

    if (this.opts.writeToFileEmit) {
      fse.outputFileSync(outputFile, json);
    }

    compileCallback();
  }.bind(this));
};

module.exports = ManifestPlugin;
