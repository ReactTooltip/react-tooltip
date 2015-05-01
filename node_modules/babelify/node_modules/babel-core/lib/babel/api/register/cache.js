"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.save = save;
exports.load = load;
exports.get = get;
exports.__esModule = true;

var path = _interopRequire(require("path"));

var os = _interopRequire(require("os"));

var fs = _interopRequire(require("fs"));

var userHome = _interopRequire(require("user-home"));

var FILENAME = process.env.BABEL_CACHE_PATH || path.join(userHome || os.tmpdir(), ".babel.json");
var data = {};

function save() {
  fs.writeFileSync(FILENAME, JSON.stringify(data, null, "  "));
}

function load() {
  if (process.env.BABEL_DISABLE_CACHE) return;

  process.on("exit", save);
  process.nextTick(save);

  if (!fs.existsSync(FILENAME)) return;

  try {
    data = JSON.parse(fs.readFileSync(FILENAME));
  } catch (err) {
    return;
  }
}

function get() {
  return data;
}