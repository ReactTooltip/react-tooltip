'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var ReactTooltip = (function (_Component) {
  _inherits(ReactTooltip, _Component);

  /**
   * Class method
   * @see ReactTooltip.hide() && ReactTooltup.rebuild()
   */

  ReactTooltip.hide = function hide() {
    window.dispatchEvent(new window.Event('__react_tooltip_hide_event'));
  };

  ReactTooltip.rebuild = function rebuild() {
    window.dispatchEvent(new window.Event('__react_tooltip_rebuild_event'));
  };

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
    this._bind('showTooltip', 'updateTooltip', 'hideTooltip', 'checkStatus');
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
      offset: {},
      extraClass: '',
      html: false,
      delayHide: 0,
      event: props.event || null
    };
  }

  /* Bind this with method */

  ReactTooltip.prototype._bind = function _bind() {
    var _this = this;

    for (var _len = arguments.length, handlers = Array(_len), _key = 0; _key < _len; _key++) {
      handlers[_key] = arguments[_key];
    }

    handlers.forEach(function (handler) {
      return _this[handler] = _this[handler].bind(_this);
    });
  };

  ReactTooltip.prototype.componentDidMount = function componentDidMount() {
    this.bindListener();
    this.setStyleHeader();
    /* Add window event listener for hide and rebuild */
    window.removeEventListener('__react_tooltip_hide_event', this.globalHide);
    window.addEventListener('__react_tooltip_hide_event', this.globalHide.bind(this), false);

    window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild);
    window.addEventListener('__react_tooltip_rebuild_event', this.globalRebuild.bind(this), false);
  };

  ReactTooltip.prototype.componentWillUpdate = function componentWillUpdate() {
    this.unbindListener();
  };

  ReactTooltip.prototype.componentDidUpdate = function componentDidUpdate() {
    this.updatePosition();
    this.bindListener();
  };

  ReactTooltip.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unbindListener();
    this.mount = false;
    window.removeEventListener('__react_tooltip_hide_event', this.globalHide);
    window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild);
  };

  ReactTooltip.prototype.bindListener = function bindListener() {
    var id = this.props.id;

    var targetArray = undefined;

    if (id === undefined) {
      targetArray = document.querySelectorAll('[data-tip]:not([data-for])');
    } else {
      targetArray = document.querySelectorAll('[data-tip][data-for="' + id + '"]');
    }

    var dataEvent = undefined;
    for (var i = 0; i < targetArray.length; i++) {
      targetArray[i].setAttribute('currentItem', 'false');
      dataEvent = this.state.event || targetArray[i].getAttribute('data-event');
      if (dataEvent) {
        targetArray[i].removeEventListener(dataEvent, this.checkStatus);
        targetArray[i].addEventListener(dataEvent, this.checkStatus, false);
      } else {
        targetArray[i].removeEventListener('mouseenter', this.showTooltip);
        targetArray[i].addEventListener('mouseenter', this.showTooltip, false);

        if (this.state.effect === 'float') {
          targetArray[i].removeEventListener('mousemove', this.updateTooltip);
          targetArray[i].addEventListener('mousemove', this.updateTooltip, false);
        }

        targetArray[i].removeEventListener('mouseleave', this.hideTooltip);
        targetArray[i].addEventListener('mouseleave', this.hideTooltip, false);
      }
    }
  };

  ReactTooltip.prototype.checkStatus = function checkStatus(e) {
    if (this.state.show && e.currentTarget.getAttribute('currentItem') === 'true') {
      this.hideTooltip(e);
    } else {
      e.currentTarget.setAttribute('currentItem', 'true');
      this.showTooltip(e);
      this.setUntargetItems(e.currentTarget);
    }
  };

  ReactTooltip.prototype.setUntargetItems = function setUntargetItems(currentTarget) {
    var id = this.props.id;

    var targetArray = undefined;

    if (id === undefined) {
      targetArray = document.querySelectorAll('[data-tip]:not([data-for])');
    } else {
      targetArray = document.querySelectorAll('[data-tip][data-for="' + id + '"]');
    }

    for (var i = 0; i < targetArray.length; i++) {
      if (currentTarget !== targetArray[i]) {
        targetArray[i].setAttribute('currentItem', 'false');
      } else {
        targetArray[i].setAttribute('currentItem', 'true');
      }
    }
  };

  ReactTooltip.prototype.unbindListener = function unbindListener() {
    var targetArray = document.querySelectorAll('[data-tip]');
    var dataEvent = undefined;

    for (var i = 0; i < targetArray.length; i++) {
      dataEvent = this.state.event || targetArray[i].getAttribute('data-event');
      if (dataEvent) {
        targetArray[i].removeEventListener(dataEvent, this.checkStatus);
      } else {
        targetArray[i].removeEventListener('mouseenter', this.showTooltip);
        targetArray[i].removeEventListener('mousemove', this.updateTooltip);
        targetArray[i].removeEventListener('mouseleave', this.hideTooltip);
      }
    }
  };

  /**
   * When mouse enter, show update
   */

  ReactTooltip.prototype.showTooltip = function showTooltip(e) {
    var originTooltip = e.currentTarget.getAttribute('data-tip');
    /* Detect multiline */
    var regexp = /<br\s*\/?>/;
    var multiline = e.currentTarget.getAttribute('data-multiline') ? e.currentTarget.getAttribute('data-multiline') : this.props.multiline ? this.props.multiline : false;
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
    /* Define extra class */
    var extraClass = e.currentTarget.getAttribute('data-class') ? e.currentTarget.getAttribute('data-class') : '';
    extraClass = this.props['class'] ? this.props['class'] + ' ' + extraClass : extraClass;
    this.setState({
      placeholder: tooltipText,
      multilineCount: multilineCount,
      place: e.currentTarget.getAttribute('data-place') ? e.currentTarget.getAttribute('data-place') : this.props.place ? this.props.place : 'top',
      type: e.currentTarget.getAttribute('data-type') ? e.currentTarget.getAttribute('data-type') : this.props.type ? this.props.type : 'dark',
      effect: e.currentTarget.getAttribute('data-effect') ? e.currentTarget.getAttribute('data-effect') : this.props.effect ? this.props.effect : 'float',
      offset: e.currentTarget.getAttribute('data-offset') ? e.currentTarget.getAttribute('data-offset') : this.props.offset ? this.props.offset : {},
      html: e.currentTarget.getAttribute('data-html') ? e.currentTarget.getAttribute('data-html') : this.props.html ? this.props.html : false,
      delayHide: e.currentTarget.getAttribute('data-delay-hide') ? e.currentTarget.getAttribute('data-delay-hide') : this.props.delayHide ? this.props.delayHide : 0,
      extraClass: extraClass,
      multiline: multiline
    });
    this.updateTooltip(e);
  };

  /**
   * When mouse hover, updatetooltip
   */

  ReactTooltip.prototype.updateTooltip = function updateTooltip(e) {
    if (this.trim(this.state.placeholder).length > 0) {
      var place = this.state.place;

      var node = _reactDom.findDOMNode(this);
      if (this.state.effect === 'float') {
        // const offsetY = e.clientY
        this.setState({
          show: true,
          x: e.clientX,
          y: e.clientY
        });
      } else if (this.state.effect === 'solid') {
        var boundingClientRect = e.currentTarget.getBoundingClientRect();
        var targetTop = boundingClientRect.top;
        var targetLeft = boundingClientRect.left;
        var tipWidth = node.clientWidth;
        var tipHeight = node.clientHeight;
        var targetWidth = e.currentTarget.clientWidth;
        var targetHeight = e.currentTarget.clientHeight;
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
          x: x,
          y: y
        });
      }
    }
  };

  /**
   * When mouse leave, hide tooltip
   */

  ReactTooltip.prototype.hideTooltip = function hideTooltip() {
    var _this2 = this;

    var delayHide = this.state.delayHide;

    setTimeout(function () {
      _this2.setState({
        show: false
      });
    }, parseInt(delayHide, 10));
  };

  /**
   * Execute in componentDidUpdate, used in the render function, move out for server rending
   */

  ReactTooltip.prototype.updatePosition = function updatePosition() {
    var node = _reactDom.findDOMNode(this);

    var tipWidth = node.clientWidth;
    var tipHeight = node.clientHeight;
    var _state = this.state;
    var effect = _state.effect;
    var place = _state.place;
    var offset = _state.offset;

    var offsetFromEffect = {};

    if (effect === 'float') {
      offsetFromEffect.top = {
        x: -(tipWidth / 2),
        y: -tipHeight
      };
      offsetFromEffect.bottom = {
        x: -(tipWidth / 2),
        y: 15
      };
      offsetFromEffect.left = {
        x: -(tipWidth + 15),
        y: -(tipHeight / 2)
      };
      offsetFromEffect.right = {
        x: 10,
        y: -(tipHeight / 2)
      };
    }
    var xPosition = 0;
    var yPosition = 0;

    if (Object.prototype.toString.apply(offset) === '[object String]') {
      offset = JSON.parse(offset.toString().replace(/\'/g, '\"'));
    }
    for (var key in offset) {
      if (key === 'top') {
        yPosition -= parseInt(offset[key], 10);
      } else if (key === 'bottom') {
        yPosition += parseInt(offset[key], 10);
      } else if (key === 'left') {
        xPosition -= parseInt(offset[key], 10);
      } else if (key === 'right') {
        xPosition += parseInt(offset[key], 10);
      }
    }
    /* When tooltip over the screen */
    var offsetEffectX = effect === 'solid' ? 0 : place ? offsetFromEffect[place].x : 0;
    var offsetEffectY = effect === 'solid' ? 0 : place ? offsetFromEffect[place].y : 0;
    var styleLeft = this.state.x + offsetEffectX + xPosition;
    var styleTop = this.state.y + offsetEffectY + yPosition;
    var windoWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    /* Solid use this method will get Uncaught RangeError: Maximum call stack size exceeded */
    if (effect === 'float') {
      if (styleLeft < 0 && this.state.x + offsetFromEffect['right'].x + xPosition <= windoWidth) {
        this.setState({
          place: 'right'
        });
        return;
      } else if (styleLeft + tipWidth > windoWidth && this.state.x + offsetFromEffect['left'].x + xPosition >= 0) {
        this.setState({
          place: 'left'
        });
        return;
      } else if (styleTop < 0 && this.state.y + offsetFromEffect['bottom'].y + yPosition + tipHeight < windowHeight) {
        this.setState({
          place: 'bottom'
        });
        return;
      } else if (styleTop + tipHeight >= windowHeight && this.state.y + offsetFromEffect['top'].y + yPosition >= 0) {
        this.setState({
          place: 'top'
        });
        return;
      }
    }

    node.style.left = styleLeft + 'px';
    node.style.top = styleTop + 'px';
  };

  /**
   * Set style tag in header
   * Insert style by this way
   */

  ReactTooltip.prototype.setStyleHeader = function setStyleHeader() {
    if (!document.getElementsByTagName('head')[0].querySelector('style[id="react-tooltip"]')) {
      var tag = document.createElement('style');
      tag.id = 'react-tooltip';
      tag.innerHTML = _style2['default'];
      document.getElementsByTagName('head')[0].appendChild(tag);
    }
  };

  ReactTooltip.prototype.render = function render() {
    var _state2 = this.state;
    var placeholder = _state2.placeholder;
    var extraClass = _state2.extraClass;
    var html = _state2.html;

    var tooltipClass = _classnames2['default']('__react_component_tooltip', { 'show': this.state.show }, { 'place-top': this.state.place === 'top' }, { 'place-bottom': this.state.place === 'bottom' }, { 'place-left': this.state.place === 'left' }, { 'place-right': this.state.place === 'right' }, { 'type-dark': this.state.type === 'dark' }, { 'type-success': this.state.type === 'success' }, { 'type-warning': this.state.type === 'warning' }, { 'type-error': this.state.type === 'error' }, { 'type-info': this.state.type === 'info' }, { 'type-light': this.state.type === 'light' });

    if (html) {
      return _react2['default'].createElement('div', { className: tooltipClass + ' ' + extraClass, 'data-id': 'tooltip', dangerouslySetInnerHTML: { __html: placeholder } });
    } else {
      var content = this.props.children ? this.props.children : placeholder;
      return _react2['default'].createElement(
        'div',
        { className: tooltipClass + ' ' + extraClass, 'data-id': 'tooltip' },
        content
      );
    }
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
  children: _react.PropTypes.any,
  place: _react.PropTypes.string,
  type: _react.PropTypes.string,
  effect: _react.PropTypes.string,
  offset: _react.PropTypes.object,
  multiline: _react.PropTypes.bool,
  'class': _react.PropTypes.string,
  id: _react.PropTypes.string,
  html: _react.PropTypes.bool,
  delayHide: _react.PropTypes.number,
  event: _react.PropTypes.any
};
module.exports = exports['default'];
