'use strict';

import React from "react";
import ReactTooltip from "react-tooltip";

const Test = React.createClass({
  render() {
    return (
      <section>
        <p data-placeholder="wangzixiao">hover</p>
        <ReactTooltip />
      </section>
    )
  }
});

React.render(<Test />, document.body);
