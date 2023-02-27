# react-tooltip

[![Version](http://img.shields.io/npm/v/react-tooltip.svg)](https://www.npmjs.org/package/react-tooltip)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm download][download-image]][download-url]
![minified](https://badgen.net/bundlephobia/min/react-tooltip)
![minified gzip](https://badgen.net/bundlephobia/minzip/react-tooltip)
<!-- ![last commit](https://badgen.net/github/last-commit/reacttooltip/react-tooltip) -->

[download-image]: https://img.shields.io/npm/dm/react-tooltip.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-tooltip

<p>
  <a href="https://www.digitalocean.com/?refcode=0813b3be1161&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_blue.svg" width="201px">
  </a>
</p>

If you like the project, please give the project a GitHub 🌟 

## Demo

[![Edit ReactTooltip](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/still-monad-yfi4fn?fontsize=14&hidenavigation=1&theme=dark)

Documentation for V4 - [Github Page](https://reacttooltip.github.io/react-tooltip/).

Documentation for V5 - [ReactTooltip](https://react-tooltip.com/docs/getting-started).

[Bundle size timeline comparation from V4 -> V5](https://bundlephobia.com/package/react-tooltip@5.0.0)

[![Bundlephobia comparison](https://user-images.githubusercontent.com/9615850/211835641-f6373084-ad73-4902-9855-246d34952345.png)](https://bundlephobia.com/package/react-tooltip@5.0.0)


## Installation

```sh
npm install react-tooltip
```

or

```sh
yarn add react-tooltip
```

## Usage

> :warning: If you were already using `react-tooltip<=5.7.5`, you'll be getting some deprecation warnings regarding the `anchorId` prop and some other features.
In versions >=5.8.0, we've introduced the `data-tooltip-id` attribute, and the `anchorSelect` prop, which are our recommended methods of using the tooltip moving forward. Check [the docs](https://react-tooltip.com/docs/getting-started) for more details.

### Using NPM package

1 . Import the CSS file to set default styling.

```js
import 'react-tooltip/dist/react-tooltip.css'
```

This needs to be done only once. We suggest you do it on your `src/index.js` or equivalent file.

2 . Import `react-tooltip` after installation.

```js
import { Tooltip } from 'react-tooltip'
```

or if you want to still use the name ReactTooltip as V4:

```js
import { Tooltip as ReactTooltip } from 'react-tooltip'
```

3 . Add `data-tooltip-id="<tooltip id>"` and `data-tooltip-content="<your placeholder>"` to your element.

> `data-tooltip-id` is the equivalent of V4's `data-for`.

```jsx
<a data-tooltip-id="my-tooltip" data-tooltip-content="Hello world!">
  ◕‿‿◕
</a>
```

4 . Include the `<Tooltip />` element.

> Don't forget to set the id, it won't work without it!

```jsx
<Tooltip id="my-tooltip" />
```

#### Using multiple anchor elements

You can also set the `anchorSelect` tooltip prop to use the tooltip with multiple anchor elements without having to set `data-tooltip-id` on each of them.
`anchorSelect` must be a valid [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

```jsx
<a className="my-anchor-element" data-tooltip-content="Hello world!">
  ◕‿‿◕
</a>
<a className="my-anchor-element" data-tooltip-content="Hello to you too!">
  ◕‿‿◕
</a>
<Tooltip anchorSelect=".my-anchor-element" />
```

Check [the V5 docs](https://react-tooltip.com/docs/getting-started) for more complex use cases.

### Standalone

You can import `node_modules/react-tooltip/dist/react-tooltip.[mode].js` into your page. Please make sure that you have already imported `react` and `react-dom` into your page.

mode: `esm` `cjs` `umd`

Don't forget to import the CSS file from `node_modules/react-tooltip/dist/react-tooltip.css` to set default styling. This needs to be done only once in your application.

PS: all the files have a minified version and a non-minified version.

![image](https://user-images.githubusercontent.com/9615850/205637814-c0ef01ae-bd77-4e7f-b4bf-df502c71e5c3.png)

## Options

For all available options, please check [React Tooltip Options](https://react-tooltip.com/docs/options)

### Security note

The `html` option allows a tooltip to directly display raw HTML. This is a security risk if any of that content is supplied by the user. Any user-supplied content must be sanitized, using a package like [sanitize-html](https://www.npmjs.com/package/sanitize-html). We chose not to include sanitization after discovering it [increased our package size](https://github.com/wwayne/react-tooltip/issues/429) too much - we don't want to penalize people who don't use the `html` option.

#### JSX note

You can use [`renderToStaticMarkup()` function](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup) to use JSX instead of HTML.
**Example:**

```jsx
import ReactDOMServer from 'react-dom/server';
[...]
<a 
  data-tooltip-id="my-tooltip"
  data-tooltip-html={ReactDOMServer.renderToStaticMarkup(<div>I am <b>JSX</b> content</div>)}
>
  ◕‿‿◕
</a>
```

## Article

[How I insert sass into react component](https://medium.com/@wwayne_me/how-i-insert-sass-into-my-npm-react-component-b46b9811c226#.gi4hxu44a)

## Maintainers

[danielbarion](https://github.com/danielbarion) Maintainer - Creator of React Tooltip >= V5.

[gabrieljablonski](https://github.com/gabrieljablonski) Maintainer.

[aronhelser](https://github.com/aronhelser) (inactive).

[alexgurr](https://github.com/alexgurr) (inactive).

[pdeszynski](https://github.com/pdeszynski) (inactive).

[roggervalf](https://github.com/roggervalf) (inactive).

[huumanoid](https://github.com/huumanoid) (inactive)

[wwayne](https://github.com/wwayne) (inactive) - Creator of the original React Tooltip (V1.x ~ V4.x.)


We would gladly accept a new maintainer to help out!

## Contributing

We welcome your contribution! Fork the repo, make some changes, submit a pull-request! Our [contributing](contributing.md) doc has some details.

## License

MIT
