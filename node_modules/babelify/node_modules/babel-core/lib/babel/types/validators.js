"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/**
 * Check if the input `node` is a reference to a bound variable.
 */

exports.isReferenced = isReferenced;

/**
 * Check if the input `node` is an `Identifier` and `isReferenced`.
 */

exports.isReferencedIdentifier = isReferencedIdentifier;

/**
 * Check if the input `name` is a valid identifier name
 * and isn't a reserved word.
 */

exports.isValidIdentifier = isValidIdentifier;

/**
 * Description
 */

exports.isLet = isLet;

/**
 * Description
 */

exports.isBlockScoped = isBlockScoped;

/**
 * Description
 */

exports.isVar = isVar;

/**
 * Description
 */

exports.isSpecifierDefault = isSpecifierDefault;

/**
 * Description
 */

exports.isScope = isScope;

/**
 * Description
 */

exports.isImmutable = isImmutable;
exports.__esModule = true;

var isString = _interopRequire(require("lodash/lang/isString"));

var esutils = _interopRequire(require("esutils"));

var t = _interopRequireWildcard(require("./index"));

function isReferenced(node, parent) {
  switch (parent.type) {
    // yes: PARENT[NODE]
    // yes: NODE.child
    // no: parent.CHILD
    case "MemberExpression":
      if (parent.property === node && parent.computed) {
        return true;
      } else if (parent.object === node) {
        return true;
      } else {
        return false;
      }

    // no: new.NODE
    // no: NODE.target
    case "MetaProperty":
      return false;

    // yes: { [NODE]: "" }
    // no: { NODE: "" }
    case "Property":
      if (parent.key === node) {
        return parent.computed;
      }

    // no: var NODE = init;
    // yes: var id = NODE;
    case "VariableDeclarator":
      return parent.id !== node;

    // no: function NODE() {}
    // no: function foo(NODE) {}
    case "ArrowFunctionExpression":
    case "FunctionDeclaration":
    case "FunctionExpression":
      for (var i = 0; i < parent.params.length; i++) {
        var param = parent.params[i];
        if (param === node) return false;
      }

      return parent.id !== node;

    // no: export { foo as NODE };
    case "ExportSpecifier":
      return parent.exported !== node;

    // no: import { NODE as foo } from "foo";
    case "ImportSpecifier":
      return parent.imported !== node;

    // no: class NODE {}
    case "ClassDeclaration":
    case "ClassExpression":
      return parent.id !== node;

    // yes: class { [NODE](){} }
    case "MethodDefinition":
      return parent.key === node && parent.computed;

    // no: NODE: for (;;) {}
    case "LabeledStatement":
      return false;

    // no: try {} catch (NODE) {}
    case "CatchClause":
      return parent.param !== node;

    // no: function foo(...NODE) {}
    case "RestElement":
      return false;

    // no: [NODE = foo] = [];
    // yes: [foo = NODE] = [];
    case "AssignmentPattern":
      return parent.right === node;

    // no: [NODE] = [];
    // no: ({ NODE }) = [];
    case "ObjectPattern":
    case "ArrayPattern":
      return false;

    // no: import NODE from "bar";
    case "ImportSpecifier":
      return false;

    // no: import * as NODE from "foo";
    case "ImportNamespaceSpecifier":
      return false;
  }

  return true;
}

function isReferencedIdentifier(node, parent, opts) {
  return (t.isIdentifier(node, opts) || t.isJSXIdentifier(node, opts)) && t.isReferenced(node, parent);
}

function isValidIdentifier(name) {
  if (!isString(name) || esutils.keyword.isReservedWordES6(name, true)) return false;
  return esutils.keyword.isIdentifierNameES6(name);
}

function isLet(node) {
  return t.isVariableDeclaration(node) && (node.kind !== "var" || node._let);
}

function isBlockScoped(node) {
  return t.isFunctionDeclaration(node) || t.isClassDeclaration(node) || t.isLet(node);
}

function isVar(node) {
  return t.isVariableDeclaration(node, { kind: "var" }) && !node._let;
}

function isSpecifierDefault(specifier) {
  return t.isImportDefaultSpecifier(specifier) || t.isExportDefaultSpecifier(specifier) || t.isIdentifier(specifier.imported || specifier.exported, { name: "default" });
}

function isScope(node, parent) {
  if (t.isBlockStatement(node) && t.isFunction(parent, { body: node })) {
    return false;
  }

  return t.isScopable(node);
}

function isImmutable(node) {
  if (t.isType(node.type, "Immutable")) return true;

  if (t.isLiteral(node)) {
    if (node.regex) {
      // regexes are mutable
      return false;
    } else {
      // immutable!
      return true;
    }
  } else if (t.isIdentifier(node)) {
    if (node.name === "undefined") {
      // immutable!
      return true;
    } else {
      // no idea...
      return false;
    }
  }

  return false;
}