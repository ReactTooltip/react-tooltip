---
sidebar_position: 1
---

# Changelog V4 -> V5

If you are using V4 and want to use V5, please read this doc.

## From V4 to V5

V4 was a great react tooltip component but was built a few years ago, he was built with react class components and it's hard to maintain and to the community give contributions, so, with this in mind, we build a new version of react tooltip using [floating-ui](https://floating-ui.com/) behind the scenes. This gives a great improvement in performance and in a new and easier code to let the community contribute to the project.

## Improvements

- Dropped package dependency `uuid`
- Dropped package dependency `prop-types`
- V5 is written in TypeScript
- V5 has minified and unminified files available to be used as you want

## Breaking Changes

- All data attributes are now prefixed with `data-tooltip-`
- Default Padding changed from `padding: 8px 21px;` to `padding: 8px 16px;`
- Exported module now is `Tooltip` instead of `ReactTooltip`
- - If you already have a `Tooltip` component in your application and want to explicitly declare this is `ReactTooltip`, just `import { Tooltip as ReactTooltip } from "react-tooltip"`
- CSS import is now optional, so you can modify and/or add any styling to your floating tooltip element
- `data-tip` attribute now is `data-tooltip-content`
- `getContent` prop was removed. Instead, you can directly pass dynamic content to the `content` tooltip prop, or to `data-tooltip-content` in the anchor element
- Default behavior of tooltip now is equivalent to V4's `solid` effect, instead of `float`. The new `float` prop can be set to achieve V4's `effect="float"`. See [Options](../options.mdx) for more details.

## New Props

- [x] `classNameArrow`
- [x] `events` (or `data-tooltip-events` on anchor element) - `['hover', 'click']` - default: `['hover']` (always an array when using as prop, even with only one option, when using as data attribute: `data-tooltip-events="hover click"`)
- [x] `isOpen` - `boolean` (to control tooltip state) - if not used, tooltip state will be handled internally
- [x] `setIsOpen` - `function` (to control tooltip state) - if not used, tooltip state will be handled internally
- [x] `position` - `{ x: number; y: number }` - similar to V4's `overridePosition`
- [x] `float` - `boolean` - used to achieve V4's `effect="float"`

## `V4` props available in `V5`

- [x] `children`
- [x] `place` - also available on anchor element as `data-tooltip-place`
- [ ] `type` - use `variant`. also available on anchor element as `data-tooltip-variant`
- [ ] `effect` - use `float` prop
- [x] `offset` - also available on anchor element as `data-tooltip-offset`
- [ ] `padding` - use `className` and custom CSS
- [ ] `multiline` - supported by default in `content` and `html` props
- [ ] `border` - use `className` and custom CSS
- [ ] `borderClass` - use `className` and custom CSS
- [ ] `textColor` - use `className` and custom CSS
- [ ] `backgroundColor` - use `className` and custom CSS
- [ ] `borderColor` - use `className` and custom CSS
- [ ] `arrowColor` - use `className` and custom CSS
- [ ] `arrowRadius` - use `className` and custom CSS
- [ ] `tooltipRadius` - use `className` and custom CSS
- [ ] `insecure` - CSS will be a separate file and can be imported or not
- [x] `className`
- [x] `id`
- [x] `html`
- [x] `delayHide` - also available on anchor element as `data-delay-hide`
- [ ] `delayUpdate` - if requested, can be implemented later
- [x] `delayShow` - also available on anchor element as `data-delay-show`
- [ ] `event`
- [ ] `eventOff`
- [ ] `isCapture`
- [ ] `globalEventOff`
- [ ] `getContent` - use dynamic `content`
- [x] `afterShow`
- [x] `afterHide`
- [ ] `overridePosition` - use `position`
- [ ] `disable` - state can be controlled or uncontrolled
- [ ] `scrollHide` - if requested, can be implemented later
- [ ] `resizeHide` - if requested, can be implemented later
- [x] `wrapper` - also available on anchor element as `data-tooltip-wrapper`
- [ ] `bodyMode`
- [x] `clickable`
- [ ] `disableInternalStyle` - CSS will be a separate file and can be imported or not

### Detailed informations

- [The Pull Request of V5](https://github.com/ReactTooltip/react-tooltip/pull/820)

---

Please see [all V5 Options here](../options.mdx).
