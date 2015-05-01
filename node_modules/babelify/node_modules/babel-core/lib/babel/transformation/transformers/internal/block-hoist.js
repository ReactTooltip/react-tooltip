"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.__esModule = true;

var groupBy = _interopRequire(require("lodash/collection/groupBy"));

var flatten = _interopRequire(require("lodash/array/flatten"));

var values = _interopRequire(require("lodash/object/values"));

// Priority:
//
//  - 0 We want this to be at the **very** bottom
//  - 1 Default node position
//  - 2 Priority over normal nodes
//  - 3 We want this to be at the **very** top

var BlockStatement = {
  exit: function exit(node) {
    var hasChange = false;
    for (var i = 0; i < node.body.length; i++) {
      var bodyNode = node.body[i];
      if (bodyNode && bodyNode._blockHoist != null) hasChange = true;
    }
    if (!hasChange) return;

    var nodePriorities = groupBy(node.body, function (bodyNode) {
      var priority = bodyNode && bodyNode._blockHoist;
      if (priority == null) priority = 1;
      if (priority === true) priority = 2;
      return priority;
    });

    node.body = flatten(values(nodePriorities).reverse());
  }
};

exports.BlockStatement = BlockStatement;
exports.Program = BlockStatement;