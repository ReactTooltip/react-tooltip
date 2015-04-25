var cascade = require('./cascade');
var registerClass = require('./registerClass');
var styleRuleConverter = require('./styleRuleConverter');

var global = Function("return this")();
global.__RCSS_0_registry = global.__RCSS_0_registry || {};

function descriptorsToString(styleDescriptor) {
  return styleRuleConverter.rulesToString(
    styleDescriptor.className,
    styleDescriptor.style
  );
}

var RCSS = {
  cascade: cascade,
  registerClass: registerClass,

  injectAll: function() {
    var tag = document.createElement('style');
    tag.innerHTML = RCSS.getStylesString();
    document.getElementsByTagName('head')[0].appendChild(tag);
  },

  getStylesString: function() {
    var registry = global.__RCSS_0_registry;
    var str = '';
    for (var key in registry) {
      if (!registry.hasOwnProperty(key)) {
        continue;
      }
      str += descriptorsToString(registry[key]);
    }
    global.__RCSS_0_registry = {};
    return str;
  }
};

module.exports = RCSS;
