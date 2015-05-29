'use strict';

import React from "react";
import ReactTooltip from "./react-tooltip.js";

const Test = React.createClass({

  getInitialState() {
    return {
      place: "top",
      type: "dark",
      effect: "float"
    }
  },

  changePlace(place) {
    this.setState({
      place: place
    })
  },

  changeType(type) {
    this.setState({
      type: type
    })
  },

  changeEffect(effect) {
    this.setState({
      effect: effect
    })
  },

  render() {
    let { place, type, effect } = this.state;
    return (
      <section className="tooltip-example">
        <h4 className="title">React Tooltip</h4>
        <div className="demonstration">
          <a data-tip="React-tooltip">
            ( ◕‿‿◕ )
          </a>
        </div>
        <div className="control-panel">
          <div className="button-group">
            <div className="item">
              <p>Place</p>
              <a className={place==="top"?"active":""} onClick={this.changePlace.bind(this,"top")}>Top<span className="mark">(default)</span></a>
              <a className={place==="right"?"active":""} onClick={this.changePlace.bind(this,"right")}>Right</a>
              <a className={place==="bottom"?"active":""} onClick={this.changePlace.bind(this,"bottom")}>Bottom</a>
              <a className={place==="left"?"active":""} onClick={this.changePlace.bind(this,"left")}>Left</a>
            </div>
            <div className="item">
              <p>Type</p>
              <a className={type==="dark"?"active":""} onClick={this.changeType.bind(this,"dark")}>Dark<span className="mark">(default)</span></a>
              <a className={type==="success"?"active":""} onClick={this.changeType.bind(this,"success")}>Success</a>
              <a className={type==="warning"?"active":""} onClick={this.changeType.bind(this,"warning")}>Warning</a>
              <a className={type==="error"?"active":""} onClick={this.changeType.bind(this,"error")}>Error</a>
              <a className={type==="info"?"active":""} onClick={this.changeType.bind(this,"info")}>Info</a>
              <a className={type==="dlight"?"active":""} onClick={this.changeType.bind(this,"light")}>Light</a>
            </div>
            <div className="item">
              <p>Effect</p>
              <a className={effect==="float"?"active":""} onClick={this.changeEffect.bind(this,"float")}>Float<span className="mark">(default)</span></a>
              <a className={effect==="solid"?"active":""} onClick={this.changeEffect.bind(this,"solid")}>Solid</a>
            </div>
          </div>
          <pre>
            <div>
              <p className="label">Code</p>
              <hr></hr>
              <p>{"<a data-tip='React-tooltip'>( ◕‿‿◕ )</a>"}</p>
              <p>{"<ReactTooltip place='"+place+"' type='"+type+"' effect='"+effect+"'/>"}</p>
            </div>
          </pre>
        </div>
        <ReactTooltip place={place} type={type} effect={effect}/>
      </section>
    )
  }
});

React.render(<Test />, document.body);
