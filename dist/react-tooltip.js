'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var ReactTooltip = (function (_React$Component) {
  _inherits(ReactTooltip, _React$Component);

  _createClass(ReactTooltip, [{
    key: '_bind',
    value: function _bind() {
      var _this = this;

      for (var _len = arguments.length, handlers = Array(_len), _key = 0; _key < _len; _key++) {
        handlers[_key] = arguments[_key];
      }

      handlers.forEach(function (handler) {
        return _this[handler] = _this[handler].bind(_this);
      });
    }
  }]);

  function ReactTooltip() {
    _classCallCheck(this, ReactTooltip);

    _get(Object.getPrototypeOf(ReactTooltip.prototype), 'constructor', this).call(this);
    this._bind("showTooltip", "updateTooltip", "hideTooltip");
    this.state = {
      show: false,
      multilineCount: 0,
      placeholder: "",
      x: "NONE",
      y: "NONE",
      place: "",
      type: "",
      effect: "",
      multiline: false,
      position: {}
    };
  }

  _createClass(ReactTooltip, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updatePosition();
      this.bindListener();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unbindListener();
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      this.unbindListener();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._updatePosition();
      this.bindListener();
    }
  }, {
    key: 'bindListener',
    value: function bindListener() {
      var targetArray = document.querySelectorAll("[data-tip]");
      for (var i = 0; i < targetArray.length; i++) {
        targetArray[i].addEventListener("mouseenter", this.showTooltip, false);
        targetArray[i].addEventListener("mousemove", this.updateTooltip, false);
        targetArray[i].addEventListener("mouseleave", this.hideTooltip, false);
      }
    }
  }, {
    key: 'unbindListener',
    value: function unbindListener() {
      var targetArray = document.querySelectorAll("[data-tip]");
      for (var i = 0; i < targetArray.length; i++) {
        targetArray[i].removeEventListener("mouseenter", this.showTooltip);
        targetArray[i].removeEventListener("mousemove", this.updateTooltip);
        targetArray[i].removeEventListener("mouseleave", this.hideTooltip);
      }
    }
  }, {
    key: '_updatePosition',
    value: function _updatePosition() {
      var node = _react2['default'].findDOMNode(this);

      var tipWidth = node.clientWidth;
      var tipHeight = node.clientHeight;
      var offset = { x: 0, y: 0 };
      var effect = this.state.effect;

      if (effect === "float") {
        if (this.state.place === "top") {
          offset.x = -(tipWidth / 2);
          offset.y = -50;
        } else if (this.state.place === "bottom") {
          offset.x = -(tipWidth / 2);
          offset.y = 30;
        } else if (this.state.place === "left") {
          offset.x = -(tipWidth + 15);
          offset.y = -(tipHeight / 2);
        } else if (this.state.place === "right") {
          offset.x = 10;
          offset.y = -(tipHeight / 2);
        }
      }
      var xPosition = 0;var yPosition = 0;var position = this.state.position;

      if (Object.prototype.toString.apply(position) === "[object String]") {
        position = JSON.parse(position.toString().replace(/\'/g, "\""));
      }
      for (var key in position) {
        if (key === "top") {
          yPosition -= parseInt(position[key]);
        } else if (key === "bottom") {
          yPosition += parseInt(position[key]);
        } else if (key === "left") {
          xPosition -= parseInt(position[key]);
        } else if (key === "right") {
          xPosition += parseInt(position[key]);
        }
      }

      node.style.left = this.state.x + offset.x + xPosition + 'px';
      node.style.top = this.state.y + offset.y + yPosition + 'px';
    }
  }, {
    key: 'showTooltip',
    value: function showTooltip(e) {
      var originTooltip = e.target.getAttribute("data-tip"),
          regexp = /<br\s*\W*>|\W+/,
          multiline = e.target.getAttribute("data-multiline") ? e.target.getAttribute("data-multiline") : this.props.multiline ? this.props.multiline : false;
      var tooltipText = undefined,
          multilineCount = 0;
      if (!multiline || multiline === "false" || !regexp.test(originTooltip)) {
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
        place: e.target.getAttribute("data-place") ? e.target.getAttribute("data-place") : this.props.place ? this.props.place : "top",

        type: e.target.getAttribute("data-type") ? e.target.getAttribute("data-type") : this.props.type ? this.props.type : "dark",

        effect: e.target.getAttribute("data-effect") ? e.target.getAttribute("data-effect") : this.props.effect ? this.props.effect : "float",

        position: e.target.getAttribute("data-position") ? e.target.getAttribute("data-position") : this.props.position ? this.props.position : {},

        multiline: multiline

      });
      this.updateTooltip(e);
    }
  }, {
    key: 'updateTooltip',
    value: function updateTooltip(e) {
      if (this.trim(this.state.placeholder).length > 0) {
        var _state = this.state;
        var multilineCount = _state.multilineCount;
        var place = _state.place;

        if (this.state.effect === "float") {
          var offsetY = !multilineCount ? e.clientY : place !== "top" ? e.clientY : e.clientY - multilineCount * 14.5;

          this.setState({
            show: true,
            x: e.clientX,
            y: offsetY
          });
        } else if (this.state.effect === "solid") {
          var targetTop = e.target.getBoundingClientRect().top;
          var targetLeft = e.target.getBoundingClientRect().left;
          var node = _react2['default'].findDOMNode(this);
          var tipWidth = node.clientWidth;
          var tipHeight = node.clientHeight;
          var targetWidth = e.target.clientWidth;
          var targetHeight = e.target.clientHeight;
          var x = undefined,
              y = undefined;
          if (place === "top") {
            x = targetLeft - tipWidth / 2 + targetWidth / 2;
            y = targetTop - tipHeight - 8;
          } else if (place === "bottom") {
            x = targetLeft - tipWidth / 2 + targetWidth / 2;
            y = targetTop + targetHeight + 8;
          } else if (place === "left") {
            x = targetLeft - tipWidth - 6;
            y = targetTop + targetHeight / 2 - tipHeight / 2;
          } else if (place === "right") {
            x = targetLeft + targetWidth + 6;
            y = targetTop + targetHeight / 2 - tipHeight / 2;
          }
          this.setState({
            show: true,
            x: this.state.x === "NONE" ? x : this.state.x,
            y: this.state.y === "NONE" ? y : this.state.y
          });
        }
      }
    }
  }, {
    key: 'hideTooltip',
    value: function hideTooltip(e) {
      this.setState({
        show: false,
        x: "NONE",
        y: "NONE"
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var tooltipClass = (0, _classnames2['default'])('reactTooltip', { "show": this.state.show }, { "place-top": this.state.place === "top" }, { "place-bottom": this.state.place === "bottom" }, { "place-left": this.state.place === "left" }, { "place-right": this.state.place === "right" }, { "type-dark": this.state.type === "dark" }, { "type-success": this.state.type === "success" }, { "type-warning": this.state.type === "warning" }, { "type-error": this.state.type === "error" }, { "type-info": this.state.type === "info" }, { "type-light": this.state.type === "light" });

      return _react2['default'].createElement(
        'span',
        { className: tooltipClass, 'data-id': 'tooltip' },
        this.state.placeholder
      );
    }
  }, {
    key: 'trim',
    value: function trim(string) {
      if (Object.prototype.toString.call(string) !== "[object String]") {
        return string;
      }
      var newString = string.split("");
      var firstCount = 0,
          lastCount = 0;
      for (var i = 0; i < string.length; i++) {
        if (string[i] !== " ") {
          break;
        }
        firstCount++;
      }
      for (var i = string.length - 1; i >= 0; i--) {
        if (string[i] !== " ") {
          break;
        }
        lastCount++;
      }
      newString.splice(0, firstCount);
      newString.splice(-lastCount, lastCount);
      return newString.join("");
    }
  }]);

  return ReactTooltip;
})(_react2['default'].Component);

ReactTooltip.displayName = 'ReactTooltip';

ReactTooltip.propTypes = {
  place: _react.PropTypes.string,
  type: _react.PropTypes.string,
  effect: _react.PropTypes.string,
  position: _react.PropTypes.object,
  multiline: _react.PropTypes.bool
};

exports['default'] = ReactTooltip;
module.exports = exports['default'];
