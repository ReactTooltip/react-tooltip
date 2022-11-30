---
sidebar_position: 1
---

# Getting Started

This docs is related to V5, [if you are using V4 please check here](https://reacttooltip.github.io/react-tooltip/)

A react tooltip is a floating react element that displays information related to an anchor element when it receives keyboard focus or the mouse hovers over it.

## Installation

```bash
npm install react-tooltip
```

or

```bash
yarn add react-tooltip
```

## Usage

There are two ways to use ReactTooltip.

1. Using props into ReactTooltip Element.
2. Using data-attributes on anchor element.

### ReactTooltip props

1 . Require react-tooltip after installation

```js
import ReactTooltip from 'react-tooltip'
```

2 . Add data-content = "your placeholder" to your element

```jsx
<p id="my-anchor-element">Tooltip</p>
```

3 . Include react-tooltip component

```jsx
<ReactTooltip anchorId="my-anchor-element" content="hello world" place="top" />
```

### Anchor data attributes

1 . Require react-tooltip after installation

```js
import ReactTooltip from 'react-tooltip'
```

2 . Add data-content = "your placeholder" to your element

```jsx
<p id="my-anchor-element" data-content="hello world" data-place="top">
  Tooltip
</p>
```

3 . Include react-tooltip component

```jsx
<ReactTooltip anchorId="my-anchor-element" />
```
