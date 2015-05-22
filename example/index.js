"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _ReactTooltip = require("./react-tooltip.js");

var _ReactTooltip2 = _interopRequireWildcard(_ReactTooltip);

var Test = _React2["default"].createClass({
  displayName: "Test",

  getInitialState: function getInitialState() {
    return {
      place: "top",
      type: "dark",
      effect: "float"
    };
  },

  changePlace: function changePlace(place) {
    this.setState({
      place: place
    });
  },

  changeType: function changeType(type) {
    this.setState({
      type: type
    });
  },

  changeEffect: function changeEffect(effect) {
    this.setState({
      effect: effect
    });
  },

  render: function render() {
    var _state = this.state;
    var place = _state.place;
    var type = _state.type;
    var effect = _state.effect;

    return _React2["default"].createElement(
      "section",
      { className: "tooltip-example" },
      _React2["default"].createElement(
        "h4",
        { className: "title" },
        "React Tooltip"
      ),
      _React2["default"].createElement(
        "div",
        { className: "demonstration" },
        _React2["default"].createElement(
          "a",
          { "data-tip": "React-tooltip" },
          "( ◕‿‿◕ )"
        )
      ),
      _React2["default"].createElement(
        "div",
        { className: "control-panel" },
        _React2["default"].createElement(
          "div",
          { className: "button-group" },
          _React2["default"].createElement(
            "div",
            { className: "item" },
            _React2["default"].createElement(
              "p",
              null,
              "Place"
            ),
            _React2["default"].createElement(
              "a",
              { className: place === "top" ? "active" : "", onClick: this.changePlace.bind(this, "top") },
              "Top",
              _React2["default"].createElement(
                "span",
                { className: "mark" },
                "(default)"
              )
            ),
            _React2["default"].createElement(
              "a",
              { className: place === "right" ? "active" : "", onClick: this.changePlace.bind(this, "right") },
              "Right"
            ),
            _React2["default"].createElement(
              "a",
              { className: place === "bottom" ? "active" : "", onClick: this.changePlace.bind(this, "bottom") },
              "Bottom"
            ),
            _React2["default"].createElement(
              "a",
              { className: place === "left" ? "active" : "", onClick: this.changePlace.bind(this, "left") },
              "Left"
            )
          ),
          _React2["default"].createElement(
            "div",
            { className: "item" },
            _React2["default"].createElement(
              "p",
              null,
              "Type"
            ),
            _React2["default"].createElement(
              "a",
              { className: type === "dark" ? "active" : "", onClick: this.changeType.bind(this, "dark") },
              "Dark",
              _React2["default"].createElement(
                "span",
                { className: "mark" },
                "(default)"
              )
            ),
            _React2["default"].createElement(
              "a",
              { className: type === "success" ? "active" : "", onClick: this.changeType.bind(this, "success") },
              "Success"
            ),
            _React2["default"].createElement(
              "a",
              { className: type === "warning" ? "active" : "", onClick: this.changeType.bind(this, "warning") },
              "Warning"
            ),
            _React2["default"].createElement(
              "a",
              { className: type === "error" ? "active" : "", onClick: this.changeType.bind(this, "error") },
              "Error"
            ),
            _React2["default"].createElement(
              "a",
              { className: type === "info" ? "active" : "", onClick: this.changeType.bind(this, "info") },
              "Info"
            ),
            _React2["default"].createElement(
              "a",
              { className: type === "dlight" ? "active" : "", onClick: this.changeType.bind(this, "light") },
              "Light"
            )
          ),
          _React2["default"].createElement(
            "div",
            { className: "item" },
            _React2["default"].createElement(
              "p",
              null,
              "Effect"
            ),
            _React2["default"].createElement(
              "a",
              { className: effect === "float" ? "active" : "", onClick: this.changeEffect.bind(this, "float") },
              "Float",
              _React2["default"].createElement(
                "span",
                { className: "mark" },
                "(default)"
              )
            ),
            _React2["default"].createElement(
              "a",
              { className: effect === "solid" ? "active" : "", onClick: this.changeEffect.bind(this, "solid") },
              "Solid"
            )
          )
        ),
        _React2["default"].createElement(
          "pre",
          null,
          _React2["default"].createElement(
            "div",
            null,
            _React2["default"].createElement(
              "p",
              { className: "label" },
              "Code"
            ),
            _React2["default"].createElement("hr", null),
            _React2["default"].createElement(
              "p",
              null,
              "<a data-tip='React-tooltip'>( ◕‿‿◕ )</a>"
            ),
            _React2["default"].createElement(
              "p",
              null,
              "<ReactTooltip place={" + place + "} type={" + type + "} effect={" + effect + "}/>"
            )
          )
        )
      ),
      _React2["default"].createElement(_ReactTooltip2["default"], { place: place, type: type, effect: effect })
    );
  }
});

_React2["default"].render(_React2["default"].createElement(Test, null), document.body);
