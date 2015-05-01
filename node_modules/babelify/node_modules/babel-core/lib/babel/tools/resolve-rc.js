"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var stripJsonComments = _interopRequire(require("strip-json-comments"));

var merge = _interopRequire(require("lodash/object/merge"));

var path = _interopRequire(require("path"));

var fs = _interopRequire(require("fs"));

var cache = {};
var jsons = {};

function exists(filename) {
  if (!fs.existsSync) return false;

  var cached = cache[filename];
  if (cached != null) return cached;
  return cache[filename] = fs.existsSync(filename);
}

module.exports = function (loc) {
  var opts = arguments[1] === undefined ? {} : arguments[1];

  var rel = ".babelrc";

  function find(start, rel) {
    var file = path.join(start, rel);

    if (exists(file)) {
      var content = fs.readFileSync(file, "utf8");
      var json;

      try {
        var _jsons, _content;

        json = (_jsons = jsons, _content = content, !_jsons[_content] && (_jsons[_content] = JSON.parse(stripJsonComments(content))), _jsons[_content]);
      } catch (err) {
        err.message = "" + file + ": " + err.message;
        throw err;
      }

      if (json.breakConfig) return;
      merge(opts, json, function (a, b) {
        if (Array.isArray(a)) {
          return a.concat(b);
        }
      });
    }

    var up = path.dirname(start);
    if (up !== start) {
      // root
      find(up, rel);
    }
  }

  if (opts.breakConfig !== true) {
    find(loc, rel);
  }

  return opts;
};