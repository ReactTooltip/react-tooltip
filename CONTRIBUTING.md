# Contribution

## Running The Project Locally

### ReactTooltip (root)

1. Run `npm install` or `yarn` to install dependencies.
2. You can test the local playground with `yarn dev`, or run the docs against the local package build by following the docs section below.

### Docs

You still need step 1 from the `ReactTooltip (root)` section.
The docs are committed using the published npm package, but you can point them at the local ReactTooltip build while developing.

1. In the **docs** folder, run `npm install` or `yarn` to install dependencies.
2. In the **root** folder (parent of the docs folder), run `yarn build` to generate `dist/`. The docs import the local package through its package exports, so they need the root `dist` files.
3. Change `docs/package.json`:

From this:
```json
"react": "18.3.1",
"react-dom": "18.3.1",
"react-tooltip": "6.0.1"
```

To this:
```json
"react": "link:../node_modules/react",
"react-dom": "link:../node_modules/react-dom",
"react-tooltip": "link:.."

```

4. In the **docs** folder, run `yarn` again so the links are installed.
5. Run `yarn start` from the **docs** folder and open `localhost:3000` to see docs running with the local ReactTooltip build.

Do not commit the `docs/package.json` and `docs/yarn.lock` local-link changes. The deployed docs should keep using the published npm package.
