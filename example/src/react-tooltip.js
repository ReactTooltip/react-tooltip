'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classNames = require('classNames');

var _classNames2 = _interopRequireDefault(_classNames);

'use strict';

var ReactTooltip = _react2['default'].createClass({

  displayName: 'ReactTooltip',

  propTypes: {
    place: _react2['default'].PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      show: false,
      placeholder: '',
      x: 0,
      y: 0,
      place: this.props.place ? this.props.place : 'top'
    };
  },

  showTooltip: function showTooltip(e) {
    this.setState({
      placeholder: e.target.dataset.placeholder,
      place: e.target.dataset.place ? e.target.dataset.place : this.props.place ? this.props.place : 'top'
    });
    this.updateTooltip(e);
  },

  updateTooltip: function updateTooltip(e) {
    this.setState({
      show: true,
      x: e.x,
      y: e.y
    });
  },

  hideTooltip: function hideTooltip(e) {
    this.setState({
      show: false
    });
  },

  componentDidMount: function componentDidMount() {
    var targetArray = document.querySelectorAll('[data-placeholder]');
    for (var i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener('mouseover', this.showTooltip, false);
      targetArray[i].addEventListener('mousemove', this.updateTooltip, false);
      targetArray[i].addEventListener('mouseleave', this.hideTooltip, false);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    var targetArray = document.querySelectorAll('[data-placeholder]');
    for (var i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener('mouseover', this.showTooltip);
      targetArray[i].removeEventListener('mousemove', this.updateTooltip);
      targetArray[i].removeEventListener('mouseleave', this.hideTooltip);
    }
  },

  render: function render() {
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

    var tooltipClass = (0, _classNames2['default'])({ show: this.state.show }, 'reactTooltip');

    return _react2['default'].createElement(
      'span',
      { className: tooltipClass, style: style, 'data-id': 'tooltip' },
      this.state.placeholder
    );
  }
});

exports['default'] = ReactTooltip;
module.exports = exports['default'];
