# Valid CSS Props

Check for the validity of a CSS property name.

```bash
npm install valid-css-props
```

## API

```js
var isValidCSSProp = require('validCSSProps');

isValidCSSProp('background-color'); // => true
isValidCSSProp('abc'); // => false
isValidCSSProp('-webkit-transition'); // => true
```

## License

MIT.
