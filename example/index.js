'use strict';

var React = require("react");
var ReactTooltip = require("../");

var Index = React.createClass({
  render: function() {
    return (
      <section className="tooltip-example">
        <p data-placeholder="fool">hover on me</p>
        <p data-placeholder="This is another experiment" data-place="bottom">hover on me</p>
        <ReactTooltip place="top"/>
      </section>
    )
  }
});

React.render(<Index />,document.body)
