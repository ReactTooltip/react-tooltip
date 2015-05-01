"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var includes = _interopRequire(require("lodash/collection/includes"));

var traverse = _interopRequire(require("./index"));

var defaults = _interopRequire(require("lodash/object/defaults"));

var messages = _interopRequireWildcard(require("../messages"));

var Binding = _interopRequire(require("./binding"));

var globals = _interopRequire(require("globals"));

var flatten = _interopRequire(require("lodash/array/flatten"));

var extend = _interopRequire(require("lodash/object/extend"));

var object = _interopRequire(require("../helpers/object"));

var each = _interopRequire(require("lodash/collection/each"));

var t = _interopRequireWildcard(require("../types"));

var functionVariableVisitor = {
  enter: function enter(node, parent, scope, state) {
    var _this = this;

    if (t.isFor(node)) {
      each(t.FOR_INIT_KEYS, function (key) {
        var declar = _this.get(key);
        if (declar.isVar()) state.scope.registerBinding("var", declar);
      });
    }

    // this block is a function so we'll stop since none of the variables
    // declared within are accessible
    if (this.isFunction()) return this.skip();

    // function identifier doesn't belong to this scope
    if (state.blockId && node === state.blockId) return;

    // delegate block scope handling to the `blockVariableVisitor`
    if (this.isBlockScoped()) return;

    // this will be hit again once we traverse into it after this iteration
    if (this.isExportDeclaration() && t.isDeclaration(node.declaration)) return;

    // we've ran into a declaration!
    if (this.isDeclaration()) state.scope.registerDeclaration(this);
  }
};

var programReferenceVisitor = {
  enter: function enter(node, parent, scope, state) {
    if (t.isReferencedIdentifier(node, parent) && !scope.hasBinding(node.name)) {
      state.addGlobal(node);
    } else if (t.isLabeledStatement(node)) {
      state.addGlobal(node);
    } else if (t.isAssignmentExpression(node)) {
      scope.registerConstantViolation(this.get("left"), this.get("right"));
    } else if (t.isUpdateExpression(node)) {
      scope.registerConstantViolation(this.get("argument"), null);
    } else if (t.isUnaryExpression(node) && node.operator === "delete") {
      scope.registerConstantViolation(this.get("left"), null);
    }
  }
};

var blockVariableVisitor = {
  enter: function enter(node, parent, scope, state) {
    if (this.isFunctionDeclaration() || this.isBlockScoped()) {
      state.registerDeclaration(this);
    }
    if (this.isScope()) {
      this.skip();
    }
  }
};

var Scope = (function () {

  /**
   * This searches the current "scope" and collects all references/bindings
   * within.
   */

  function Scope(path, parent, file) {
    _classCallCheck(this, Scope);

    if (parent && parent.block === path.node) {
      return parent;
    }

    var cached = path.getData("scope");
    if (cached && cached.parent === parent) {
      return cached;
    } else {}

    this.parent = parent;
    this.file = parent ? parent.file : file;

    this.parentBlock = path.parent;
    this.block = path.node;
    this.path = path;

    this.crawl();
  }

  Scope.globals = flatten([globals.builtin, globals.browser, globals.node].map(Object.keys));
  Scope.contextVariables = ["this", "arguments", "super"];

  /**
   * Description
   */

  Scope.prototype.traverse = (function (_traverse) {
    var _traverseWrapper = function traverse(_x, _x2, _x3) {
      return _traverse.apply(this, arguments);
    };

    _traverseWrapper.toString = function () {
      return _traverse.toString();
    };

    return _traverseWrapper;
  })(function (node, opts, state) {
    traverse(node, opts, this, state, this.path);
  });

  /**
   * Description
   */

  Scope.prototype.generateTemp = function generateTemp() {
    var name = arguments[0] === undefined ? "temp" : arguments[0];

    var id = this.generateUidIdentifier(name);
    this.push({ id: id });
    return id;
  };

  /**
   * Description
   */

  Scope.prototype.generateUidIdentifier = function generateUidIdentifier(name) {
    return t.identifier(this.generateUid(name));
  };

  /**
   * Description
   */

  Scope.prototype.generateUid = function generateUid(name) {
    name = t.toIdentifier(name).replace(/^_+/, "");

    var uid;
    var i = 0;
    do {
      uid = this._generateUid(name, i);
      i++;
    } while (this.hasBinding(uid) || this.hasGlobal(uid) || this.hasUid(uid));
    this.file.uids[uid] = true;
    return uid;
  };

  Scope.prototype._generateUid = function _generateUid(name, i) {
    var id = name;
    if (i > 1) id += i;
    return "_" + id;
  };

  /**
   * Description
   */

  Scope.prototype.hasUid = function hasUid(name) {
    var scope = this;
    do {
      if (scope.file.uids[name]) return true;
      scope = scope.parent;
    } while (scope);
    return false;
  };

  /*
   * Description
   */

  Scope.prototype.generateUidBasedOnNode = function generateUidBasedOnNode(parent, defaultName) {
    var node = parent;

    if (t.isAssignmentExpression(parent)) {
      node = parent.left;
    } else if (t.isVariableDeclarator(parent)) {
      node = parent.id;
    } else if (t.isProperty(node)) {
      node = node.key;
    }

    var parts = [];

    var add = (function (_add) {
      var _addWrapper = function add(_x) {
        return _add.apply(this, arguments);
      };

      _addWrapper.toString = function () {
        return _add.toString();
      };

      return _addWrapper;
    })(function (node) {
      if (t.isModuleDeclaration(node)) {
        if (node.specifiers && node.specifiers.length) {
          for (var i = 0; i < node.specifiers.length; i++) {
            add(node.specifiers[i]);
          }
        } else {
          add(node.source);
        }
      } else if (t.isModuleSpecifier(node)) {
        add(node.local);
      } else if (t.isMemberExpression(node)) {
        add(node.object);
        add(node.property);
      } else if (t.isIdentifier(node)) {
        parts.push(node.name);
      } else if (t.isLiteral(node)) {
        parts.push(node.value);
      } else if (t.isCallExpression(node)) {
        add(node.callee);
      } else if (t.isObjectExpression(node) || t.isObjectPattern(node)) {
        for (var i = 0; i < node.properties.length; i++) {
          var prop = node.properties[i];
          add(prop.key || prop.argument);
        }
      }
    });

    add(node);

    var id = parts.join("$");
    id = id.replace(/^_/, "") || defaultName || "ref";

    return this.generateUidIdentifier(id);
  };

  /**
   * Description
   */

  Scope.prototype.generateMemoisedReference = function generateMemoisedReference(node, dontPush) {
    if (t.isThisExpression(node) || t.isSuper(node)) {
      return null;
    }

    if (t.isIdentifier(node) && this.hasBinding(node.name)) {
      return null;
    }

    var id = this.generateUidBasedOnNode(node);
    if (!dontPush) this.push({ id: id });
    return id;
  };

  /**
   * Description
   */

  Scope.prototype.checkBlockScopedCollisions = function checkBlockScopedCollisions(kind, name, id) {
    var local = this.getOwnBindingInfo(name);
    if (!local) return;

    if (kind === "param") return;
    if (kind === "hoisted" && local.kind === "let") return;

    var duplicate = false;
    if (!duplicate) duplicate = kind === "let" || kind === "const" || local.kind === "let" || local.kind === "const" || local.kind === "module";
    if (!duplicate) duplicate = local.kind === "param" && (kind === "let" || kind === "const");

    if (duplicate) {
      throw this.file.errorWithNode(id, messages.get("scopeDuplicateDeclaration", name), TypeError);
    }
  };

  /**
   * Description
   */

  Scope.prototype.rename = function rename(oldName, newName, block) {
    if (!newName) newName = this.generateUidIdentifier(oldName).name;

    var info = this.getBinding(oldName);
    if (!info) return;

    var binding = info.identifier;
    var scope = info.scope;

    scope.traverse(block || scope.block, {
      enter: function enter(node, parent, scope) {
        if (t.isReferencedIdentifier(node, parent) && node.name === oldName) {
          node.name = newName;
        } else if (t.isDeclaration(node)) {
          var ids = this.getBindingIdentifiers();
          for (var name in ids) {
            if (name === oldName) ids[name].name = newName;
          }
        } else if (this.isScope()) {
          if (!scope.bindingIdentifierEquals(oldName, binding)) {
            this.skip();
          }
        }
      }
    });

    if (!block) {
      scope.removeOwnBinding(oldName);
      scope.bindings[newName] = info;

      binding.name = newName;
    }
  };

  /**
   * Description
   */

  Scope.prototype.dump = function dump() {
    var scope = this;
    do {
      console.log(scope.block.type, "Bindings:", Object.keys(scope.bindings));
    } while (scope = scope.parent);
    console.log("-------------");
  };

  /**
   * Description
   */

  Scope.prototype.toArray = function toArray(node, i) {
    var file = this.file;

    if (t.isIdentifier(node)) {
      var binding = this.getBinding(node.name);
      if (binding && binding.isTypeGeneric("Array", { inference: false })) return node;
    }

    if (t.isArrayExpression(node)) {
      return node;
    }

    if (t.isIdentifier(node, { name: "arguments" })) {
      return t.callExpression(t.memberExpression(file.addHelper("slice"), t.identifier("call")), [node]);
    }

    var helperName = "to-array";
    var args = [node];
    if (i === true) {
      helperName = "to-consumable-array";
    } else if (i) {
      args.push(t.literal(i));
      helperName = "sliced-to-array";
      if (this.file.isLoose("es6.forOf")) helperName += "-loose";
    }
    return t.callExpression(file.addHelper(helperName), args);
  };

  /**
   * Description
   */

  Scope.prototype.registerDeclaration = function registerDeclaration(path) {
    var node = path.node;
    if (t.isFunctionDeclaration(node)) {
      this.registerBinding("hoisted", path);
    } else if (t.isVariableDeclaration(node)) {
      var declarations = path.get("declarations");
      for (var i = 0; i < declarations.length; i++) {
        this.registerBinding(node.kind, declarations[i]);
      }
    } else if (t.isClassDeclaration(node)) {
      this.registerBinding("let", path);
    } else if (t.isImportDeclaration(node) || t.isExportDeclaration(node)) {
      this.registerBinding("module", path);
    } else {
      this.registerBinding("unknown", path);
    }
  };

  /**
   * Description
   */

  Scope.prototype.registerConstantViolation = function registerConstantViolation(left, right) {
    var ids = left.getBindingIdentifiers();
    for (var name in ids) {
      var binding = this.getBinding(name);
      if (!binding) continue;
      if (right) {
        var rightType = right.typeAnnotation;
        if (rightType && binding.isCompatibleWithType(rightType)) continue;
      }
      binding.reassign();
    }
  };

  /**
   * Description
   */

  Scope.prototype.registerBinding = function registerBinding(kind, path) {
    if (!kind) throw new ReferenceError("no `kind`");

    var ids = path.getBindingIdentifiers();

    for (var name in ids) {
      var id = ids[name];

      this.checkBlockScopedCollisions(kind, name, id);

      this.bindings[name] = new Binding({
        identifier: id,
        scope: this,
        path: path,
        kind: kind
      });
    }
  };

  /**
   * Description
   */

  Scope.prototype.addGlobal = function addGlobal(node) {
    this.globals[node.name] = node;
  };

  /**
   * Description
   */

  Scope.prototype.hasGlobal = function hasGlobal(name) {
    var scope = this;

    do {
      if (scope.globals[name]) return true;
    } while (scope = scope.parent);

    return false;
  };

  /**
   * Description
   */

  Scope.prototype.recrawl = function recrawl() {
    this.path.setData("scopeInfo", null);
    this.crawl();
  };

  /**
   * Description
   */

  Scope.prototype.crawl = function crawl() {
    var path = this.path;

    //

    var info = this.block._scopeInfo;
    if (info) return extend(this, info);

    info = this.block._scopeInfo = {
      bindings: object(),
      globals: object()
    };

    extend(this, info);

    // ForStatement - left, init

    if (path.isLoop()) {
      for (var i = 0; i < t.FOR_INIT_KEYS.length; i++) {
        var node = path.get(t.FOR_INIT_KEYS[i]);
        if (node.isBlockScoped()) this.registerBinding(node.node.kind, node);
      }
    }

    // FunctionExpression - id

    if (path.isFunctionExpression() && path.has("id")) {
      if (!t.isProperty(path.parent, { method: true })) {
        this.registerBinding("var", path.get("id"));
      }
    }

    // Class

    if (path.isClass() && path.has("id")) {
      this.registerBinding("var", path.get("id"));
    }

    // Function - params, rest

    if (path.isFunction()) {
      var params = path.get("params");
      for (var i = 0; i < params.length; i++) {
        this.registerBinding("param", params[i]);
      }
      this.traverse(path.get("body").node, blockVariableVisitor, this);
    }

    // Program, Function - var variables

    if (path.isProgram() || path.isFunction()) {
      this.traverse(path.node, functionVariableVisitor, {
        blockId: path.get("id").node,
        scope: this
      });
    }

    // Program, BlockStatement, Function - let variables

    if (path.isBlockStatement() || path.isProgram()) {
      this.traverse(path.node, blockVariableVisitor, this);
    }

    // CatchClause - param

    if (path.isCatchClause()) {
      this.registerBinding("let", path.get("param"));
    }

    // ComprehensionExpression - blocks

    if (path.isComprehensionExpression()) {
      this.registerBinding("let", path);
    }

    // Program

    if (path.isProgram()) {
      this.traverse(path.node, programReferenceVisitor, this);
    }
  };

  /**
   * Description
   */

  Scope.prototype.push = function push(opts) {
    var block = this.block;

    if (t.isLoop(block) || t.isCatchClause(block) || t.isFunction(block)) {
      t.ensureBlock(block);
      block = block.body;
    }

    if (!t.isBlockStatement(block) && !t.isProgram(block)) {
      block = this.getBlockParent().block;
    }

    var _block = block;
    if (!_block._declarations) _block._declarations = {};

    block._declarations[opts.key || opts.id.name] = {
      kind: opts.kind || "var",
      id: opts.id,
      init: opts.init
    };
  };

  /**
   * Walk up the scope tree until we hit either a Function or reach the
   * very top and hit Program.
   */

  Scope.prototype.getFunctionParent = function getFunctionParent() {
    var scope = this;
    while (scope.parent && !t.isFunction(scope.block)) {
      scope = scope.parent;
    }
    return scope;
  };

  /**
   * Walk up the scope tree until we hit either a BlockStatement/Loop or reach the
   * very top and hit Program.
   */

  Scope.prototype.getBlockParent = function getBlockParent() {
    var scope = this;
    while (scope.parent && !t.isFunction(scope.block) && !t.isLoop(scope.block) && !t.isFunction(scope.block)) {
      scope = scope.parent;
    }
    return scope;
  };

  /**
   * Walks the scope tree and gathers **all** bindings.
   */

  Scope.prototype.getAllBindings = function getAllBindings() {
    var ids = object();

    var scope = this;
    do {
      defaults(ids, scope.bindings);
      scope = scope.parent;
    } while (scope);

    return ids;
  };

  /**
   * Walks the scope tree and gathers all declarations of `kind`.
   */

  Scope.prototype.getAllBindingsOfKind = function getAllBindingsOfKind() {
    var ids = object();

    for (var i = 0; i < arguments.length; i++) {
      var kind = arguments[i];
      var scope = this;
      do {
        for (var name in scope.bindings) {
          var binding = scope.bindings[name];
          if (binding.kind === kind) ids[name] = binding;
        }
        scope = scope.parent;
      } while (scope);
    }

    return ids;
  };

  /**
   * Description
   */

  Scope.prototype.bindingIdentifierEquals = function bindingIdentifierEquals(name, node) {
    return this.getBindingIdentifier(name) === node;
  };

  /**
   * Description
   */

  Scope.prototype.getBinding = function getBinding(name) {
    var scope = this;

    do {
      var binding = scope.getOwnBindingInfo(name);
      if (binding) return binding;
    } while (scope = scope.parent);
  };

  /**
   * Description
   */

  Scope.prototype.getOwnBindingInfo = function getOwnBindingInfo(name) {
    return this.bindings[name];
  };

  /**
   * Description
   */

  Scope.prototype.getBindingIdentifier = function getBindingIdentifier(name) {
    var info = this.getBinding(name);
    return info && info.identifier;
  };

  /**
   * Description
   */

  Scope.prototype.getOwnBindingIdentifier = function getOwnBindingIdentifier(name) {
    var binding = this.bindings[name];
    return binding && binding.identifier;
  };

  /**
   * Description
   */

  Scope.prototype.hasOwnBinding = function hasOwnBinding(name) {
    return !!this.getOwnBindingInfo(name);
  };

  /**
   * Description
   */

  Scope.prototype.hasBinding = function hasBinding(name) {
    if (!name) return false;
    if (this.hasOwnBinding(name)) return true;
    if (this.parentHasBinding(name)) return true;
    if (this.file.uids[name]) return true;
    if (includes(Scope.globals, name)) return true;
    if (includes(Scope.contextVariables, name)) return true;
    return false;
  };

  /**
   * Description
   */

  Scope.prototype.parentHasBinding = function parentHasBinding(name) {
    return this.parent && this.parent.hasBinding(name);
  };

  /**
   * Description
   */

  Scope.prototype.removeOwnBinding = function removeOwnBinding(name) {
    this.bindings[name] = null;
  };

  /**
   * Description
   */

  Scope.prototype.removeBinding = function removeBinding(name) {
    var info = this.getBinding(name);
    if (info) info.scope.removeOwnBinding(name);
  };

  return Scope;
})();

module.exports = Scope;

//path.setData("scope", this);