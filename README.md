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

## [Bundle size comparison V4 -> V5](https://bundlephobia.com/package/react-tooltip)

<p align="center">
  <a href="https://bundlephobia.com/package/react-tooltip@4.5.1">
    <img alt="Bundlephobia v4.5.1" style="height: 250px" src="https://user-images.githubusercontent.com/21102974/222977995-a5ae7c12-e945-454e-ad96-5c73b76a88a0.png" />
  </a>
  <a href="https://bundlephobia.com/package/react-tooltip@5.9.0">
    <img alt="Bundlephobia v5.9.0" style="height: 250px" src="https://user-images.githubusercontent.com/21102974/222977970-8574434d-77de-4aa3-b8ad-a2b8924d75a4.png" />
  </a>
  <a href="https://bundlephobia.com/package/react-tooltip@4.5.1">
    <img alt="Bundlezise timeline" style="height: 250px" src="https://user-images.githubusercontent.com/21102974/222978188-f6db8679-da69-4da7-9c0d-b6fde8bd9517.png" />
  </a>
</p>

## Installation

```sh
npm install react-tooltip
```

or

```sh
yarn add react-tooltip
```

## Usage

> :warning: ReactTooltip will inject the default styles into the page by default on version `5.13.0` or newer.
> The `react-tooltip/dist/react-tooltip.css` file is only for style reference and doesn't need to be imported manually anymore if you are already using `v5.13.0` or upper.

> :warning: If you were already using `react-tooltip<=5.7.5`, you'll be getting some deprecation warnings regarding the `anchorId` prop and some other features.
> In versions >=5.8.0, we've introduced the `data-tooltip-id` attribute, and the `anchorSelect` prop, which are our recommended methods of using the tooltip moving forward. Check [the docs](https://react-tooltip.com/docs/getting-started) for more details.

### Using NPM package

1 . Import the CSS file to set default styling.

> :warning: If you are using a version before than `v5.13.0`, you must import the CSS file or the tooltip won't show!

```js
import 'react-tooltip/dist/react-tooltip.css'
```

This needs to be done only once and only if you are using a version before than `5.13.0`. We suggest you do it on your `src/index.js` or equivalent file.

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

If you are using a version older than `v5.13.0` don't forget to import the CSS file from `node_modules/react-tooltip/dist/react-tooltip.css` to set default styling. This needs to be done only once in your application. Version `v5.13.0` or newer already inject the default styles into the page by default.

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

## Troubleshooting

Before trying these, make sure you're running the latest ReactTooltip version with

```sh
npm install react-tooltip@latest
```

or

```sh
yarn add react-tooltip@latest
```

If you can't find your problem here, make sure there isn't [an open issue](https://github.com/ReactTooltip/react-tooltip/issues) already covering it.
If there isn't, feel free to [submit a new issue](https://github.com/ReactTooltip/react-tooltip/issues/new/choose).

### The tooltip is broken/not showing up

Make sure you've imported the default styling. You only need to do this once on your application and only if you are using a version before `5.13.0`, `App.jsx`/`App.tsx` is usually a good place to do it.

```jsx
import 'react-tooltip/dist/react-tooltip.css'
```

If you've imported the default styling and the tooltip is still not showing up when you hover on your anchor element, make sure you have content to be displayed by the tooltip.

If `data-tooltip-content` and `data-tooltip-html` are both unset (or they have empty values) on the anchor element, and also the `content`, `render`, and `children` props on the tooltip are unset (or have empty values), the tooltip is not shown by default.

### Next.js `TypeError: f is not a function`

This problem seems to be caused by a bug related to the SWC bundler used by Next.js.
The best way to solve this is to upgrade to `next@13.3.0` or later versions.

Less ideally, if you're unable to upgrade, you can set `swcMinify: false` on your `next.config.js` file.

### Bad performance

If you're experiencing any kind of unexpected behavior or bad performance on your application when using ReactTooltip, here are a few things you can try.

#### Move `<Tooltip />` on the DOM

This is specially relevant when using components that are conditionally rendered.

Always try to keep the `<Tooltip />` component rendered, so if you're having issues with a tooltip you've placed inside a component which is placed/removed from the DOM dynamically, try to move the tooltip outside of it.

We usually recommend placing the tooltip component directly inside the root component of your application (usually on `App.jsx`/`App.tsx`).

#### Dynamically generated anchor elements

You should avoid needlessly using a large amount of `<Tooltip />` components. One tooltip component that you use across your whole application should be good enough in most cases, but you should be fine to add a few more if you need to use different styled tooltips.

Here's a simple example on how to improve performance when using dynamically generated items.

> Check the docs for examples for the [`anchorSelect`](https://react-tooltip.com/docs/examples/anchor-select) and [`render`](https://react-tooltip.com/docs/examples/render) props for more complex use cases.

```jsx
// ❌ BAD
<div className="items-container">
  {myItems.map(({ id, content, tooltip }) => (
    <div key={id} className="item" data-tooltip-id={`tooltip-${id}`}>
      {content}
      <Tooltip id={`tooltip-${id}`} content={tooltip} />
    </div>
  ))}
</div>
```

```jsx
// ✅ GOOD
<div className="items-container">
  {
    myItems.map(({ id, content, tooltip }) => (
      <div
        key={id}
        className="item"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={tooltip}
      >
        {content}
      </div>
    ))
  }
</div>
<Tooltip id="my-tooltip" />
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
