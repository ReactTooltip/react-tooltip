# react-tooltip

React tooltip component, inspired by tooltipsy (a jquery plugin I've used)

[![Version](http://img.shields.io/npm/v/react-tooltip.svg)](https://www.npmjs.org/package/react-tooltip)


### Installation

```sh
npm install react-tooltip --save
```

### Usage

1 . Require react-tooltip after installation

```js
var ReactTooltip = require("react-tooltip")
```
2 . Include css or scss file(you can find them in dist folder) into your project

```js
sass: @import "react-tooltip";
``` 

3 . Add data-tip = "your placeholder" to your element

	<p data-tip="hello world">Tooltip</p>

4 . Including react-tooltip component


```js
<ReactTooltip />
```


### Options
Every option has default value, You don't need to add option if default options are enough. 

The options set to `<ReactTooltip />` will affect all tootips in a same page and options set to specific element only affect the specific tooltip's behaviour.

Check example:  [React-tooltip Test](http://wwayne.github.io/react-tooltip)

##### Place: String [ top, right, bottom, left ]

```js
Specific element:
	<p data-tip="tooltip" data-place="top"></p>

global:	
	<ReactTooltip place="top"/>
```
##### Type: String [ dark, success, warning, error, info, light ]

```js
Specific element:
	<p data-tip="tooltip" data-type="dark"></p>
		
global:	
	<ReactTooltip type="dark"/>
```
##### Effect: String [ float, solid ]

```js
Specific element:
	<p data-tip="tooltip" data-effect="float"></p>
	
global:	
	<ReactTooltip effect="float"/>
```

##### Position: Object [ top, right, bottom, left ]

```js
Specific element:
	<p data-tip="tooltip" data-position="{'top': 10, 'left': 10}"></p>
	
global:	
	<ReactTooltip type="float" position={{top: 10, left: 10}}/>
```

##### Multiline: Bool [ true, false ]

```js
Specific element:
	<p data-tip="tooltip a     b" data-multiline="true"></p>
	<p data-tip="tooltip<br>a<br />b" data-multiline={true}></p>
	
global:	
	<ReactTooltip multiline={true}/>
```


### License

MIT
