---
sidebar_position: 2
---

# Changelog V5 -> V6

If you are using V5 and want to upgrade to V6, the biggest breaking change is the removal of the raw HTML string API, but it is not the only difference worth checking before migrating.

## From V5 to V6

V6 keeps the core tooltip behavior from V5, but updates the implementation and API around a few key areas:

- rich tooltip content is rendered through React nodes instead of injected HTML strings
- runtime behavior is lighter and more scalable in larger interfaces
- React 19 is supported while React 16.14+ remains compatible
- optional `portalRoot` support lets you render the tooltip into a custom DOM container when you need tighter control over clipping and overlay layout

## Breaking Changes

- `data-tooltip-html` was removed
- `html` prop was removed
- Raw HTML string examples should now be implemented with `children` or `render`

## New And Updated Capabilities

- `children` and `render` are the preferred way to render rich tooltip content in v6
- `portalRoot` is available when the tooltip should render into a specific DOM node, such as `document.body`
- v6 includes internal runtime improvements that reduce mount cost, memory retention, and shipped bundle size relative to v5

## `portalRoot`

When a layout clips overlays or makes stacking difficult, you can render the tooltip into a separate container:

```jsx
<Tooltip
  id="my-tooltip"
  content="Hello"
  portalRoot={document.body}
  positionStrategy="fixed"
/>
```

`portalRoot` is optional. If you do not provide it, the tooltip keeps the existing inline render behavior.

When portaling to `document.body`, `positionStrategy="fixed"` is the safest default because it avoids most coordinate-space and overflow issues.

## What should I use instead?

### Replace `data-tooltip-html` with tooltip `children`

```jsx
<a data-tooltip-id="my-tooltip">◕‿‿◕</a>
<Tooltip id="my-tooltip">
  <div>
    <h3>Cool stuff</h3>
    <ul>
      <li>This is cool</li>
      <li>This too</li>
    </ul>
  </div>
</Tooltip>
```

### Replace `html` with `render`

```jsx
<a data-tooltip-id="my-tooltip">◕‿‿◕</a>
<Tooltip
  id="my-tooltip"
  render={() => (
    <div>
      Hello
      <br />
      <b>rich</b> content
    </div>
  )}
/>
```

## Multiline content

If you previously used HTML strings for multiline tooltips, render JSX instead:

```jsx
<Tooltip id="my-tooltip">
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <span>Hello</span>
    <span>some stuff in between</span>
    <span>world!</span>
  </div>
</Tooltip>
```

## Notes

- `data-tooltip-content` is still supported for plain string content
- `content` is still supported for plain string content
- `children` and `render` are now the recommended way to display rich tooltip content
- `portalRoot` is optional and only needed when you want the tooltip rendered outside its default location

Check the current examples for [children](../examples/children.mdx), [render](../examples/render.mdx), and [multiline content](../examples/multiline.mdx).
