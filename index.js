'use strict';

var React = require("react");
var classNames = require("classnames");

var ReactTooltip = React.createClass({
  getInitialState: function() {
    return {
      show: false,
      placeholder: "",
      x: 0,
      y: 0,
      tipWidth: 0,
      tipHeight: 0,
      place: this.props.place?this.props.place:"top"
    }
  },
  showTooltip: function(e) {
    this.setState({
      placeholder: e.target.dataset.placeholder,
      show: true,
      x: e.x,
      y: e.y,
      place:e.target.dataset.place?e.target.dataset.place:(this.props.place?this.props.place:"top")
    })
  },
  updateTooltip: function(e) {
    this.setState({
      x: e.x,
      y: e.y
    })
  },
  hideTooltip: function(e) {
    this.setState({
      show: false
    })
  },
  componentDidMount: function() {
    var targetArray = document.querySelectorAll("[data-placeholder]");
    for(var i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener("mouseover", this.showTooltip, false);
      targetArray[i].addEventListener("mousemove", this.updateTooltip, false);
      targetArray[i].addEventListener("mouseleave", this.hideTooltip, false);
    }
  },
  componentWillUnmount: function() {
    var targetArray = document.querySelectorAll("[data-placeholder]");
    for(var i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener("mouseover", this.showTooltip);
      targetArray[i].removeEventListener("mousemove", this.updateTooltip);
      targetArray[i].removeEventListener("mouseleave", this.hideTooltip);
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    var width = document.querySelector("[data-id='tooltip']").clientWidth ;
    if(prevState.place === "top" || prevState.place === "bottom") {
      if(this.state.tipWidth !== width) {
        this.setState({
          tipWidth: width
        })
      }
    }

  },
  render: function() {
    var offset = {x:0, y:0};
    if(this.state.place === "top") {
      offset.x = -(this.state.tipWidth/2);
      offset.y = -50;
    }
    else if(this.state.place === "bottom") {
      offset.x = -(this.state.tipWidth/2);
      offset.y = 50;
    }
    var style = {
      left: this.state.x + offset.x + "px",
      top: this.state.y + offset.y + "px"
    }
    var toolTipClass = classNames({
      "react-tooltip": true,
      "show": this.state.show,
      "place-top": this.state.place === "top",
      "place-bottom": this.state.place === "bottom"
    })
    return (
      <span className={toolTipClass} style={style} data-id="tooltip">{this.state.placeholder}</span>
    )
  }
});

module.exports = ReactTooltip;
