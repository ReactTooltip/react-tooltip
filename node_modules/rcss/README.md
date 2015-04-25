# RCSS

Turn your JavaScript objects into CSS classes.

Designed with [React](http://facebook.github.io/react/) and [Browserify](http://browserify.org) in mind.

```bash
npm install rcss
```

Demo of the example folder output [here](https://rawgit.com/chenglou/RCSS/master/examples/index.html). No CSS files involved.

## Overview

button.js:
```js
var RCSS = require('RCSS');

var button = {
  display: 'inline-block',
  padding: '6px 12px',
  // CamelCased. Transformed back into the dashed CSS counterparts on-the-fly.
  marginBottom: '0',
  ':hover': {
    color: 'blue'
  }
};

module.exports = RCSS.registerClass(button);
```

index.js
```html
/** @jsx React.DOM */

var React = require('React');
var RCSS = require('RCSS');

var button = require('./button');

RCSS.injectAll();

React.renderComponent(
  <button className={button.className}>Hello!</button>,
  document.body
);
```

Easy =).

## API

### RCSS.registerClass(styleObject)
Wrap the style declaration and register it internally. Returns a new object of the format: `{className: 'uniqueClassName', style: originalStyleObj}`. You can then use to the opaque className and the style object however you want.

### RCSS.injectAll()
A top-level call that parses all the registered style objects into real CSS, puts the result in a style tag, and injects it in the document `head`. This clears the styles registry.

### RCSS.cascade(styleObj1, styleObj2, ...)
A simple merge utility that returns a new object. Typically used [this way](https://github.com/chenglou/RCSS/blob/master/examples/primaryButton.js#L6).

### RCSS.getStylesString()
For server-side rendering, you'd want the big style string instead of calling `injectAll()`. In fact, `injectAll()` is nothing but a helper that takes the output of `getStylesString`, creates a tag and fill the content, and puts it in `head`.

## Motivations

- Client-side asset bundling is complicated. RCSS piggy rides on whatever `require` implementation you use ([Browserify](http://browserify.org), [Webpack](http://webpack.github.io), etc.), so there's no extra compilation step.
- Use the full power of a programming language with CSS.
- No CSS preprocessor needed. There is no domain-specific language to learn, since you're constructing your JavaScript objects in... well, JavaScript.
- CSS namespacing for free.
- Cascading for free through simple object merges.
- Validates your CSS properties.
- ... And more to come. Just imagine what you can do to normal objects.

## License
MIT.
