# Valid Media Queries

Check for the validity of a CSS media query. Based on the [valid-css-props](https://github.com/chenglou/valid-css-props) module by [chenglou](https://github.com/chenglou/).

```
npm install valid-media-queries
```

## API

```js
var isValidMediaQuery = require('valid-media-queries');

isValidMediaQuery('@media tv and (monochrome), only screen'); // => true
isValidMediaQuery('@media not thing  and (max-height : 50px)'); // => false
```

## License

MIT.
