'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _classNames = require('classNames');

var _classNames2 = _interopRequireWildcard(_classNames);

var _basicClass = require('./src/basic');

var _basicClass2 = _interopRequireWildcard(_basicClass);

var _basicShowClass = require('./src/basic-show');

var _basicShowClass2 = _interopRequireWildcard(_basicShowClass);

var _topPlaceClass = require('./src/place-top');

var _topPlaceClass2 = _interopRequireWildcard(_topPlaceClass);

var _bottomPlaceClass = require('./src/place-bottom');

var _bottomPlaceClass2 = _interopRequireWildcard(_bottomPlaceClass);

var _RCSS = require('rcss');

var _RCSS2 = _interopRequireWildcard(_RCSS);

'use strict';

_RCSS2['default'].injectAll();

var ReactTooltip = (function (_React$Component) {
  function ReactTooltip(props) {
    _classCallCheck(this, ReactTooltip);

    _get(Object.getPrototypeOf(ReactTooltip.prototype), 'constructor', this).call(this, props);
    this.state = {
      show: false,
      placeholder: '',
      x: 0,
      y: 0,
      place: this.props.place ? this.props.place : 'top'
    };
  }

  _inherits(ReactTooltip, _React$Component);

  _createClass(ReactTooltip, [{
    key: 'displayName',
    value: undefined,
    enumerable: true
  }, {
    key: 'propTypes',
    value: undefined,
    enumerable: true
  }, {
    key: 'showTooltip',
    value: function showTooltip(e) {
      this.setState({
        placeholder: e.target.dataset.placeholder,
        place: e.target.dataset.place ? e.target.dataset.place : this.props.place ? this.props.place : 'top'
      });
      this.updateTooltip(e);
    }
  }, {
    key: 'updateTooltip',
    value: function updateTooltip(e) {
      this.setState({
        show: true,
        x: e.x,
        y: e.y
      });
    }
  }, {
    key: 'hideTooltip',
    value: function hideTooltip(e) {
      this.setState({
        show: false
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var targetArray = document.querySelectorAll('[data-placeholder]');
      for (var i = 0; i < targetArray.length; i++) {
        targetArray[i].addEventListener('mouseover', this.showTooltip, false);
        targetArray[i].addEventListener('mousemove', this.updateTooltip, false);
        targetArray[i].addEventListener('mouseleave', this.hideTooltip, false);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var targetArray = document.querySelectorAll('[data-placeholder]');
      for (var i = 0; i < targetArray.length; i++) {
        targetArray[i].removeEventListener('mouseover', this.showTooltip);
        targetArray[i].removeEventListener('mousemove', this.updateTooltip);
        targetArray[i].removeEventListener('mouseleave', this.hideTooltip);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var tipWidth = document.querySelector('[data-id=\'tooltip\']') ? document.querySelector('[data-id=\'tooltip\']').clientWidth : 0;
      var offset = { x: 0, y: 0 };
      if (this.state.place === 'top') {
        offset.x = -(tipWidth / 2);
        offset.y = -50;
      } else if (this.state.place === 'bottom') {
        offset.x = -(tipWidth / 2);
        offset.y = 30;
      }
      var style = {
        left: this.state.x + offset.x + 'px',
        top: this.state.y + offset.y + 'px'
      };
      var classNamesObject = {};
      classNamesObject[_basicClass2['default'].className] = true;
      if (this.state.show) {
        classNamesObject[_basicShowClass2['default'].className] = true;
      }
      if (this.state.place === 'top') {
        classNamesObject[_topPlaceClass2['default'].className] = true;
      }
      if (this.state.place === 'bottom') {
        classNamesObject[_bottomPlaceClass2['default'].className] = true;
      }
      var toolTipClass = _classNames2['default'](classNamesObject);

      return _React2['default'].createElement(
        'span',
        { className: toolTipClass, style: style, 'data-id': 'tooltip' },
        this.state.placeholder
      );
    }
  }]);

  return ReactTooltip;
})(_React2['default'].Component);

exports['default'] = ReactTooltip;
module.exports = exports['default'];

