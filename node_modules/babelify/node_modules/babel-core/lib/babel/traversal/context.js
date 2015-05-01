"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TraversalPath = _interopRequire(require("./path"));

var compact = _interopRequire(require("lodash/array/compact"));

var t = _interopRequireWildcard(require("../types"));

var TraversalContext = (function () {
  function TraversalContext(scope, opts, state, parentPath) {
    _classCallCheck(this, TraversalContext);

    this.parentPath = parentPath;
    this.scope = scope;
    this.state = state;
    this.opts = opts;
  }

  TraversalContext.prototype.create = function create(node, obj, key) {
    return TraversalPath.get(this.parentPath, this, node, obj, key);
  };

  TraversalContext.prototype.visitMultiple = function visitMultiple(nodes, node, key) {
    // nothing to traverse!
    if (nodes.length === 0) return false;

    var visited = [];

    var queue = this.queue = [];
    var stop = false;

    // build up initial queue
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i]) queue.push(this.create(node, nodes, i));
    }

    // visit the queue
    for (var i = 0; i < queue.length; i++) {
      var path = queue[i];
      if (visited.indexOf(path.node) >= 0) continue;

      visited.push(path.node);

      if (path.visit()) {
        stop = true;
        break;
      }
    }

    // clear context from queued paths
    for (var i = 0; i < queue.length; i++) {}

    return stop;
  };

  TraversalContext.prototype.visitSingle = function visitSingle(node, key) {
    return this.create(node, node, key).visit();
  };

  TraversalContext.prototype.visit = function visit(node, key) {
    var nodes = node[key];
    if (!nodes) return;

    if (Array.isArray(nodes)) {
      return this.visitMultiple(nodes, node, key);
    } else {
      return this.visitSingle(node, key);
    }
  };

  return TraversalContext;
})();

module.exports = TraversalContext;

//queue[i].clearContext();