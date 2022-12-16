---
sidebar_position: 1
---

# Changelog V4 -> V5

If you are using V4 and want to use V5, please read this doc.

## From V4 to V5

V4 was a great react tooltip component but was built a few years ago, he was built with react class components and it's hard to maintain and to the community give contributions, so, with this in mind, we build a new version of react tooltip using [float-ui](https://floating-ui.com/) behind the scenes. This gives a great improvement in performance and in a new and easier code to let the community contribute to the project.

## Improvements

- Dropped package dependency `uuid`
- - Using React `useId` - [Docs](https://reactjs.org/docs/hooks-reference.html#useid)
- - - Unfortunately `useId` was introduced only into React v18, so, that will be the minimum necessary version of React to V5
- Dropped package dependency `prop-types`
- V5 is written in TypeScript
- V5 has minified and unminified files available to be used as you want

## Break Changes

- All data attributes now has `tooltip` into his name
- Default Padding changed from `padding: 8px 21px;` to `padding: 8px 16px;`
- Exported module now is `Tooltip` instead of `ReactTooltip`
- - If you already have a `Tooltip` component in your application and want to explicitly declare this is `ReactTooltip`, just `import { Tooltip as ReactTooltip } from "react-tooltip"`
- CSS import is now optional, so, you can modify and/or add any styling to your floating tooltip element
- `data-tip` attribute now is `data-tooltip-content`
- `getContent` prop was removed. Instead, you can directly pass dynamic content to the `content` tooltip prop, or to `data-tooltip-content`
- default behavior of tooltip now is `solid` instead of `float`

## New Props

- [x] classNameArrow
- [x] events - `data-tooltip-events` -`['hover', 'click']` - default: `['hover']` (always an array when using as prop, even with only one option, when using as data attribute: `data-tooltip-events="hover click"`)
- [x] isOpen - `boolean` (to control tooltip state) - if not used, internal state of tooltip will handle the show state
- [x] setIsOpen - `function` (to control tooltip state) - if not used, internal state of tooltip will handle the show state

## `V4` props available in `V5`

- [x] children
- [x] place - `data-tooltip-place`
- [x] type - **Deprecated** | in V5 -> `variant` - `data-tooltip-variant`
- [ ] effect - not implemented yet, if many users need this feature, we will work on this one.
- [x] offset - `data-tooltip-offset`
- [ ] padding - **Deprecated** | in V5 -> can be easy updated by className prop
- [ ] multiline - **Deprecated** | in V5 -> this is already supported as default by `content` and `html` props
- [ ] border - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] borderClass - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] textColor - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] backgroundColor - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] borderColor - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] arrowColor - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] arrowRadius - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] tooltipRadius - **Deprecated** | in V5 -> can be easy updated by `className` prop
- [ ] insecure - **Deprecated** | in V5 -> CSS will be a separate file and can be imported or not
- [x] className
- [x] id
- [x] html
- [x] delayHide - `data-tooltip-delay-hide`
- [ ] delayUpdate - **Deprecated** | if requested, can be implemented later
- [x] delayShow - `data-tooltip-delay-show`
- [ ] event - not implemented yet, if many users need this feature, we will work on this one.
- [ ] eventOff - **Deprecated**
- [ ] isCapture - **Deprecated**
- [ ] globalEventOff - **Deprecated**
- [ ] getContent - use dynamic `content` instead
- [ ] afterShow - not implemented yet, if many users need this feature, we will work on this one.
- [ ] afterHide - not implemented yet, if many users need this feature, we will work on this one.
- [ ] overridePosition - **Deprecated**
- [ ] disable - **Deprecated** | in V5 -> state can be controlled or uncontrolled
- [ ] scrollHide - not implemented yet, if many users need this feature, we will validate if we wrok on this one.
- [ ] resizeHide - not implemented yet, if many users need this feature, we will validate if we wrok on this one.
- [x] wrapper - `data-tooltip-wrapper`
- [ ] bodyMode - **Deprecated**
- [ ] clickable - **Deprecated** | Supported by default in V5
- [ ] disableInternalStyle - **Deprecated** | in V5 -> CSS will be a separate file and can be imported or not

### Detailed informations

- [The Pull Request of V5](https://github.com/ReactTooltip/react-tooltip/pull/820)

---

Please see [all V5 Options here](../options.mdx).
