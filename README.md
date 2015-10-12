# react-tooltip
[![Version](http://img.shields.io/npm/v/react-tooltip.svg)](https://www.npmjs.org/package/react-tooltip)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm download][download-image]][download-url]
[![Circle CI](https://circleci.com/gh/wwayne/react-tooltip/tree/master.svg?style=svg)](https://circleci.com/gh/wwayne/react-tooltip/tree/master)

[download-image]: https://img.shields.io/npm/dm/react-tooltip.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-tooltip

### Installation

```sh
npm install react-tooltip
```

### Usage

1 . Require react-tooltip after installation

```js
var ReactTooltip = require("react-tooltip")
```

2 . Add data-tip = "your placeholder" to your element

	<p data-tip="hello world">Tooltip</p>

3 . Including react-tooltip component


```js
<ReactTooltip />
```


### Options
Every option has default value, You don't need to add option if default options are enough. 

The options set to `<ReactTooltip />` will affect all tootips in a same page and options set to specific element only affect the specific tooltip's behaviour.

Check example:  [React-tooltip Test](http://wwayne.github.io/react-tooltip)

#### Place: String [ top, right, bottom, left ]

```js
Specific element:
	<p data-tip="tooltip" data-place="top"></p>

global:	
	<ReactTooltip place="top"/>
```
#### Type: String [ dark, success, warning, error, info, light ]

```js
Specific element:
	<p data-tip="tooltip" data-type="dark"></p>
		
global:	
	<ReactTooltip type="dark"/>
```
#### Effect: String [ float, solid ]

```js
Specific element:
	<p data-tip="tooltip" data-effect="float"></p>
	
global:	
	<ReactTooltip effect="float"/>
```

#### Position: Object [ top, right, bottom, left ]

```js
Specific element:
	<p data-tip="tooltip" data-position="{'top': 10, 'left': 10}"></p>
	
global:	
	<ReactTooltip type="float" position={{top: 10, left: 10}}/>
```

#### Multiline: Bool [ true, false ]

```js
Specific element:
	<p data-tip="tooltip<br>a<br />b" data-multiline={true}></p>
	
global:	
	<ReactTooltip multiline={true}/>
```

#### Extra Class: String

```js
Specific element:
	<p data-tip="tooltip" data-class="extra-class"></p>
	
global:	
	<ReactTooltip class="extra-class"/>
```

#### Insert HTML

```js
Specific element:
	<p data-tip="<p>HTML tooltip</p>" data-html={true}></p>
	
global:	
	<ReactTooltip html={true}/>
```

#### Using react component as tooltip
Check the example [React-tooltip Test](http://wwayne.github.io/react-tooltip)

##### Note:
1. **data-tip** is necessary, because `<ReactTooltip />` find tooltip via this attribute
2. **data-for** correspond to the **id** of `<ReactTooltip />`
3. When using react component as tooltip, you can have many `<ReactTooltip />` in a page but they should have different **id**

#### Static method
`ReactTooltip.hide()` for hide the tooltip manually

`ReactTooltup.rebuild()` for re-bind tooltip to the corresponding element

I suggest always put `<ReactTooltip />` in the Highest level or smart component of Redux, so you might need these static
method to control tooltip's behaviour in some situations

### License

MIT
