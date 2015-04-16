'use strict';

var React = require("react");
var ReactTooltip = require("../index");

var Index = React.createClass({
  render: function() {
    return (
      <section className="tooltip-example">
        <p data-placeholder="foo">hover on me</p>
        <p data-placeholder="This is another hover test" data-place="bottom">hover on me</p>
        <ReactTooltip />
      </section>
    )
  }
});

React.render(<Index />,document.body)
