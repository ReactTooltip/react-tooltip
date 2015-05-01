"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.BlockStatement = BlockStatement;
exports.__esModule = true;

var strict = _interopRequireWildcard(require("../../helpers/strict"));

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  secondPass: true
};

exports.metadata = metadata;

function BlockStatement(node, parent, scope, file) {
  if (!node._declarations) return;

  strict.wrap(node, function () {
    var kinds = {};
    var kind;

    for (var i in node._declarations) {
      var declar = node._declarations[i];

      kind = declar.kind || "var";
      var declarNode = t.variableDeclarator(declar.id, declar.init);

      if (declar.init) {
        node.body.unshift(file.attachAuxiliaryComment(t.variableDeclaration(kind, [declarNode])));
      } else {
        var _kinds = kinds;
        var _kind = kind;
        if (!_kinds[_kind]) _kinds[_kind] = [];

        kinds[kind].push(declarNode);
      }
    }

    for (kind in kinds) {
      node.body.unshift(file.attachAuxiliaryComment(t.variableDeclaration(kind, kinds[kind])));
    }

    node._declarations = null;
  });
}

exports.Program = BlockStatement;