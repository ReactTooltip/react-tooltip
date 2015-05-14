'use strict';

import React from "react";
import ReactTooltip from "./react-tooltip.js";

const Test = React.createClass({
  render() {
    return (
      <section className="tooltip-example">
        <p data-placeholder="wangzixiao">hover</p>
        <ReactTooltip />
      </section>
    )
  }
});

React.render(<Test />, document.body);
