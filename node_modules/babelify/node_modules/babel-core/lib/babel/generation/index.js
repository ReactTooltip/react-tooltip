"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var detectIndent = _interopRequire(require("detect-indent"));

var Whitespace = _interopRequire(require("./whitespace"));

var repeating = _interopRequire(require("repeating"));

var SourceMap = _interopRequire(require("./source-map"));

var Position = _interopRequire(require("./position"));

var messages = _interopRequireWildcard(require("../messages"));

var Buffer = _interopRequire(require("./buffer"));

var extend = _interopRequire(require("lodash/object/extend"));

var each = _interopRequire(require("lodash/collection/each"));

var n = _interopRequire(require("./node"));

var t = _interopRequireWildcard(require("../types"));

var CodeGenerator = (function () {
  function CodeGenerator(ast, opts, code) {
    _classCallCheck(this, CodeGenerator);

    if (!opts) opts = {};

    this.comments = ast.comments || [];
    this.tokens = ast.tokens || [];
    this.format = CodeGenerator.normalizeOptions(code, opts, this.tokens);
    this.opts = opts;
    this.ast = ast;

    this.whitespace = new Whitespace(this.tokens, this.comments, this.format);
    this.position = new Position();
    this.map = new SourceMap(this.position, opts, code);
    this.buffer = new Buffer(this.position, this.format);
  }

  CodeGenerator.normalizeOptions = function normalizeOptions(code, opts, tokens) {
    var style = "  ";
    if (code) {
      var indent = detectIndent(code).indent;
      if (indent && indent !== " ") style = indent;
    }

    var format = {
      comments: opts.comments == null || opts.comments,
      compact: opts.compact,
      quotes: CodeGenerator.findCommonStringDelimeter(code, tokens),
      indent: {
        adjustMultilineComment: true,
        style: style,
        base: 0
      }
    };

    if (format.compact === "auto") {
      format.compact = code.length > 100000; // 100KB

      if (format.compact) {
        console.error(messages.get("codeGeneratorDeopt", opts.filename, "100KB"));
      }
    }

    return format;
  };

  CodeGenerator.findCommonStringDelimeter = function findCommonStringDelimeter(code, tokens) {
    var occurences = {
      single: 0,
      double: 0
    };

    var checked = 0;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.type.label !== "string") continue;
      if (checked >= 3) continue;

      var raw = code.slice(token.start, token.end);
      if (raw[0] === "'") {
        occurences.single++;
      } else {
        occurences.double++;
      }

      checked++;
    }

    if (occurences.single > occurences.double) {
      return "single";
    } else {
      return "double";
    }
  };

  CodeGenerator.generators = {
    templateLiterals: require("./generators/template-literals"),
    comprehensions: require("./generators/comprehensions"),
    expressions: require("./generators/expressions"),
    statements: require("./generators/statements"),
    classes: require("./generators/classes"),
    methods: require("./generators/methods"),
    modules: require("./generators/modules"),
    types: require("./generators/types"),
    flow: require("./generators/flow"),
    base: require("./generators/base"),
    jsx: require("./generators/jsx")
  };

  CodeGenerator.prototype.generate = function generate() {
    var ast = this.ast;

    this.print(ast);

    var comments = [];
    each(ast.comments, function (comment) {
      if (!comment._displayed) comments.push(comment);
    });
    this._printComments(comments);

    return {
      map: this.map.get(),
      code: this.buffer.get()
    };
  };

  CodeGenerator.prototype.buildPrint = function buildPrint(parent) {
    var _this = this;

    var print = function (node, opts) {
      return _this.print(node, parent, opts);
    };

    print.sequence = function (nodes) {
      var opts = arguments[1] === undefined ? {} : arguments[1];

      opts.statement = true;
      return _this.printJoin(print, nodes, opts);
    };

    print.join = function (nodes, opts) {
      return _this.printJoin(print, nodes, opts);
    };

    print.list = function (items) {
      var opts = arguments[1] === undefined ? {} : arguments[1];

      if (opts.separator == null) opts.separator = ", ";
      print.join(items, opts);
    };

    print.block = function (node) {
      return _this.printBlock(print, node);
    };

    print.indentOnComments = function (node) {
      return _this.printAndIndentOnComments(print, node);
    };

    return print;
  };

  CodeGenerator.prototype.print = function print(node, parent) {
    var _this = this;

    var opts = arguments[2] === undefined ? {} : arguments[2];

    if (!node) return;

    if (parent && parent._compact) {
      node._compact = true;
    }

    var oldConcise = this.format.concise;
    if (node._compact) {
      this.format.concise = true;
    }

    var newline = function (leading) {
      if (!opts.statement && !n.isUserWhitespacable(node, parent)) {
        return;
      }

      var lines = 0;

      if (node.start != null && !node._ignoreUserWhitespace) {
        // user node
        if (leading) {
          lines = _this.whitespace.getNewlinesBefore(node);
        } else {
          lines = _this.whitespace.getNewlinesAfter(node);
        }
      } else {
        // generated node
        if (!leading) lines++; // always include at least a single line after
        if (opts.addNewlines) lines += opts.addNewlines(leading, node) || 0;

        var needs = n.needsWhitespaceAfter;
        if (leading) needs = n.needsWhitespaceBefore;
        if (needs(node, parent)) lines++;

        // generated nodes can't add starting file whitespace
        if (!_this.buffer.buf) lines = 0;
      }

      _this.newline(lines);
    };

    if (this[node.type]) {
      var needsNoLineTermParens = n.needsParensNoLineTerminator(node, parent);
      var needsParens = needsNoLineTermParens || n.needsParens(node, parent);

      if (needsParens) this.push("(");
      if (needsNoLineTermParens) this.indent();

      this.printLeadingComments(node, parent);

      newline(true);

      if (opts.before) opts.before();
      this.map.mark(node, "start");

      this[node.type](node, this.buildPrint(node), parent);

      if (needsNoLineTermParens) {
        this.newline();
        this.dedent();
      }
      if (needsParens) this.push(")");

      this.map.mark(node, "end");
      if (opts.after) opts.after();

      newline(false);

      this.printTrailingComments(node, parent);
    } else {
      throw new ReferenceError("unknown node of type " + JSON.stringify(node.type) + " with constructor " + JSON.stringify(node && node.constructor.name));
    }

    this.format.concise = oldConcise;
  };

  CodeGenerator.prototype.printJoin = function printJoin(print, nodes) {
    var _this = this;

    var opts = arguments[2] === undefined ? {} : arguments[2];

    if (!nodes || !nodes.length) return;

    var len = nodes.length;

    if (opts.indent) this.indent();

    each(nodes, function (node, i) {
      print(node, {
        statement: opts.statement,
        addNewlines: opts.addNewlines,
        after: function () {
          if (opts.iterator) {
            opts.iterator(node, i);
          }

          if (opts.separator && i < len - 1) {
            _this.push(opts.separator);
          }
        }
      });
    });

    if (opts.indent) this.dedent();
  };

  CodeGenerator.prototype.printAndIndentOnComments = function printAndIndentOnComments(print, node) {
    var indent = !!node.leadingComments;
    if (indent) this.indent();
    print(node);
    if (indent) this.dedent();
  };

  CodeGenerator.prototype.printBlock = function printBlock(print, node) {
    if (t.isEmptyStatement(node)) {
      this.semicolon();
    } else {
      this.push(" ");
      print(node);
    }
  };

  CodeGenerator.prototype.generateComment = function generateComment(comment) {
    var val = comment.value;
    if (comment.type === "Line") {
      val = "//" + val;
    } else {
      val = "/*" + val + "*/";
    }
    return val;
  };

  CodeGenerator.prototype.printTrailingComments = function printTrailingComments(node, parent) {
    this._printComments(this.getComments("trailingComments", node, parent));
  };

  CodeGenerator.prototype.printLeadingComments = function printLeadingComments(node, parent) {
    this._printComments(this.getComments("leadingComments", node, parent));
  };

  CodeGenerator.prototype.getComments = function getComments(key, node, parent) {
    var _this = this;

    if (t.isExpressionStatement(parent)) {
      return [];
    }

    var comments = [];
    var nodes = [node];

    if (t.isExpressionStatement(node)) {
      nodes.push(node.argument);
    }

    each(nodes, function (node) {
      comments = comments.concat(_this._getComments(key, node));
    });

    return comments;
  };

  CodeGenerator.prototype._getComments = function _getComments(key, node) {
    return node && node[key] || [];
  };

  CodeGenerator.prototype._printComments = function _printComments(comments) {
    var _this = this;

    if (this.format.compact) return;

    if (!this.format.comments) return;
    if (!comments || !comments.length) return;

    each(comments, function (comment) {
      var skip = false;

      // find the original comment in the ast and set it as displayed
      each(_this.ast.comments, function (origComment) {
        if (origComment.start === comment.start) {
          // comment has already been output
          if (origComment._displayed) skip = true;

          origComment._displayed = true;
          return false;
        }
      });

      if (skip) return;

      // whitespace before
      _this.newline(_this.whitespace.getNewlinesBefore(comment));

      var column = _this.position.column;
      var val = _this.generateComment(comment);

      if (column && !_this.isLast(["\n", " ", "[", "{"])) {
        _this._push(" ");
        column++;
      }

      //

      if (comment.type === "Block" && _this.format.indent.adjustMultilineComment) {
        var offset = comment.loc.start.column;
        if (offset) {
          var newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
          val = val.replace(newlineRegex, "\n");
        }

        var indent = Math.max(_this.indentSize(), column);
        val = val.replace(/\n/g, "\n" + repeating(" ", indent));
      }

      if (column === 0) {
        val = _this.getIndent() + val;
      }

      //

      _this._push(val);

      // whitespace after
      _this.newline(_this.whitespace.getNewlinesAfter(comment));
    });
  };

  return CodeGenerator;
})();

each(Buffer.prototype, function (fn, key) {
  CodeGenerator.prototype[key] = function () {
    return fn.apply(this.buffer, arguments);
  };
});

each(CodeGenerator.generators, function (generator) {
  extend(CodeGenerator.prototype, generator);
});

module.exports = function (ast, opts, code) {
  var gen = new CodeGenerator(ast, opts, code);
  return gen.generate();
};

module.exports.CodeGenerator = CodeGenerator;