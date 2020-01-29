/**
 * Default pop-up style values (text color, background color).
 */
const defaultColors = {
  'info': {'textColor': '#fff', 'backgroundColor': '#337AB7', 'arrowColor': '#337AB7'} // TODO: cover all classes
}

export function getDefaultPopupColors (type) { // TODO: gotta have a switch there looking at the classes originally provided by the plugin
  return defaultColors[type]
}
