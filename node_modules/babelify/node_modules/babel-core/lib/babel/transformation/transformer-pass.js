"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var includes = _interopRequire(require("lodash/collection/includes"));

var traverse = _interopRequire(require("../traversal"));

/**
 * This class is responsible for traversing over the provided `File`s
 * AST and running it's parent transformers handlers over it.
 */

var TransformerPass = (function () {
  function TransformerPass(file, transformer) {
    _classCallCheck(this, TransformerPass);

    this.transformer = transformer;
    this.shouldRun = !transformer.check;
    this.handlers = transformer.handlers;
    this.file = file;
    this.ran = false;
  }

  TransformerPass.prototype.canTransform = function canTransform() {
    var transformer = this.transformer;

    var opts = this.file.opts;
    var key = transformer.key;

    // internal
    if (key[0] === "_") return true;

    // blacklist
    var blacklist = opts.blacklist;
    if (blacklist.length && includes(blacklist, key)) return false;

    // whitelist
    var whitelist = opts.whitelist;
    if (whitelist) return includes(whitelist, key);

    // stage
    var stage = transformer.metadata.stage;
    if (stage != null && stage >= opts.stage) return true;

    // optional
    if (transformer.metadata.optional && !includes(opts.optional, key)) return false;

    return true;
  };

  TransformerPass.prototype.checkNode = function checkNode(node) {
    var check = this.transformer.check;
    if (check) {
      return this.shouldRun = check(node);
    } else {
      return true;
    }
  };

  TransformerPass.prototype.transform = function transform() {
    if (!this.shouldRun) return;

    var file = this.file;

    file.log.debug("Running transformer " + this.transformer.key);

    traverse(file.ast, this.handlers, file.scope, file);

    this.ran = true;
  };

  return TransformerPass;
})();

module.exports = TransformerPass;