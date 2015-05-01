# babelify

[Babel](https://github.com/babel/babel) [browserify](https://github.com/substack/node-browserify) transform

## Installation

    $ npm install --save-dev babelify

## Usage

### CLI

    $ browserify script.js -t babelify --outfile bundle.js

### Node

```javascript
var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
browserify({ debug: true })
  .transform(babelify)
  .require("./script.js", { entry: true })
  .bundle()
  .on("error", function (err) { console.log("Error : " + err.message); })
  .pipe(fs.createWriteStream("bundle.js"));
```

#### [Options](https://babeljs.io/docs/usage/options)

```javascript
browserify().transform(babelify.configure({
  blacklist: ["regenerator"]
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --blacklist regenerator ]
```

#### Enable Experimental Transforms

By default Babel's [experimental transforms](http://babeljs.io/docs/usage/transformers/#es7-experimental-)
are disabled. You can turn them on individually by passing `optional` as a configuration option.

```javascript
browserify().transform(babelify.configure({
  optional: ["es7.asyncFunctions"]
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --optional es7.asyncFunctions ]
```

Alternatively, you can enable an entire [TC39 category](http://babeljs.io/docs/usage/experimental/) of experimental ES7 features via the `stage` configuration option.

```javascript
browserify().transform(babelify.configure({
  stage: 0
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --stage 0 ]
```

#### Customising extensions

By default all files with the extensions `.js`, `.es`, `.es6` and `.jsx` are compiled.
You can change this by passing an array of extensions.

**NOTE:** This will override the default ones so if you want to use any of them
you have to add them back.

```javascript
browserify().transform(babelify.configure({
  extensions: [".babel"]
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --extensions .babel ]
```

#### Relative source maps

Browserify passes an absolute path so there's no way to determine what folder
it's relative to. You can pass a relative path that'll be removed from the
absolute path with the `sourceMapRelative` option.

```javascript
browserify().transform(babelify.configure({
  sourceMapRelative: "/Users/sebastian/Projects/my-cool-website/assets"
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --sourceMapRelative . ]
```

#### Additional options

```javascript
browserify().transform(babelify.configure({
  // Optional ignore regex - if any filenames **do** match this regex then they
  // aren't compiled
  ignore: /regex/,

  // Optional only regex - if any filenames **don't** match this regex then they
  // aren't compiled
  only: /my_es6_folder/
}))
```

```sh
$ browserify -d -e script.js -t [ babelify --ignore regex --only my_es6_folder ]
```

#### ES6 Polyfill

As a convenience, the babelify polyfill is exposed in babelify. If you've got
a browserify-only package this may alleviate the necessity to have
*both* babel & babelify installed.

```javascript
// In browser code
require("babelify/polyfill");
```

## FAQ

### Why aren't files in `node_modules` being transformed?

This is default browserify behaviour and **can not** be overriden. A possible solution is to add:

```json
{
  "browserify": {
    "transform": ["babelify"]
  }
}
```

to the root of all your modules `package.json` that you want to be transformed. If you'd like to
specify options then you can use:

```json
{
  "browserify": {
    "transform": [["babelify", { "optional": ["es7.asyncFunctions"] }]]
  }
}
```
