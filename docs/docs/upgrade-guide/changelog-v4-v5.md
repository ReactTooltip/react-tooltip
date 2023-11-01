---
sidebar_position: 1
---

# Changelog V4 -> V5

If you are using V4 and want to upgrade to V5, you can see what changed below.

## From V4 to V5

V4 was a great react tooltip component but was built a while ago using React class components, whick makes it hard to maintain, and for the community give contributions.

With this in mind, we built a new version of ReactTooltip using [floating-ui](https://floating-ui.com/) behind the scenes. 
This resulted in a great improvement in performance, and made it easier for the community to contribute to the project.

## Improvements

- Dropped package dependency `uuid`
- Dropped package dependency `prop-types`
- V5 is written in TypeScript
- V5 has minified and unminified files available to be used as you want

## Breaking Changes

- All data attributes are now prefixed with `data-tooltip-`
- Default Padding changed from `padding: 8px 21px;` to `padding: 8px 16px;`
- Exported module now is `Tooltip` instead of `ReactTooltip`
- If you already have a `Tooltip` component in your application and want to explicitly declare this as `ReactTooltip`, just `import { Tooltip as ReactTooltip } from "react-tooltip"`
- `data-for` attribute now is `data-tooltip-id`
- `data-tip` attribute now is `data-tooltip-content`
- `getContent` prop was removed. Instead, you can directly pass dynamic content to the `content` tooltip prop, or to `data-tooltip-content` in the anchor element, or use the new `render` tooltip prop
- Default behavior of tooltip now is equivalent to V4's `solid` effect, instead of `float`. The new `float` prop can be set to achieve V4's `effect="float"`. See [Options](../options.mdx) for more details

## What about `ReactTooltip.rebuild()`?

A common question V4 users have when upgrading to V5 is about `ReactTooltip.rebuild()`.
Rebuilding the tooltip was a required step when using V4 with dynamic content. It isn't necessary when using V5.

The tooltip component now automatically watches for any changes made to the DOM and updates accordingly, without any extra steps needed.

If you run into any problems with the tooltip not updating after changes are made in other components, please open a [GitHub issue](https://github.com/ReactTooltip/react-tooltip/issues/new/choose) reporting what you find, ideally with a sample [CodeSandbox](https://codesandbox.io/) (or something similar) to help us pinpoint the problem.

## New Props

- [x] `classNameArrow`
- [x] `openOnClick` - `boolean` - when set, the tooltip will open on click instead of on hover
- [x] `isOpen` - `boolean` (to control tooltip state) - if not used, tooltip state will be handled internally
- [x] `setIsOpen` - `function` (to control tooltip state) - if not used, tooltip state will be handled internally
- [x] `position` - `{ x: number; y: number }` - similar to V4's `overridePosition`
- [x] `float` - `boolean` - used to achieve V4's `effect="float"`
- [x] `hidden` - `boolean` - when set, the tooltip will not show
- [x] `render` - `function` - can be used to render dynamic content based on the active anchor element (check [the examples](../examples/render.mdx) for more details)
- [x] `closeOnEsc` - **DEPRECATED** - ~~`boolean` - when set, the tooltip will close after pressing the escape key~~
- [x] `closeOnScroll` - **DEPRECATED** - ~~`boolean` - when set, the tooltip will close when scrolling (similar to V4's `scrollHide`)~~
- [x] `closeOnResize` - **DEPRECATED** - ~~`boolean` - when set, the tooltip will close when resizing the window (same as V4's `resizeHide`)~~

:::note

Use `globalCloseEvents` instead of `closeOnEsc`, `closeOnScroll`, and `closeOnResize`. See the [options page](../options.mdx#available-props) for more details.

:::

## `V4` props available in `V5`

- [x] `children`
- [x] `place` - also available on anchor element as `data-tooltip-place`
- [ ] `type` - use `variant`. also available on anchor element as `data-tooltip-variant`
- [ ] `effect` - use `float` prop
- [x] `offset` - also available on anchor element as `data-tooltip-offset`
- [ ] `padding` - use `className` and custom CSS
- [ ] `multiline` - supported by default in `content` and `html` props
- [x] `border`
- [ ] `borderClass` - use `border` prop
- [ ] `textColor` - use `className` and custom CSS
- [ ] `backgroundColor` - use `className` and custom CSS
- [ ] `borderColor` - use `border` prop
- [x] `arrowColor`
- [ ] `arrowRadius` - use `className` and custom CSS
- [ ] `tooltipRadius` - use `className` and custom CSS
- [ ] `insecure`
- [x] `className`
- [x] `id`
- [x] `html`
- [x] `delayHide` - also available on anchor element as `data-delay-hide`
- [ ] `delayUpdate` - can be implemented if requested
- [x] `delayShow` - also available on anchor element as `data-delay-show`
- [x] `event` - functionality changed and renamed to `openEvents`
- [x] `eventOff` - functionality changed and renamed to `closeEvents`
- [ ] `isCapture`
- [x] `globalEventOff` - functionality changed and renamed to `globalCloseEvents`
- [ ] `getContent` - pass dynamic values to `content` instead
- [x] `afterShow`
- [x] `afterHide`
- [ ] `overridePosition` - use `position`
- [ ] `disable`
- [x] `scrollHide` - renamed to `closeOnScroll`
- [x] `resizeHide` - renamed to `closeOnResize`
- [x] `wrapper` - also available on anchor element as `data-tooltip-wrapper`
- [ ] `bodyMode`
- [x] `clickable`
- [x] `disableInternalStyle` - renamed to `disableStyleInjection`

### Detailed informations

- [The V5 pull request](https://github.com/ReactTooltip/react-tooltip/pull/820).

---

Check [all V5 options here](../options.mdx).
