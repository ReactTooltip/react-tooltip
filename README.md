# react-tooltip

React tooltip component, inspired by tooltipsy (a jquery plugin I've used)

[![Version](http://img.shields.io/npm/v/react-tooltip.svg)](https://www.npmjs.org/package/react-tooltip)


### Installation

```
npm install react-tooltip --save
```

### Usage

1 . Require react-tooltip after installation

```
var ReactTooltip = require("react-tooltip")
```
2 . Include css or scss file(you can find the file in dist folder) into your project

```
sass: @import "react-tooltip";
``` 

3 . Add data-placeholder = "your placeholder" to your element

	<p data-placeholder="hello world">Tooltip</p>

4 . Including react-tooltip component


```
<ReactTooltip />
```


### Example
[http://wwayne.github.io/react-tooltip](http://wwayne.github.io/react-tooltip/)

```
'use strict';

var React = require("react");
var ReactTooltip = require("../index");

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
```

### License

MIT
