'use strict';

import React from 'react';
import classNames from 'classNames';
import basicClass from './src/basic';
import basicShowClass from './src/basic-show';
import topPlaceClass from './src/place-top';
import bottomPlaceClass from './src/place-bottom';
import RCSS from 'rcss';

RCSS.injectAll();

class ReactTooltip extends React.Component {

  displayName: 'ReactTooltip'

  propTypes: {
    place: React.PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      placeholder: "",
      x: 0,
      y: 0,
      place: this.props.place?this.props.place:"top"
    }
  }

  showTooltip(e) {
    this.setState({
      placeholder: e.target.dataset.placeholder,
      place:e.target.dataset.place?e.target.dataset.place:(this.props.place?this.props.place:"top")
    })
    this.updateTooltip(e);
  }

  updateTooltip(e) {
    this.setState({
      show: true,
      x: e.x,
      y: e.y
    })
  }

  hideTooltip(e) {
    this.setState({
      show: false
    })
  }

  componentDidMount() {
    var targetArray = document.querySelectorAll("[data-placeholder]");
    for(var i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener("mouseover", this.showTooltip, false);
      targetArray[i].addEventListener("mousemove", this.updateTooltip, false);
      targetArray[i].addEventListener("mouseleave", this.hideTooltip, false);
    }
  }

  componentWillUnmount() {
    var targetArray = document.querySelectorAll("[data-placeholder]");
    for(var i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener("mouseover", this.showTooltip);
      targetArray[i].removeEventListener("mousemove", this.updateTooltip);
      targetArray[i].removeEventListener("mouseleave", this.hideTooltip);
    }
  }

  render() {
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
    var classNamesObject = {};
    classNamesObject[basicClass.className] = true ;
    if(this.state.show) {
      classNamesObject[basicShowClass.className] = true ;
    }
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
}

export default ReactTooltip;
