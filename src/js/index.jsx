'use strict';

import React from 'react';
import classname from 'classnames';

const ReactTooltip = React.createClass({

  displayName: 'ReactTooltip',

  propTypes: {
    place: React.PropTypes.string,
    type: React.PropTypes.string,
    effect: React.PropTypes.string,
  },

  getInitialState() {
    return {
      show: false,
      placeholder: "",
      x: "NONE",
      y: "NONE",
      place: "",
      type: "",
      effect: "",
    }
  },

  showTooltip(e) {
    this.setState({
      placeholder: e.target.getAttribute("data-tip"),
      place: e.target.getAttribute("data-place")?e.target.getAttribute("data-place"):(this.props.place?this.props.place:"top"),
      type: e.target.getAttribute("data-type")?e.target.getAttribute("data-type"):(this.props.type?this.props.type:"dark"),
      effect: e.target.getAttribute("data-effect")?e.target.getAttribute("data-effect"):(this.props.effect?this.props.effect:"float"),
    })
    this.updateTooltip(e);
  },

  updateTooltip(e) {
    if(this.state.effect === "float") {
      this.setState({
        show: true,
        x: e.clientX,
        y: e.clientY
      })
    }
    else if(this.state.effect === "solid"){
      let targetTop = e.target.getBoundingClientRect().top;
      let targetLeft = e.target.getBoundingClientRect().left;
      let tipWidth = document.querySelector("[data-id='tooltip']")?document.querySelector("[data-id='tooltip']").clientWidth:0;
      let tipHeight = document.querySelector("[data-id='tooltip']")?document.querySelector("[data-id='tooltip']").clientHeight:0;
      let targetWidth = e.target.clientWidth;
      let targetHeight = e.target.clientHeight;
      let { place } = this.state;
      let x, y ;
      if(place === "top") {
        x = targetLeft - (tipWidth/2) + (targetWidth/2);
        y = targetTop - tipHeight - 8;
      }
      else if(place === "bottom") {
        x = targetLeft - (tipWidth/2) + (targetWidth/2);
        y = targetTop + targetHeight + 8;
      }
      else if(place === "left") {
        x = targetLeft - tipWidth - 6;
        y = targetTop + (targetHeight/2) - (tipHeight/2);
      }
      else if(place === "right") {
        x = targetLeft + targetWidth + 6;
        y = targetTop + (targetHeight/2) - (tipHeight/2);
      }
      this.setState({
        show: true,
        x: this.state.x === "NONE" ? x : this.state.x,
        y: this.state.y === "NONE" ? y : this.state.y
      })
    }
  },

  hideTooltip(e) {
    this.setState({
      show: false,
      x: "NONE",
      y: "NONE",
    });
  },

  componentDidMount() {
    let targetArray = Array.prototype.slice.apply(document.querySelectorAll("[data-tip]"))
      .filter((target, index) => {
        return target.getAttribute("data-tip").length > 0;
      });
    for(let i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener("mouseenter", this.showTooltip, false);
      targetArray[i].addEventListener("mousemove", this.updateTooltip, false);
      targetArray[i].addEventListener("mouseleave", this.hideTooltip, false);
    }
  },

  componentWillUnmount() {
    let targetArray = Array.prototype.slice.apply(document.querySelectorAll("[data-tip]"))
      .filter((target, index) => {
        return target.getAttribute("data-tip").length > 0;
      });
    for(let i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener("mouseenter", this.showTooltip);
      targetArray[i].removeEventListener("mousemove", this.updateTooltip);
      targetArray[i].removeEventListener("mouseleave", this.hideTooltip);
    }
  },

  render() {
    let tipWidth = document.querySelector("[data-id='tooltip']")?document.querySelector("[data-id='tooltip']").clientWidth:0;
    let tipHeight = document.querySelector("[data-id='tooltip']")?document.querySelector("[data-id='tooltip']").clientHeight:0;
    let offset = {x:0, y:0};
    let { effect } = this.state;
    if(effect === "float") {
      if(this.state.place === "top") {
        offset.x = -(tipWidth/2);
        offset.y = -50;
      }
      else if(this.state.place === "bottom") {
        offset.x = -(tipWidth/2);
        offset.y = 30;
      }
      else if(this.state.place === "left") {
        offset.x = -(tipWidth + 15);
        offset.y = -(tipHeight/2);
      }
      else if(this.state.place === "right") {
        offset.x = 10;
        offset.y = -(tipHeight/2);
      }
    }
    let style = {
      left: this.state.x + offset.x + "px",
      top: this.state.y + offset.y + "px"
    }

    let tooltipClass = classname(
      'reactTooltip',
      {"show": this.state.show},
      {"place-top": this.state.place === "top"},
      {"place-bottom": this.state.place === "bottom"},
      {"place-left": this.state.place === "left"},
      {"place-right": this.state.place === "right"},
      {"type-dark": this.state.type === "dark"},
      {"type-success": this.state.type === "success"},
      {"type-warning": this.state.type === "warning"},
      {"type-error": this.state.type === "error"},
      {"type-info": this.state.type === "info"},
      {"type-light": this.state.type === "light"}
    );

    return (
      <span className={tooltipClass} style={style} data-id="tooltip">{this.state.placeholder}</span>
    )
  }
});

export default ReactTooltip;
