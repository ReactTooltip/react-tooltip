var isValidCSSProps = require('valid-css-props');

function isValidProp(prop) {
  return isValidCSSProps(prop);
}

function isValidValue(value) {
  return value !== '' && (typeof value === 'number' || typeof value === 'string');
}

module.exports = {
  isValidProp: isValidProp,
  isValidValue: isValidValue
};
