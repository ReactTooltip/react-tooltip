'use strict';

var React = require("react");
var classNames = require("classnames");
var basicClass = require("./src/basic");
var topPlaceClass = require("./src/place-top");
var bottomPlaceClass = require("./src/place-bottom");
var RCSS = require("rcss");

RCSS.injectAll();

var ReactTooltip = React.createClass({
  getInitialState: function() {
    return {
      show: false,
      placeholder: "",
      x: 0,
      y: 0,
      place: this.props.place?this.props.place:"top"
    }
  },
  showTooltip: function(e) {
    this.setState({
      placeholder: e.target.dataset.placeholder,
      place:e.target.dataset.place?e.target.dataset.place:(this.props.place?this.props.place:"top")
    })
    this.updateTooltip(e);
  },
  updateTooltip: function(e) {


    this.setState({
      show: true,
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
  render: function() {
    var tipWidth = document.querySelector("[data-id='tooltip']")?document.querySelector("[data-id='tooltip']").clientWidth:0;
    var offset = {x:0, y:0};
    if(this.state.place === "top") {
      offset.x = -(tipWidth/2);
      offset.y = -50;
    }
    else if(this.state.place === "bottom") {
      offset.x = -(tipWidth/2);
      offset.y = 30;
    }
    var style = {
      left: this.state.x + offset.x + "px",
      top: this.state.y + offset.y + "px"
    }
    var classNamesObject = {
      "show": this.state.show
    }
    classNamesObject[basicClass.className] = true ;
    if(this.state.place === "top") {
      classNamesObject[topPlaceClass.className] = true
    }
    if(this.state.place === "bottom") {
      classNamesObject[bottomPlaceClass.className] = true;
    }
    var toolTipClass = classNames(classNamesObject)

    return (
      <span className={toolTipClass} style={style} data-id="tooltip">{this.state.placeholder}</span>
    )
  }
});

module.exports = ReactTooltip;
