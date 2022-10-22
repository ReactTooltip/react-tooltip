Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelPluginSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');

var _babelPluginSyntaxDynamicImport2 = _interopRequireDefault(_babelPluginSyntaxDynamicImport);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var buildImport = (0, _babelTemplate2['default'])('\n  Promise.resolve().then(() => require(SOURCE))\n');

exports['default'] = function () {
  return {
    inherits: _babelPluginSyntaxDynamicImport2['default'],

    visitor: {
      Import: function () {
        function Import(path) {
          var importArguments = path.parentPath.node.arguments;
          var newImport = buildImport({
            SOURCE: t.isStringLiteral(importArguments[0]) || t.isTemplateLiteral(importArguments[0]) ? importArguments : t.templateLiteral([t.templateElement({ raw: '', cooked: '' }), t.templateElement({ raw: '', cooked: '' }, true)], importArguments)
          });
          path.parentPath.replaceWith(newImport);
        }

        return Import;
      }()
    }
  };
};