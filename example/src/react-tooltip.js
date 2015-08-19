'use strict';

import React, { PropTypes } from 'react';
import classname from 'classnames';

class ReactTooltip extends React.Component {

  _bind(...handlers) {
    handlers.forEach(handler => this[handler] = this[handler].bind(this));
  }

  constructor() {
    super();
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

  componentDidMount() {
    this._updatePosition();
    this.bindListener();
  }

  componentWillUnmount() {
    this.unbindListener();
  }

  componentWillUpdate() {
    this.unbindListener();
  }

  componentDidUpdate(){
    this._updatePosition();
    this.bindListener();
  }

  bindListener() {
    let targetArray = document.querySelectorAll("[data-tip]");
    for(let i = 0; i < targetArray.length; i++) {
      targetArray[i].addEventListener("mouseenter", this.showTooltip, false);
      targetArray[i].addEventListener("mousemove", this.updateTooltip, false);
      targetArray[i].addEventListener("mouseleave", this.hideTooltip, false);
    }
  }

  unbindListener() {
    let targetArray = document.querySelectorAll("[data-tip]");
    for(let i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener("mouseenter", this.showTooltip);
      targetArray[i].removeEventListener("mousemove", this.updateTooltip);
      targetArray[i].removeEventListener("mouseleave", this.hideTooltip);
    }
  }

  _updatePosition(){
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
      position = JSON.parse(position.toString().replace(/\'/g,"\""));

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

  }

  showTooltip(e) {
    const originTooltip = e.target.getAttribute("data-tip"),
          regexp = /<br\s*\W*>|\W+/ , 
          multiline = e.target.getAttribute("data-multiline") ? 
                        e.target.getAttribute("data-multiline") :
                        this.props.multiline ? 
                          this.props.multiline :
                          false 
                      ;
    let tooltipText, 
        multilineCount = 0 ;
    if(!multiline || multiline === "false" || !regexp.test(originTooltip)) {
      tooltipText = originTooltip
    }
    else {
      tooltipText = originTooltip.split(regexp).map((d, i) => {
        multilineCount += 1;
        return (
          <span key={i} className="multi-line">{d}</span>
        )
      })
    }
    this.setState({
      placeholder: tooltipText,
      multilineCount: multilineCount,
      place: e.target.getAttribute("data-place") ? 
                e.target.getAttribute("data-place") :
                this.props.place ? 
                    this.props.place : 
                    "top"
      ,
      type: e.target.getAttribute("data-type") ? 
                e.target.getAttribute("data-type") :
                this.props.type ? 
                   this.props.type : 
                   "dark"
      ,
      effect: e.target.getAttribute("data-effect") ?
                  e.target.getAttribute("data-effect") :
                      this.props.effect ? 
                          this.props.effect :
                          "float"
      ,
      position: e.target.getAttribute("data-position") ? 
                  e.target.getAttribute("data-position") :
                  this.props.position ? 
                      this.props.position :
                      {}
      ,
      multiline: multiline
      ,
    })
    this.updateTooltip(e);
  }

  updateTooltip(e) {
    if(this.trim(this.state.placeholder).length > 0) {
      const {multilineCount, place} = this.state;
      if(this.state.effect === "float") {
        const offsetY = !multilineCount ? 
          e.clientY : 
          place !== "top" ? 
            e.clientY:
            e.clientY - multilineCount * 14.5

        this.setState({
          show: true,
          x: e.clientX,
          y: offsetY
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
  }

  hideTooltip(e) {
    this.setState({
      show: false,
      x: "NONE",
      y: "NONE",
    });
  }

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
  }

  trim(string) {
    if(Object.prototype.toString.call(string) !== "[object String]") {
      return string
    }
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
  }

}

ReactTooltip.displayName = 'ReactTooltip';

ReactTooltip.propTypes = {
  place: PropTypes.string,
  type: PropTypes.string,
  effect: PropTypes.string,
  position: PropTypes.object,
  multiline: PropTypes.bool
};

export default ReactTooltip;
