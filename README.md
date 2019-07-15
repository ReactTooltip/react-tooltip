# react-tooltip
[![Version](http://img.shields.io/npm/v/react-tooltip.svg)](https://www.npmjs.org/package/react-tooltip)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm download][download-image]][download-url]
[![Build Status](https://travis-ci.org/wwayne/react-tooltip.svg?branch=master)](https://travis-ci.org/wwayne/react-tooltip)

[download-image]: https://img.shields.io/npm/dm/react-tooltip.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-tooltip

## Maintainers

[huumanoid](https://github.com/huumanoid)

[aronhelser](https://github.com/aronhelser)

## Installation

```sh
npm install react-tooltip
```

## Usage
**Using NPM**

1 . Require react-tooltip after installation

```js
import ReactTooltip from 'react-tooltip'
```

2 . Add data-tip = "your placeholder" to your element
```jsx
<p data-tip="hello world">Tooltip</p>
```

3 . Include react-tooltip component


```js
<ReactTooltip />
```

**Standalone**

You can import `node_modules/react-tooltip/standalone/react-tooltip.min.js` into your page. Please make sure that you have already imported `react` and `react-dom` into your page.

## Options
Notes:
* The tooltip sets `type: dark` `place: top` `effect: float` as **default** attributes. You don't have to add these options if you don't want to change the defaults
* The option you set on `<ReactTooltip />` component will be implemented on every tooltip in a same page: `<ReactTooltip effect="solid" />`
* The option you set on a specific element, for example: `<a data-type="warning"></a>` will only affect this specific tooltip

Check example:  [React-tooltip Test](https://react-tooltip.netlify.com/)

Global|Specific	|Type	|Values  |  Description
|:---|:---|:---|:---|:----
 place	|   data-place  |  String  |  top, right, bottom, left | placement
 type	|   data-type  |  String  |  success, warning, error, info, light | theme
 effect|   data-effect  |  String  |  float, solid | behaviour of tooltip
 event |   data-event  |  String  |  e.g. click | custom event to trigger tooltip
 eventOff |   data-event-off  |  String  |  e.g. click | custom event to hide tooltip (only makes effect after setting event attribute)
 globalEventOff | | String| e.g. click| global event to hide tooltip (global only)
 isCapture | data-iscapture | Bool | true, false | when set to true, custom event's propagation mode will be capture
 offset	|   data-offset  |  Object  |  top, right, bottom, left | `data-offset="{'top': 10, 'left': 10}"` for specific and `offset={{top: 10, left: 10}}` for global
multiline	|   data-multiline  |  Bool  |  true, false | support `<br>`, `<br />` to make multiline
className	|   data-class  |  String  |   | extra custom class, can use !important to overwrite react-tooltip's default class
 html	|   data-html  |  Bool  |  true, false  |  `<p data-tip="<p>HTML tooltip</p>" data-html={true}></p>` or `<ReactTooltip html={true} />`, but see [Security Note](#security-note) below.
 delayHide	|   data-delay-hide  |  Number  |   | `<p data-tip="tooltip" data-delay-hide='1000'></p>` or `<ReactTooltip delayHide={1000} />`
 delayShow	|   data-delay-show  |  Number  |   | `<p data-tip="tooltip" data-delay-show='1000'></p>` or `<ReactTooltip delayShow={1000} />`
 delayUpdate	|   data-delay-update |  Number  |   | `<p data-tip="tooltip" data-delay-update='1000'></p>` or `<ReactTooltip delayUpdate={1000} />` Sets a delay in calling getContent if the tooltip is already shown and you mouse over another target  
 insecure | null | Bool | true, false | Whether to inject the style header into the page dynamically (violates CSP style-src but is a convenient default)
 border  |   data-border  |  Bool  |  true, false | Add one pixel white border
 getContent | null | Func or Array | (dataTip) => {}, [(dataTip) => {}, Interval] | Generate the tip content dynamically
 afterShow | null | Func | (evt) => {} | Function that will be called after tooltip show, with event that triggered show
 afterHide | null | Func | (evt) => {} | Function that will be called after tooltip hide, with event that triggered hide
 overridePosition | null | Func | ({left:number, top: number}, currentEvent, currentTarget, node, place, desiredPlace, effect, offset) => ({left: number, top: number}) | Function that will replace tooltip position with custom one
 disable | data-tip-disable | Bool | true, false | Disable the tooltip behaviour, default is false
 scrollHide | data-scroll-hide | Bool | true, false | Hide the tooltip when scrolling, default is true
 resizeHide | null | Bool | true, false | Hide the tooltip when resizing the window, default is true
 wrapper | null | String | div, span | Selecting the wrapper element of the react tooltip, default is div
 clickable | null | Bool | true, false | Enables tooltip to respond to mouse (or touch) events, default is false

### Security Note

The `html` option allows a tooltip to directly display raw HTML. This is a security risk if any of that content is supplied by the user. Any user-supplied content must be sanitized, using a package like [sanitize-html-react](https://www.npmjs.com/package/sanitize-html-react). We chose not to include sanitization after discovering it [increased our package size](https://github.com/wwayne/react-tooltip/issues/429) too much - we don't want to penalize people who don't use the `html` option.

## Using react component as tooltip
Check the example [React-tooltip Test](https://react-tooltip.netlify.com/)

##### Note:
1. **data-tip** is necessary, because `<ReactTooltip />` finds the tooltip via this attribute
2. **data-for** corresponds to the **id** of `<ReactTooltip />`
3. When using react component as tooltip, you can have many `<ReactTooltip />` in a page but they should have different **id**s

## Static Methods
### ReactTooltip.hide(target)

> Hide the tooltip manually, the target is optional, if no target passed in, all existing tooltips will be hidden

```js
import ReactTooltip from 'react-tooltip'

<p ref={ref => this.fooRef = ref} data-tip='tooltip'></p>
<button onClick={() => { ReactTooltip.hide(this.fooRef) }}></button>
<ReactTooltip />
```

### ReactTooltip.rebuild()

> Rebinding all tooltips

### ReactTooltip.show(target)

> Show specific tooltip manually, for example:

```js
import ReactTooltip from 'react-tooltip'

<p ref={ref => this.fooRef = ref} data-tip='tooltip'></p>
<button onClick={() => { ReactTooltip.show(this.fooRef) }}></button>
<ReactTooltip />
```

## Troubleshooting
### 1. Using tooltip within the modal (e.g. [react-modal](https://github.com/reactjs/react-modal))
The component was designed to set `<ReactTooltip />` once and then use tooltip everywhere, but a lot of people get stuck when using this component in a modal. You can read the discussion [here](https://github.com/wwayne/react-tooltip/issues/130). To solve this problem:

1. Place `<ReactTooltip />` outside of the `<Modal>`
2. Use `ReactTooltip.rebuild()` when opening the modal
3. If your modal's z-index happens to be higher than the tooltip's, use the attribute `className` to custom your tooltip's z-index

>I suggest always putting `<ReactTooltip />` in the Highest level or smart component of Redux, so you might need these static
method to control tooltip's behaviour in some situations

### 2. Hide tooltip when getContent returns undefined
When you set `getContent={() => { return }}` you will find the tooltip will display `true`. That's because React will set the value of data-* to be 'true' automatically if there is no value to be set. So you have to set `data-tip=''` in this situation.

```jsx
<p data-tip='' data-for='test'></p>
<ReactTooltip id='test' getContent={() => { return null }}/>
```

Same for empty children, if you don't want show the tooltip when the children is empty

```jsx
<p data-tip='' data-for='test'></p>
<ReactTooltip id='test'>{}</ReactTooltip>
```

## Article
[How I insert sass into react component](https://medium.com/@wwayne_me/how-i-insert-sass-into-my-npm-react-component-b46b9811c226#.gi4hxu44a)

## Contributing

We welcome your contribution! Fork the repo, make some changes, submit a pull-request! Our [contributing](contributing.md) doc has some details.

## License

MIT
