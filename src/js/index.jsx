'use strict';

import React from 'react';
import classname from 'classnames';

const ReactTooltip = React.createClass({

  displayName: 'ReactTooltip',

  propTypes: {
    place: React.PropTypes.string,
    type: React.PropTypes.string,
    effect: React.PropTypes.string,
    positon: React.PropTypes.object,
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
      position: {},
    }
  },

  componentDidMount() {   
    this._updatePosition();
    this.bindListener();
  },

  componentWillUnmount() {
    this.unbindListener();
  },

  componentWillUpdate() {
    this.unbindListener();
  },

  componentDidUpdate(){
    this._updatePosition();
    this.bindListener();
  },

  bindListener() {
    let targetArray = document.querySelectorAll("[data-tip]");
    for(let i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener("mouseenter", this.showTooltip, false);
      targetArray[i].addEventListener("mousemove", this.updateTooltip, false);
      targetArray[i].addEventListener("mouseleave", this.hideTooltip, false);
    }
  },

  unbindListener() {
    let targetArray = document.querySelectorAll("[data-tip]");
    for(let i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener("mouseenter", this.showTooltip);
      targetArray[i].removeEventListener("mousemove", this.updateTooltip);
      targetArray[i].removeEventListener("mouseleave", this.hideTooltip);
    }
  },

  _updatePosition: function(){
    let node = React.findDOMNode(this);
    
    let tipWidth = node.clientWidth;
    let tipHeight = node.clientHeight;
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
    let xPosition = 0, yPosition = 0, {position} = this.state;
    if(Object.prototype.toString.apply(position) === "[object String]") {
      position = JSON.parse(position);
    }
    for(let key in position) {
      if(key === "top") {
        yPosition -= parseInt(position[key]);
      }
      else if(key === "bottom") {
        yPosition += parseInt(position[key]);
      }
      else if(key === "left") {
        xPosition -= parseInt(position[key]);
      }
      else if(key === "right") {
        xPosition += parseInt(position[key]);
      }
    }
    
    node.style.left = this.state.x + offset.x + xPosition + 'px';
    node.style.top = this.state.y + offset.y + yPosition + 'px';
    
  },
  
  showTooltip(e) {
    this.setState({
      placeholder: e.target.getAttribute("data-tip"),
      place: e.target.getAttribute("data-place")?e.target.getAttribute("data-place"):(this.props.place?this.props.place:"top"),
      type: e.target.getAttribute("data-type")?e.target.getAttribute("data-type"):(this.props.type?this.props.type:"dark"),
      effect: e.target.getAttribute("data-effect")?e.target.getAttribute("data-effect"):(this.props.effect?this.props.effect:"float"),
      position: e.target.getAttribute("data-position")?e.target.getAttribute("data-position"):(this.props.position?this.props.position:{}),
    })
    this.updateTooltip(e);
  },

  updateTooltip(e) {
    if(this.trim(this.state.placeholder).length > 0) {
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
        let node = React.findDOMNode(this);
        let tipWidth = node.clientWidth;
        let tipHeight = node.clientHeight;
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
    }
  },

  hideTooltip(e) {
    this.setState({
      show: false,
      x: "NONE",
      y: "NONE",
    });
  },

  render() {
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
      <span className={tooltipClass} data-id="tooltip">{this.state.placeholder}</span>
    )
  },

  trim(string) {
    let newString = string.split("");
    let firstCount = 0, lastCount = 0;
    for(let i = 0; i < string.length; i++) {
      if(string[i] !== " ") {
        break;
      }
      firstCount++;
    }
    for(let i = string.length-1; i >= 0; i--) {
      if(string[i] !== " ") {
        break;
      }
      lastCount++;
    }
    newString.splice(0, firstCount);
    newString.splice(-lastCount, lastCount);
    return newString.join("");
  },
});

export default ReactTooltip;
