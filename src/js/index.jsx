'use strict';

import React from 'react';
import classname from 'classNames';

const ReactTooltip = React.createClass({

  displayName: 'ReactTooltip',

  propTypes: {
    place: React.PropTypes.string
  },

  getInitialState() {
    return {
      show: false,
      placeholder: "",
      x: 0,
      y: 0,
      place: this.props.place?this.props.place:"top"
    }
  },

  showTooltip(e) {
    this.setState({
      placeholder: e.target.dataset.placeholder,
      place:e.target.dataset.place?e.target.dataset.place:(this.props.place?this.props.place:"top")
    })
    this.updateTooltip(e);
  },

  updateTooltip(e) {
    this.setState({
      show: true,
      x: e.clientX,
      y: e.clientY
    })
  },

  hideTooltip(e) {
    this.setState({
      show: false
    })
  },

  componentDidMount() {
    var targetArray = document.querySelectorAll("[data-placeholder]");
    for(var i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener("mouseover", this.showTooltip, false);
      targetArray[i].addEventListener("mousemove", this.updateTooltip, false);
      targetArray[i].addEventListener("mouseleave", this.hideTooltip, false);
    }
  },

  componentWillUnmount() {
    var targetArray = document.querySelectorAll("[data-placeholder]");
    for(var i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener("mouseover", this.showTooltip);
      targetArray[i].removeEventListener("mousemove", this.updateTooltip);
      targetArray[i].removeEventListener("mouseleave", this.hideTooltip);
    }
  },

  render() {
    let tipWidth = document.querySelector("[data-id='tooltip']")?document.querySelector("[data-id='tooltip']").clientWidth:0;
    let offset = {x:0, y:0};
    if(this.state.place === "top") {
      offset.x = -(tipWidth/2);
      offset.y = -50;
    }
    else if(this.state.place === "bottom") {
      offset.x = -(tipWidth/2);
      offset.y = 30;
    }
    let style = {
      left: this.state.x + offset.x + "px",
      top: this.state.y + offset.y + "px"
    }

    let tooltipClass = classname({show: this.state.show},'reactTooltip');

    return (
      <span className={tooltipClass} style={style} data-id="tooltip">{this.state.placeholder}</span>
    )
  }
});

export default ReactTooltip;
