---
sidebar_position: 2
---

# Changelog V5 -> V6

If you are using V5 and want to upgrade to V6, the main change is the removal of the raw HTML string API.

## From V5 to V6

V6 keeps the core tooltip behavior from V5, but removes legacy HTML-string entry points so tooltip content stays in React nodes instead of injected markup strings.

## Breaking Changes

- `data-tooltip-html` was removed
- `html` prop was removed
- Raw HTML string examples should now be implemented with `children` or `render`

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

Check the current examples for [children](../examples/children.mdx), [render](../examples/render.mdx), and [multiline content](../examples/multiline.mdx).
