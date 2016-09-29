# gxa-react-tooltip

This is a fork of wwayne's excellent [react-tooltip](https://github.com/wwayne/react-tooltip)

## Installation

For now, git clone the repo, and use the dist branch.

## Purpose

At [Expression Atlas](www.ebi.ac.uk/gxa) we wanted to support a UX pattern of
- hover over element
- get info about it
- optionally click to get more info and interactive content
- click to dismiss

So it's a tooltip turning into a modal, pretty much.

We might also try make this play better with reactive updates since also at the moment we use a hack to make it update like we need it to when interacting with our SVG based heatmap.

## Extra Options

Global	|Type	|Values  |  Description
|:---|:---|:---|:---|:----
 frozen	|   Bool  |  true, false | On change into frozen, the tooltip stops updating and lets you interact with it.

## Using react component as tooltip
Check the example [React-tooltip Test](http://wwayne.com/react-tooltip)

### License

MIT
