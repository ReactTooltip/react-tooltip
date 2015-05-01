"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var lineNumbers = _interopRequire(require("line-numbers"));

var repeating = _interopRequire(require("repeating"));

var jsTokens = _interopRequire(require("js-tokens"));

var esutils = _interopRequire(require("esutils"));

var chalk = _interopRequire(require("chalk"));

var defs = {
  string: chalk.red,
  punctuator: chalk.bold,
  curly: chalk.green,
  parens: chalk.blue.bold,
  square: chalk.yellow,
  keyword: chalk.cyan,
  number: chalk.magenta,
  regex: chalk.magenta,
  comment: chalk.grey,
  invalid: chalk.inverse
};

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

function getTokenType(match) {
  var token = jsTokens.matchToToken(match);
  if (token.type === "name" && esutils.keyword.isReservedWordES6(token.value)) {
    return "keyword";
  }

  if (token.type === "punctuator") {
    switch (token.value) {
      case "{":
      case "}":
        return "curly";
      case "(":
      case ")":
        return "parens";
      case "[":
      case "]":
        return "square";
    }
  }

  return token.type;
}

function highlight(text) {
  return text.replace(jsTokens, function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var type = getTokenType(args);
    var colorize = defs[type];
    if (colorize) {
      return args[0].split(NEWLINE).map(function (str) {
        return colorize(str);
      }).join("\n");
    } else {
      return args[0];
    }
  });
}

module.exports = function (lines, lineNumber, colNumber) {
  var opts = arguments[3] === undefined ? {} : arguments[3];

  colNumber = Math.max(colNumber, 0);

  if (opts.highlightCode && chalk.supportsColor) {
    lines = highlight(lines);
  }

  lines = lines.split(NEWLINE);

  var start = Math.max(lineNumber - 3, 0);
  var end = Math.min(lines.length, lineNumber + 3);

  if (!lineNumber && !colNumber) {
    start = 0;
    end = lines.length;
  }

  return lineNumbers(lines.slice(start, end), {
    start: start + 1,
    before: "  ",
    after: " | ",
    transform: function transform(params) {
      if (params.number !== lineNumber) {
        return;
      }
      if (colNumber) {
        params.line += "\n" + params.before + "" + repeating(" ", params.width) + "" + params.after + "" + repeating(" ", colNumber - 1) + "^";
      }
      params.before = params.before.replace(/^./, ">");
    }
  }).join("\n");
};