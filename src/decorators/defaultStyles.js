/**
 * Default pop-up style values (text color, background color).
 */
const defaultColors = {
  'dark': {'textColor': '#fff', 'backgroundColor': '#222', 'arrowColor': '#222'},
  'success': {'textColor': '#fff', 'backgroundColor': '#8DC572', 'arrowColor': '#8DC572'},
  'warning': {'textColor': '#fff', 'backgroundColor': '#F0AD4E', 'arrowColor': '#F0AD4E'},
  'error': {'textColor': '#fff', 'backgroundColor': '#BE6464', 'arrowColor': '#BE6464'},
  'info': {'textColor': '#fff', 'backgroundColor': '#337AB7', 'arrowColor': '#337AB7'},
  'light': {'textColor': '#222', 'backgroundColor': '#fff', 'arrowColor': '#fff'}
}

export function getDefaultPopupColors (type) { // TODO: gotta have a switch there looking at the classes originally provided by the plugin
  return defaultColors[type]
}
