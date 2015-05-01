"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TransformerPass = _interopRequire(require("./transformer-pass"));

var isFunction = _interopRequire(require("lodash/lang/isFunction"));

var traverse = _interopRequire(require("../traversal"));

var isObject = _interopRequire(require("lodash/lang/isObject"));

var assign = _interopRequire(require("lodash/object/assign"));

var acorn = _interopRequireWildcard(require("../../acorn"));

var File = _interopRequire(require("./file"));

var each = _interopRequire(require("lodash/collection/each"));

/**
 * This is the class responsible for normalising a transformers handlers
 * as well as constructing a `TransformerPass` that is responsible for
 * actually running the transformer over the provided `File`.
 */

var Transformer = (function () {
  function Transformer(transformerKey, transformer, opts) {
    _classCallCheck(this, Transformer);

    transformer = assign({}, transformer);

    var take = function take(key) {
      var val = transformer[key];
      delete transformer[key];
      return val;
    };

    this.manipulateOptions = take("manipulateOptions");
    this.metadata = take("metadata") || {};
    this.parser = take("parser");
    this.check = take("check");
    this.post = take("post");
    this.pre = take("pre");

    if (this.metadata.stage != null) {
      this.metadata.optional = true;
    }

    this.handlers = this.normalize(transformer);

    var _ref = this;

    if (!_ref.opts) _ref.opts = {};

    this.key = transformerKey;
  }

  Transformer.prototype.normalize = function normalize(transformer) {
    var _this = this;

    if (isFunction(transformer)) {
      transformer = { ast: transformer };
    }

    traverse.explode(transformer);

    each(transformer, function (fns, type) {
      // hidden property
      if (type[0] === "_") {
        _this[type] = fns;
        return;
      }

      if (type === "enter" || type === "exit") return;

      if (isFunction(fns)) fns = { enter: fns };

      if (!isObject(fns)) return;

      if (!fns.enter) fns.enter = function () {};
      if (!fns.exit) fns.exit = function () {};

      transformer[type] = fns;
    });

    return transformer;
  };

  Transformer.prototype.buildPass = function buildPass(file) {
    // validate Transformer instance
    if (!(file instanceof File)) {
      throw new TypeError("Transformer " + this.key + " is resolving to a different Babel version to what is doing the actual transformation...");
    }

    return new TransformerPass(file, this);
  };

  return Transformer;
})();

module.exports = Transformer;