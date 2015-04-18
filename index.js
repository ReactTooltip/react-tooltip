'use strict';

var React = require("react");
var ReactTooltip = require("react-tooltip");

var Index = React.createClass({
  render: function() {
    return (
      <section className="tooltip-example">
        <p data-placeholder="foo">hover on me</p>
        <p data-placeholder="This is another hover test" data-place="bottom">Tooltip from bottom</p>
        <ReactTooltip />
      </section>
    )
  }
});

React.render(<Index />,document.body)
