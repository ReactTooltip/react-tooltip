var sha1 = require('sha1');

function hashStyle(styleObj) {
  return sha1(JSON.stringify(styleObj));
}

function generateValidCSSClassName(styleId) {
  // CSS classNames can't start with a number.
  return 'c' + styleId;
}

var global = Function("return this")();
global.__RCSS_0_registry = global.__RCSS_0_registry || {};

function registerClass(styleObj) {
  var styleId = generateValidCSSClassName(hashStyle(styleObj));

  if (global.__RCSS_0_registry[styleId] == null) {
    global.__RCSS_0_registry[styleId] = {
      className: styleId,
      style: styleObj
    };
  }

  // Simple shallow clone
  var styleObj = global.__RCSS_0_registry[styleId];
  return {
    className: styleObj.className,
    style: styleObj.style
  };
}

module.exports = registerClass;
