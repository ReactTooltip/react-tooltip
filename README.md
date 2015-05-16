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
2 . Include css or scss file(you can find them in dist folder) into your project

```
sass: @import "react-tooltip";
``` 

3 . Add data-placeholder = "your placeholder" to your element

	<p data-tip="hello world">Tooltip</p>

4 . Including react-tooltip component


```
<ReactTooltip />
```


### Options
Every option has default value, You don't need to add option if default options are enough.

The options set to `<ReactTooltip />` will affect all tootips in a same page and options set to specific element only affect the specific tooltip's behaviour

##### Place: String ( top, right, bottom, left )
Specific element:

	<p data-tip="tooltip" data-place="top"></p>
		
global:	

```
<ReactTooltip place="top"/>
```
##### Type: String ( dark, success, warning, error, info, light )
Specific element:

	<p data-tip="tooltip" data-type="dark"></p>
		
global:	

```
<ReactTooltip type="dark"/>
```
##### Effect: String ( float, solid)
Specific element:

	<p data-tip="tooltip" data-type="float"></p>
	
global:	

```
<ReactTooltip type="float"/>
```

### License

MIT
