(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactTooltip = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
var detectBrowser = require('./lib/detectBrowser');

module.exports = detectBrowser(navigator.userAgent);

},{"./lib/detectBrowser":3}],3:[function(require,module,exports){
module.exports = function detectBrowser(userAgentString) {
  var browsers = [
    [ 'edge', /Edge\/([0-9\._]+)/ ],
    [ 'chrome', /Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
    [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
    [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/ ],
    [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
    [ 'ie', /MSIE\s(7\.0)/ ],
    [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
    [ 'android', /Android\s([0-9\.]+)/ ],
    [ 'ios', /iPad.*Version\/([0-9\._]+)/ ],
    [ 'ios',  /iPhone.*Version\/([0-9\._]+)/ ],
    [ 'safari', /Version\/([0-9\._]+).*Safari/ ]
  ];

  var i = 0, mapped =[];
  for (i = 0; i < browsers.length; i++) {
    browsers[i] = createMatch(browsers[i]);
    if (isMatch(browsers[i])) {
      mapped.push(browsers[i]);
    }
  }

  var match = mapped[0];
  var parts = match && match[3].split(/[._]/).slice(0,3);

  while (parts && parts.length < 3) {
    parts.push('0');
  }

  function createMatch(pair) {
    return pair.concat(pair[1].exec(userAgentString));
  }

  function isMatch(pair) {
    return !!pair[2];
  }

  // return the name and version
  return {
    name: match && match[0],
    version: parts && parts.join('.'),
  };
};

},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _reactDom = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _detectBrowser = require('detect-browser');

var _detectBrowser2 = _interopRequireDefault(_detectBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactTooltip = function (_Component) {
  _inherits(ReactTooltip, _Component);

  _createClass(ReactTooltip, [{
    key: 'globalHide',
    value: function globalHide() {
      if (this.mount) {
        this.hideTooltip();
      }
    }
  }, {
    key: 'globalRebuild',
    value: function globalRebuild() {
      if (this.mount) {
        this.unbindListener();
        this.bindListener();
      }
    }
  }], [{
    key: 'hide',

    /**
     * Class method
     * @see ReactTooltip.hide() && ReactTooltup.rebuild()
     */
    value: function hide() {
      /**
       * Check for ie
       * @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
       */
      if (typeof window.Event === 'function') {
        window.dispatchEvent(new window.Event('__react_tooltip_hide_event'));
      } else {
        var event = document.createEvent('Event');
        event.initEvent('__react_tooltip_hide_event', false, true);
        window.dispatchEvent(event);
      }
    }
  }, {
    key: 'rebuild',
    value: function rebuild() {
      if (typeof window.Event === 'function') {
        window.dispatchEvent(new window.Event('__react_tooltip_rebuild_event'));
      } else {
        var event = document.createEvent('Event');
        event.initEvent('__react_tooltip_rebuild_event', false, true);
        window.dispatchEvent(event);
      }
    }
  }]);

  function ReactTooltip(props) {
    _classCallCheck(this, ReactTooltip);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactTooltip).call(this, props));

    _this._bind('showTooltip', 'updateTooltip', 'hideTooltip', 'checkStatus', 'onWindowResize', 'bindClickListener', 'globalHide', 'globalRebuild');
    _this.mount = true;
    _this.state = {
      show: false,
      border: false,
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
      delayShow: 0,
      event: props.event || null,
      eventOff: props.eventOff || null,
      isCapture: props.isCapture || false
    };
    _this.delayShowLoop = null;
    _this.delayHideLoop = null;
    return _this;
  }

  /* Bind this with method */


  _createClass(ReactTooltip, [{
    key: '_bind',
    value: function _bind() {
      var _this2 = this;

      for (var _len = arguments.length, handlers = Array(_len), _key = 0; _key < _len; _key++) {
        handlers[_key] = arguments[_key];
      }

      handlers.forEach(function (handler) {
        return _this2[handler] = _this2[handler].bind(_this2);
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.bindListener();
      this.setStyleHeader();
      /* Add window event listener for hide and rebuild */
      window.removeEventListener('__react_tooltip_hide_event', this.globalHide);
      window.addEventListener('__react_tooltip_hide_event', this.globalHide, false);

      window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild);
      window.addEventListener('__react_tooltip_rebuild_event', this.globalRebuild, false);
      /* Add listener on window resize  */
      window.removeEventListener('resize', this.onWindowResize);
      window.addEventListener('resize', this.onWindowResize, false);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      this.unbindListener();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updatePosition();
      this.bindListener();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.delayShowLoop);
      clearTimeout(this.delayHideLoop);
      this.unbindListener();
      this.removeScrollListener();
      this.mount = false;
      window.removeEventListener('__react_tooltip_hide_event', this.globalHide);
      window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild);
      window.removeEventListener('resize', this.onWindowResize);
    }

    /* TODO: optimize, bind has been trigger too many times */

  }, {
    key: 'bindListener',
    value: function bindListener() {
      var targetArray = this.getTargetArray();

      var dataEvent = void 0;
      var dataEventOff = void 0;
      for (var i = 0; i < targetArray.length; i++) {
        if (targetArray[i].getAttribute('currentItem') === null) {
          targetArray[i].setAttribute('currentItem', 'false');
        }
        dataEvent = this.state.event || targetArray[i].getAttribute('data-event');
        if (dataEvent) {
          // if off event is specified, we will show tip on data-event and hide it on data-event-off
          dataEventOff = this.state.eventOff || targetArray[i].getAttribute('data-event-off');

          targetArray[i].removeEventListener(dataEvent, this.checkStatus);
          targetArray[i].addEventListener(dataEvent, this.checkStatus, false);
          if (dataEventOff) {
            targetArray[i].removeEventListener(dataEventOff, this.hideTooltip);
            targetArray[i].addEventListener(dataEventOff, this.hideTooltip, false);
          }
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
    }
  }, {
    key: 'unbindListener',
    value: function unbindListener() {
      var targetArray = document.querySelectorAll('[data-tip]');
      var dataEvent = void 0;

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
    }

    /**
     * Get all tooltip targets
     */

  }, {
    key: 'getTargetArray',
    value: function getTargetArray() {
      var id = this.props.id;

      var targetArray = void 0;

      if (id === undefined) {
        targetArray = document.querySelectorAll('[data-tip]:not([data-for])');
      } else {
        targetArray = document.querySelectorAll('[data-tip][data-for="' + id + '"]');
      }

      return targetArray;
    }

    /**
     * listener on window resize
     */

  }, {
    key: 'onWindowResize',
    value: function onWindowResize() {
      if (!this.mount) return;
      var targetArray = this.getTargetArray();

      for (var i = 0; i < targetArray.length; i++) {
        if (targetArray[i].getAttribute('currentItem') === 'true') {
          // todo: timer for performance

          var _getPosition = this.getPosition(targetArray[i]);

          var x = _getPosition.x;
          var y = _getPosition.y;

          _reactDom2.default.findDOMNode(this).style.left = x + 'px';
          _reactDom2.default.findDOMNode(this).style.top = y + 'px';
          /* this.setState({
           x,
           y
           }) */
        }
      }
    }

    /**
     * Used in customer event
     */

  }, {
    key: 'checkStatus',
    value: function checkStatus(e) {
      var show = this.state.show;

      var isCapture = void 0;

      if (e.currentTarget.getAttribute('data-iscapture')) {
        isCapture = e.currentTarget.getAttribute('data-iscapture') === 'true';
      } else {
        isCapture = this.state.isCapture;
      }

      if (!isCapture) e.stopPropagation();
      if (show && e.currentTarget.getAttribute('currentItem') === 'true') {
        this.hideTooltip(e);
      } else {
        e.currentTarget.setAttribute('currentItem', 'true');
        /* when click other place, the tooltip should be removed */
        window.removeEventListener('click', this.bindClickListener);
        window.addEventListener('click', this.bindClickListener, isCapture);

        this.showTooltip(e);
        this.setUntargetItems(e.currentTarget);
      }
    }
  }, {
    key: 'setUntargetItems',
    value: function setUntargetItems(currentTarget) {
      var targetArray = this.getTargetArray();
      for (var i = 0; i < targetArray.length; i++) {
        if (currentTarget !== targetArray[i]) {
          targetArray[i].setAttribute('currentItem', 'false');
        } else {
          targetArray[i].setAttribute('currentItem', 'true');
        }
      }
    }
  }, {
    key: 'bindClickListener',
    value: function bindClickListener() {
      this.globalHide();
      window.removeEventListener('click', this.bindClickListener);
    }

    /**
     * When mouse enter, show update
     */

  }, {
    key: 'showTooltip',
    value: function showTooltip(e) {
      var originTooltip = e.currentTarget.getAttribute('data-tip');
      /* Detect multiline */
      var regexp = /<br\s*\/?>/;
      var multiline = e.currentTarget.getAttribute('data-multiline') ? e.currentTarget.getAttribute('data-multiline') : this.props.multiline ? this.props.multiline : false;
      var tooltipText = void 0;
      var multilineCount = 0;
      if (!multiline || multiline === 'false' || !regexp.test(originTooltip)) {
        tooltipText = originTooltip;
      } else {
        tooltipText = originTooltip.split(regexp).map(function (d, i) {
          multilineCount += 1;
          return _react2.default.createElement(
            'span',
            { key: i, className: 'multi-line' },
            d
          );
        });
      }
      /* Define extra class */
      var extraClass = e.currentTarget.getAttribute('data-class') ? e.currentTarget.getAttribute('data-class') : '';
      extraClass = this.props.class ? this.props.class + ' ' + extraClass : extraClass;
      this.setState({
        placeholder: tooltipText,
        multilineCount: multilineCount,
        place: e.currentTarget.getAttribute('data-place') || this.props.place || 'top',
        type: e.currentTarget.getAttribute('data-type') || this.props.type || 'dark',
        effect: e.currentTarget.getAttribute('data-effect') || this.props.effect || 'float',
        offset: e.currentTarget.getAttribute('data-offset') || this.props.offset || {},
        html: e.currentTarget.getAttribute('data-html') === 'true' || this.props.html || false,
        delayShow: e.currentTarget.getAttribute('data-delay-show') || this.props.delayShow || 0,
        delayHide: e.currentTarget.getAttribute('data-delay-hide') || this.props.delayHide || 0,
        border: e.currentTarget.getAttribute('data-border') === 'true' || this.props.border || false,
        extraClass: extraClass,
        multiline: multiline
      });

      this.addScrollListener();
      this.updateTooltip(e);
    }

    /**
     * When mouse hover, updatetooltip
     */

  }, {
    key: 'updateTooltip',
    value: function updateTooltip(e) {
      var _this3 = this;

      var _state = this.state;
      var delayShow = _state.delayShow;
      var show = _state.show;

      var delayTime = show ? 0 : parseInt(delayShow, 10);
      var eventTarget = e.currentTarget;

      clearTimeout(this.delayShowLoop);
      this.delayShowLoop = setTimeout(function () {
        if (_this3.trim(_this3.state.placeholder).length > 0) {
          if (_this3.state.effect === 'float') {
            _this3.setState({
              show: true,
              x: e.clientX,
              y: e.clientY
            });
          } else if (_this3.state.effect === 'solid') {
            var _getPosition2 = _this3.getPosition(eventTarget);

            var x = _getPosition2.x;
            var y = _getPosition2.y;

            _this3.setState({
              show: true,
              x: x,
              y: y
            });
          }
        }
      }, delayTime);
    }

    /**
     * When mouse leave, hide tooltip
     */

  }, {
    key: 'hideTooltip',
    value: function hideTooltip() {
      var _this4 = this;

      var delayHide = this.state.delayHide;

      clearTimeout(this.delayShowLoop);
      clearTimeout(this.delayHideLoop);
      this.delayHideLoop = setTimeout(function () {
        _this4.setState({
          show: false
        });
        _this4.removeScrollListener();
      }, parseInt(delayHide, 10));
    }

    /**
     * Add scroll eventlistener when tooltip show
     * or tooltip will always existed
     */

  }, {
    key: 'addScrollListener',
    value: function addScrollListener() {
      window.addEventListener('scroll', this.hideTooltip);
    }
  }, {
    key: 'removeScrollListener',
    value: function removeScrollListener() {
      window.removeEventListener('scroll', this.hideTooltip);
    }

    /**
     * Get tooltip poisition by current target
     */

  }, {
    key: 'getPosition',
    value: function getPosition(currentTarget) {
      var _this5 = this;

      var place = this.state.place;

      var node = _reactDom2.default.findDOMNode(this);
      var boundingClientRect = currentTarget.getBoundingClientRect();
      var targetTop = boundingClientRect.top;
      var targetLeft = boundingClientRect.left;
      var tipWidth = node.clientWidth;
      var tipHeight = node.clientHeight;
      var targetWidth = currentTarget.clientWidth;
      var targetHeight = currentTarget.clientHeight;
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var x = void 0;
      var y = void 0;
      var defaultTopY = targetTop - tipHeight - 8;
      var defaultBottomY = targetTop + targetHeight + 8;
      var defaultLeftX = targetLeft - tipWidth - 6;
      var defaultRightX = targetLeft + targetWidth + 6;

      var parentTop = 0;
      var parentLeft = 0;
      var currentParent = currentTarget.parentElement;

      while (currentParent) {
        if (currentParent.style.transform.length > 0) {
          break;
        }
        currentParent = currentParent.parentElement;
      }

      if (currentParent) {
        // If browser is IE (in standards mode...) with fixed/absolute parents, we don't set the parent origin.
        // && currentParent.style.position !== 'absolute') ???
        if (_detectBrowser2.default.name !== 'ie' || currentParent.style.position !== 'fixed') {
          parentTop = currentParent.getBoundingClientRect().top;
          parentLeft = currentParent.getBoundingClientRect().left;
        }
      }

      var outsideTop = function outsideTop() {
        return defaultTopY - 10 < 0;
      };

      var outsideBottom = function outsideBottom() {
        return targetTop + targetHeight + tipHeight + 25 > windowHeight;
      };

      var outsideLeft = function outsideLeft() {
        return defaultLeftX - 10 < 0;
      };

      var outsideRight = function outsideRight() {
        return targetLeft + targetWidth + tipWidth + 25 > windowWidth;
      };

      var getTopPositionY = function getTopPositionY() {
        if (outsideTop(defaultTopY) && !outsideBottom()) {
          _this5.setState({
            place: 'bottom'
          });
          return defaultBottomY;
        }

        return defaultTopY;
      };

      var getBottomPositionY = function getBottomPositionY() {
        if (outsideBottom() && !outsideTop()) {
          _this5.setState({
            place: 'top'
          });
          return defaultTopY;
        }

        return defaultBottomY;
      };

      var getLeftPositionX = function getLeftPositionX() {
        if (outsideLeft() && !outsideRight()) {
          _this5.setState({
            place: 'right'
          });
          return defaultRightX;
        }

        return defaultLeftX;
      };

      var getRightPositionX = function getRightPositionX() {
        if (outsideRight() && !outsideLeft()) {
          _this5.setState({
            place: 'left'
          });
          return defaultLeftX;
        }

        return defaultRightX;
      };

      if (place === 'top') {
        x = targetLeft - tipWidth / 2 + targetWidth / 2 - parentLeft;
        y = getTopPositionY() - parentTop;
      } else if (place === 'bottom') {
        x = targetLeft - tipWidth / 2 + targetWidth / 2 - parentLeft;
        y = getBottomPositionY() - parentTop;
      } else if (place === 'left') {
        x = getLeftPositionX() - parentLeft;
        y = targetTop + targetHeight / 2 - tipHeight / 2 - parentTop;
      } else if (place === 'right') {
        x = getRightPositionX() - parentLeft;
        y = targetTop + targetHeight / 2 - tipHeight / 2 - parentTop;
      }

      return { x: x, y: y };
    }

    /**
     * Execute in componentDidUpdate, can't put this into render() to support server rendering
     */

  }, {
    key: 'updatePosition',
    value: function updatePosition() {
      var node = _reactDom2.default.findDOMNode(this);

      var tipWidth = node.clientWidth;
      var tipHeight = node.clientHeight;
      var _state2 = this.state;
      var effect = _state2.effect;
      var place = _state2.place;
      var offset = _state2.offset;

      var offsetFromEffect = {};

      /**
       * List all situations for different placement,
       * then tooltip can judge switch to which side if window space is not enough
       * @note only support for float at the moment
       */
      var placements = ['top', 'bottom', 'left', 'right'];
      placements.forEach(function (key) {
        offsetFromEffect[key] = { x: 0, y: 0 };
      });

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

      /* If user set offset attribute, we have to consider it into out position calculating */
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

      /* If our tooltip goes outside the window we want to try and change its place to be inside the window */
      var x = this.state.x;
      var y = this.state.y;
      var windoWidth = window.innerWidth;
      var windowHeight = window.innerHeight;

      var getStyleLeft = function getStyleLeft(place) {
        var offsetEffectX = effect === 'solid' ? 0 : place ? offsetFromEffect[place].x : 0;
        return x + offsetEffectX + xPosition;
      };
      var getStyleTop = function getStyleTop(place) {
        var offsetEffectY = effect === 'solid' ? 0 : place ? offsetFromEffect[place].y : 0;
        return y + offsetEffectY + yPosition;
      };

      var outsideLeft = function outsideLeft(place) {
        var styleLeft = getStyleLeft(place);
        return styleLeft < 0 && x + offsetFromEffect['right'].x + xPosition <= windoWidth;
      };
      var outsideRight = function outsideRight(place) {
        var styleLeft = getStyleLeft(place);
        return styleLeft + tipWidth > windoWidth && x + offsetFromEffect['left'].x + xPosition >= 0;
      };
      var outsideTop = function outsideTop(place) {
        var styleTop = getStyleTop(place);
        return styleTop < 0 && y + offsetFromEffect['bottom'].y + yPosition + tipHeight < windowHeight;
      };
      var outsideBottom = function outsideBottom(place) {
        var styleTop = getStyleTop(place);
        return styleTop + tipHeight >= windowHeight && y + offsetFromEffect['top'].y + yPosition >= 0;
      };

      /* We want to make sure the place we switch to will not go outside either */
      var outside = function outside(place) {
        return outsideTop(place) || outsideRight(place) || outsideBottom(place) || outsideLeft(place);
      };

      /* We check each side and switch if the new place will be in bounds */
      if (outsideLeft(place)) {
        if (!outside('right')) {
          this.setState({
            place: 'right'
          });
          return;
        }
      } else if (outsideRight(place)) {
        if (!outside('left')) {
          this.setState({
            place: 'left'
          });
          return;
        }
      } else if (outsideTop(place)) {
        if (!outside('bottom')) {
          this.setState({
            place: 'bottom'
          });
          return;
        }
      } else if (outsideBottom(place)) {
        if (!outside('top')) {
          this.setState({
            place: 'top'
          });
          return;
        }
      }

      node.style.left = getStyleLeft(place) + 'px';
      node.style.top = getStyleTop(place) + 'px';
    }

    /**
     * Set style tag in header
     * Insert style by this way
     */

  }, {
    key: 'setStyleHeader',
    value: function setStyleHeader() {
      if (!document.getElementsByTagName('head')[0].querySelector('style[id="react-tooltip"]')) {
        var tag = document.createElement('style');
        tag.id = 'react-tooltip';
        tag.innerHTML = _style2.default;
        document.getElementsByTagName('head')[0].appendChild(tag);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state3 = this.state;
      var placeholder = _state3.placeholder;
      var extraClass = _state3.extraClass;
      var html = _state3.html;

      var tooltipClass = (0, _classnames2.default)('__react_component_tooltip', { 'show': this.state.show }, { 'border': this.state.border }, { 'place-top': this.state.place === 'top' }, { 'place-bottom': this.state.place === 'bottom' }, { 'place-left': this.state.place === 'left' }, { 'place-right': this.state.place === 'right' }, { 'type-dark': this.state.type === 'dark' }, { 'type-success': this.state.type === 'success' }, { 'type-warning': this.state.type === 'warning' }, { 'type-error': this.state.type === 'error' }, { 'type-info': this.state.type === 'info' }, { 'type-light': this.state.type === 'light' });

      if (html) {
        return _react2.default.createElement('div', { className: tooltipClass + ' ' + extraClass, 'data-id': 'tooltip', dangerouslySetInnerHTML: { __html: placeholder } });
      } else {
        var content = this.props.children ? this.props.children : placeholder;
        return _react2.default.createElement(
          'div',
          { className: tooltipClass + ' ' + extraClass, 'data-id': 'tooltip' },
          content
        );
      }
    }
  }, {
    key: 'trim',
    value: function trim(string) {
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
      for (var _i = string.length - 1; _i >= 0; _i--) {
        if (string[_i] !== ' ') {
          break;
        }
        lastCount++;
      }
      newString.splice(0, firstCount);
      newString.splice(-lastCount, lastCount);
      return newString.join('');
    }
  }]);

  return ReactTooltip;
}(_react.Component);

ReactTooltip.propTypes = {
  children: _react.PropTypes.any,
  place: _react.PropTypes.string,
  type: _react.PropTypes.string,
  effect: _react.PropTypes.string,
  offset: _react.PropTypes.object,
  multiline: _react.PropTypes.bool,
  border: _react.PropTypes.bool,
  class: _react.PropTypes.string,
  id: _react.PropTypes.string,
  html: _react.PropTypes.bool,
  delayHide: _react.PropTypes.number,
  delayShow: _react.PropTypes.number,
  event: _react.PropTypes.any,
  eventOff: _react.PropTypes.any,
  watchWindow: _react.PropTypes.bool,
  isCapture: _react.PropTypes.bool
};

/* export default not fit for standalone, it will exports {default:...} */
module.exports = ReactTooltip;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./style":5,"classnames":1,"detect-browser":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = '.__react_component_tooltip{border-radius:3px;display:inline-block;font-size:13px;left:-999em;opacity:0;padding:8px 21px;position:fixed;pointer-events:none;transition:opacity 0.3s ease-out , margin-top 0.3s ease-out, margin-left 0.3s ease-out;top:-999em;visibility:hidden;z-index:999}.__react_component_tooltip:before,.__react_component_tooltip:after{content:"";width:0;height:0;position:absolute}.__react_component_tooltip.show{opacity:0.9;margin-top:0px;margin-left:0px;visibility:visible}.__react_component_tooltip.type-dark{color:#fff;background-color:#222}.__react_component_tooltip.type-dark.place-top:after{border-top:6px solid #222}.__react_component_tooltip.type-dark.place-bottom:after{border-bottom:6px solid #222}.__react_component_tooltip.type-dark.place-left:after{border-left:6px solid #222}.__react_component_tooltip.type-dark.place-right:after{border-right:6px solid #222}.__react_component_tooltip.type-dark.border{border:1px solid #fff}.__react_component_tooltip.type-dark.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-dark.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-dark.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-dark.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-success{color:#fff;background-color:#8DC572}.__react_component_tooltip.type-success.place-top:after{border-top:6px solid #8DC572}.__react_component_tooltip.type-success.place-bottom:after{border-bottom:6px solid #8DC572}.__react_component_tooltip.type-success.place-left:after{border-left:6px solid #8DC572}.__react_component_tooltip.type-success.place-right:after{border-right:6px solid #8DC572}.__react_component_tooltip.type-success.border{border:1px solid #fff}.__react_component_tooltip.type-success.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-success.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-success.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-success.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-warning{color:#fff;background-color:#F0AD4E}.__react_component_tooltip.type-warning.place-top:after{border-top:6px solid #F0AD4E}.__react_component_tooltip.type-warning.place-bottom:after{border-bottom:6px solid #F0AD4E}.__react_component_tooltip.type-warning.place-left:after{border-left:6px solid #F0AD4E}.__react_component_tooltip.type-warning.place-right:after{border-right:6px solid #F0AD4E}.__react_component_tooltip.type-warning.border{border:1px solid #fff}.__react_component_tooltip.type-warning.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-warning.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-warning.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-warning.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-error{color:#fff;background-color:#BE6464}.__react_component_tooltip.type-error.place-top:after{border-top:6px solid #BE6464}.__react_component_tooltip.type-error.place-bottom:after{border-bottom:6px solid #BE6464}.__react_component_tooltip.type-error.place-left:after{border-left:6px solid #BE6464}.__react_component_tooltip.type-error.place-right:after{border-right:6px solid #BE6464}.__react_component_tooltip.type-error.border{border:1px solid #fff}.__react_component_tooltip.type-error.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-error.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-error.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-error.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-info{color:#fff;background-color:#337AB7}.__react_component_tooltip.type-info.place-top:after{border-top:6px solid #337AB7}.__react_component_tooltip.type-info.place-bottom:after{border-bottom:6px solid #337AB7}.__react_component_tooltip.type-info.place-left:after{border-left:6px solid #337AB7}.__react_component_tooltip.type-info.place-right:after{border-right:6px solid #337AB7}.__react_component_tooltip.type-info.border{border:1px solid #fff}.__react_component_tooltip.type-info.border.place-top:before{border-top:8px solid #fff}.__react_component_tooltip.type-info.border.place-bottom:before{border-bottom:8px solid #fff}.__react_component_tooltip.type-info.border.place-left:before{border-left:8px solid #fff}.__react_component_tooltip.type-info.border.place-right:before{border-right:8px solid #fff}.__react_component_tooltip.type-light{color:#222;background-color:#fff}.__react_component_tooltip.type-light.place-top:after{border-top:6px solid #fff}.__react_component_tooltip.type-light.place-bottom:after{border-bottom:6px solid #fff}.__react_component_tooltip.type-light.place-left:after{border-left:6px solid #fff}.__react_component_tooltip.type-light.place-right:after{border-right:6px solid #fff}.__react_component_tooltip.type-light.border{border:1px solid #222}.__react_component_tooltip.type-light.border.place-top:before{border-top:8px solid #222}.__react_component_tooltip.type-light.border.place-bottom:before{border-bottom:8px solid #222}.__react_component_tooltip.type-light.border.place-left:before{border-left:8px solid #222}.__react_component_tooltip.type-light.border.place-right:before{border-right:8px solid #222}.__react_component_tooltip.place-top{margin-top:-10px}.__react_component_tooltip.place-top:before{border-left:10px solid transparent;border-right:10px solid transparent;bottom:-8px;left:50%;margin-left:-10px}.__react_component_tooltip.place-top:after{border-left:8px solid transparent;border-right:8px solid transparent;bottom:-6px;left:50%;margin-left:-8px}.__react_component_tooltip.place-bottom{margin-top:10px}.__react_component_tooltip.place-bottom:before{border-left:10px solid transparent;border-right:10px solid transparent;top:-8px;left:50%;margin-left:-10px}.__react_component_tooltip.place-bottom:after{border-left:8px solid transparent;border-right:8px solid transparent;top:-6px;left:50%;margin-left:-8px}.__react_component_tooltip.place-left{margin-left:-10px}.__react_component_tooltip.place-left:before{border-top:6px solid transparent;border-bottom:6px solid transparent;right:-8px;top:50%;margin-top:-5px}.__react_component_tooltip.place-left:after{border-top:5px solid transparent;border-bottom:5px solid transparent;right:-6px;top:50%;margin-top:-4px}.__react_component_tooltip.place-right{margin-left:10px}.__react_component_tooltip.place-right:before{border-top:6px solid transparent;border-bottom:6px solid transparent;left:-8px;top:50%;margin-top:-5px}.__react_component_tooltip.place-right:after{border-top:5px solid transparent;border-bottom:5px solid transparent;left:-6px;top:50%;margin-top:-4px}.__react_component_tooltip .multi-line{display:block;padding:2px 0px;text-align:center}';

},{}]},{},[4])(4)
});