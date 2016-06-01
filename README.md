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
**Using NPM**

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

**Standalone**

You can import `node_modules/react-tooltip/standalone/react-tooltip.min.js` into your page, please make sure that you have already imported `react` and `react-dom` into your page.

### Options
Notes:
* The tooltip is using `type: dark` `place: top` `effect: float` as **default** attribute, you don't have to add these options if you don't want to change default
* The option you set on `<ReactTooltip />` component will be implemented on every tooltip in a same page: `<ReactTooltip effect="solid" />`
* The option you set on specific elecment, for example: `<a data-type="warning"></a>` will only make effect on this specific tooltip

Check example:  [React-tooltip Test](http://wwayne.com/react-tooltip)

	Global  |	Specific	|	Type	|	Values  |       Description
:-----------|:-------------|:----------|:----------|:------------------
    place	|   data-place  |  String  |  top, right, bottom, left | tooltip's placement
    type	|   data-type  |  String  |  success, warning, error, info, light | tooltip's color theme
    effect	|   data-effect  |  String  |  float, solid | either float or pinned
    event |   data-event  |  String  |  e.g. click | custom event to trigger tooltip
   eventOff |   data-event-off  |  String  |  e.g. click | custom event to hide tooltip
    isCapture | data-iscapture | Bool | true, false | when set to ture, custom event's propagation mode will be capture, default is false, `<p data-tip="tooltip" data-event='click' data-iscapture='true'></p>` or `<ReactTooltip isCapture={true} />` | 
    offset	|   data-offset  |  Object  |  top, right, bottom, left | `data-offset="{'top': 10, 'left': 10}"` for specific and `offset={{top: 10, left: 10}}` for global
   multiline	|   data-multiline  |  Bool  |  true, false | support `<br>`, `<br />` to make multiline
  class	|   data-class  |  String  |  your custom class | extra custom class, can use !important to cover react-tooltip's default class
      html	|   data-html  |  Bool  |  true, false  |  `<p data-tip="<p>HTML tooltip</p>" data-html={true}></p>` or `<ReactTooltip html={true} />`
   delayHide	|   data-delay-hide  |  Number  |   | `<p data-tip="tooltip" data-delay-hide='1000'></p>` or `<ReactTooltip delayHide={1000} />`
    delayShow	|   data-delay-show  |  Number  |   | `<p data-tip="tooltip" data-delay-show='1000'></p>` or `<ReactTooltip delayShow={1000} />`
   border  |   data-border  |  Bool  |  true, false | Add one pixel white border

### Using react component as tooltip
Check the example [React-tooltip Test](http://wwayne.com/react-tooltip)

##### Note:
1. **data-tip** is necessary, because `<ReactTooltip />` find tooltip via this attribute
2. **data-for** correspond to the **id** of `<ReactTooltip />`
3. When using react component as tooltip, you can have many `<ReactTooltip />` in a page but they should have different **id**

### Methods
`ReactTooltip.hide()` for hide the tooltip manually

`ReactTooltip.rebuild()` for re-bind tooltip to the corresponding element

I suggest always put `<ReactTooltip />` in the Highest level or smart component of Redux, so you might need these static
method to control tooltip's behaviour in some situations

### License

MIT
