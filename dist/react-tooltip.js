'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var ReactTooltip = (function (_Component) {
  _inherits(ReactTooltip, _Component);

  ReactTooltip.prototype._bind = function _bind() {
    var _this = this;

    for (var _len = arguments.length, handlers = Array(_len), _key = 0; _key < _len; _key++) {
      handlers[_key] = arguments[_key];
    }

    handlers.forEach(function (handler) {
      return _this[handler] = _this[handler].bind(_this);
    });
  };

  ReactTooltip.hide = function hide() {
    window.dispatchEvent(new window.Event('__react_tooltip_hide_event'));
  };

  ReactTooltip.rebuild = function rebuild() {
    window.dispatchEvent(new window.Event('__react_tooltip_rebuild_event'));
  };

  _createClass(ReactTooltip, null, [{
    key: 'displayName',
    value: 'ReactTooltip',
    enumerable: true
  }, {
    key: 'eventHideMark',
    value: 'hide' + Date.now(),
    enumerable: true
  }, {
    key: 'eventRebuildMark',
    value: 'rebuild' + Date.now(),
    enumerable: true
  }]);

  function ReactTooltip(props) {
    _classCallCheck(this, ReactTooltip);

    _Component.call(this, props);
    this._bind('showTooltip', 'updateTooltip', 'hideTooltip');
    this.mount = true;
    this.state = {
      show: false,
      multilineCount: 0,
      placeholder: '',
      x: 'NONE',
      y: 'NONE',
      place: '',
      type: '',
      effect: '',
      multiline: false,
      position: {}
    };
  }

  ReactTooltip.prototype.componentDidMount = function componentDidMount() {
    this.bindListener();
    /* Add window event listener for hide and rebuild */
    window.addEventListener('__react_tooltip_hide_event', this.globalHide.bind(this), false);
    window.addEventListener('__react_tooltip_rebuild_event', this.globalRebuild.bind(this), false);
  };

  /** Method for window.addEventListener
   *
   **/

  ReactTooltip.prototype.globalHide = function globalHide() {
    if (this.mount) {
      this.hideTooltip();
    }
  };

  ReactTooltip.prototype.globalRebuild = function globalRebuild() {
    if (this.mount) {
      this.unbindListener();
      this.bindListener();
    }
  };

  ReactTooltip.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unbindListener();
    this.mount = false;
    var tag = document.querySelector('style[id="react-tooltip"]');
    document.getElementsByTagName('head')[0].removeChild(tag);
    window.removeEventListener('__react_tooltip_hide_event', this.globalHide);
    window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild);
  };

  ReactTooltip.prototype.componentWillUpdate = function componentWillUpdate() {
    this.unbindListener();
  };

  ReactTooltip.prototype.componentDidUpdate = function componentDidUpdate() {
    this._updatePosition();
    this.bindListener();
  };

  ReactTooltip.prototype.bindListener = function bindListener() {
    var targetArray = document.querySelectorAll('[data-tip]');
    for (var i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener('mouseenter', this.showTooltip, false);
      targetArray[i].addEventListener('mousemove', this.updateTooltip, false);
      targetArray[i].addEventListener('mouseleave', this.hideTooltip, false);
    }
  };

  ReactTooltip.prototype.unbindListener = function unbindListener() {
    var targetArray = document.querySelectorAll('[data-tip]');
    for (var i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener('mouseenter', this.showTooltip);
      targetArray[i].removeEventListener('mousemove', this.updateTooltip);
      targetArray[i].removeEventListener('mouseleave', this.hideTooltip);
    }
  };

  ReactTooltip.prototype._updatePosition = function _updatePosition() {
    var node = _react.findDOMNode(this);

    var tipWidth = node.clientWidth;
    var tipHeight = node.clientHeight;
    var offset = { x: 0, y: 0 };
    var effect = this.state.effect;

    if (effect === 'float') {
      if (this.state.place === 'top') {
        offset.x = -(tipWidth / 2);
        offset.y = -50;
      } else if (this.state.place === 'bottom') {
        offset.x = -(tipWidth / 2);
        offset.y = 30;
      } else if (this.state.place === 'left') {
        offset.x = -(tipWidth + 15);
        offset.y = -(tipHeight / 2);
      } else if (this.state.place === 'right') {
        offset.x = 10;
        offset.y = -(tipHeight / 2);
      }
    }
    var xPosition = 0;
    var yPosition = 0;
    var position = this.state.position;

    if (Object.prototype.toString.apply(position) === '[object String]') {
      position = JSON.parse(position.toString().replace(/\'/g, '\"'));
    }
    for (var key in position) {
      if (key === 'top') {
        yPosition -= parseInt(position[key], 10);
      } else if (key === 'bottom') {
        yPosition += parseInt(position[key], 10);
      } else if (key === 'left') {
        xPosition -= parseInt(position[key], 10);
      } else if (key === 'right') {
        xPosition += parseInt(position[key], 10);
      }
    }

    node.style.left = this.state.x + offset.x + xPosition + 'px';
    node.style.top = this.state.y + offset.y + yPosition + 'px';
  };

  ReactTooltip.prototype.showTooltip = function showTooltip(e) {
    var originTooltip = e.target.getAttribute('data-tip');
    // Detect multiline
    var regexp = /<br\s*\/?>/;
    var multiline = e.target.getAttribute('data-multiline') ? e.target.getAttribute('data-multiline') : this.props.multiline ? this.props.multiline : false;
    var tooltipText = undefined;
    var multilineCount = 0;
    if (!multiline || multiline === 'false' || !regexp.test(originTooltip)) {
      tooltipText = originTooltip;
    } else {
      tooltipText = originTooltip.split(regexp).map(function (d, i) {
        multilineCount += 1;
        return _react2['default'].createElement(
          'span',
          { key: i, className: 'multi-line' },
          d
        );
      });
    }
    this.setState({
      placeholder: tooltipText,
      multilineCount: multilineCount,
      place: e.target.getAttribute('data-place') ? e.target.getAttribute('data-place') : this.props.place ? this.props.place : 'top',
      type: e.target.getAttribute('data-type') ? e.target.getAttribute('data-type') : this.props.type ? this.props.type : 'dark',
      effect: e.target.getAttribute('data-effect') ? e.target.getAttribute('data-effect') : this.props.effect ? this.props.effect : 'float',
      position: e.target.getAttribute('data-position') ? e.target.getAttribute('data-position') : this.props.position ? this.props.position : {},
      multiline: multiline
    });
    this.updateTooltip(e);
  };

  ReactTooltip.prototype.updateTooltip = function updateTooltip(e) {
    if (this.trim(this.state.placeholder).length > 0) {
      var _state = this.state;
      var multilineCount = _state.multilineCount;
      var place = _state.place;

      if (this.state.effect === 'float') {
        var offsetY = !multilineCount ? e.clientY : place !== 'top' ? e.clientY : e.clientY - multilineCount * 14.5;
        this.setState({
          show: true,
          x: e.clientX,
          y: offsetY
        });
      } else if (this.state.effect === 'solid') {
        var boundingClientRect = e.target.getBoundingClientRect();
        var targetTop = boundingClientRect.top;
        var targetLeft = boundingClientRect.left;
        var node = _react2['default'].findDOMNode(this);
        var tipWidth = node.clientWidth;
        var tipHeight = node.clientHeight;
        var targetWidth = e.target.clientWidth;
        var targetHeight = e.target.clientHeight;
        var x = undefined;
        var y = undefined;
        if (place === 'top') {
          x = targetLeft - tipWidth / 2 + targetWidth / 2;
          y = targetTop - tipHeight - 8;
        } else if (place === 'bottom') {
          x = targetLeft - tipWidth / 2 + targetWidth / 2;
          y = targetTop + targetHeight + 8;
        } else if (place === 'left') {
          x = targetLeft - tipWidth - 6;
          y = targetTop + targetHeight / 2 - tipHeight / 2;
        } else if (place === 'right') {
          x = targetLeft + targetWidth + 6;
          y = targetTop + targetHeight / 2 - tipHeight / 2;
        }
        this.setState({
          show: true,
          x: this.state.x === 'NONE' ? x : this.state.x,
          y: this.state.y === 'NONE' ? y : this.state.y
        });
      }
    }
  };

  ReactTooltip.prototype.hideTooltip = function hideTooltip() {
    this.setState({
      show: false,
      x: 'NONE',
      y: 'NONE'
    });
  };

  ReactTooltip.prototype.render = function render() {
    var tooltipClass = _classnames2['default']('__react_component_tooltip', { 'show': this.state.show }, { 'place-top': this.state.place === 'top' }, { 'place-bottom': this.state.place === 'bottom' }, { 'place-left': this.state.place === 'left' }, { 'place-right': this.state.place === 'right' }, { 'type-dark': this.state.type === 'dark' }, { 'type-success': this.state.type === 'success' }, { 'type-warning': this.state.type === 'warning' }, { 'type-error': this.state.type === 'error' }, { 'type-info': this.state.type === 'info' }, { 'type-light': this.state.type === 'light' });

    if (!document.getElementsByTagName('head')[0].querySelector('style[id="react-tooltip"]')) {
      var tag = document.createElement('style');
      tag.id = 'react-tooltip';
      tag.innerHTML = _style2['default'];
      document.getElementsByTagName('head')[0].appendChild(tag);
    }

    return _react2['default'].createElement(
      'span',
      { className: tooltipClass, 'data-id': 'tooltip' },
      this.state.placeholder
    );
  };

  ReactTooltip.prototype.trim = function trim(string) {
    if (Object.prototype.toString.call(string) !== '[object String]') {
      return string;
    }
    var newString = string.split('');
    var firstCount = 0;
    var lastCount = 0;
    for (var i = 0; i < string.length; i++) {
      if (string[i] !== ' ') {
        break;
      }
      firstCount++;
    }
    for (var i = string.length - 1; i >= 0; i--) {
      if (string[i] !== ' ') {
        break;
      }
      lastCount++;
    }
    newString.splice(0, firstCount);
    newString.splice(-lastCount, lastCount);
    return newString.join('');
  };

  return ReactTooltip;
})(_react.Component);

exports['default'] = ReactTooltip;

ReactTooltip.propTypes = {
  place: _react.PropTypes.string,
  type: _react.PropTypes.string,
  effect: _react.PropTypes.string,
  position: _react.PropTypes.object,
  multiline: _react.PropTypes.bool
};
module.exports = exports['default'];
