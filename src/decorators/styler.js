import { StyleSheet } from 'aphrodite-jss'
/**
 * Generates the tooltip style based on the element-specified "data-type" property.
 */
export function getTooltipStyle (colors) {
  const textColor = colors.textColor
  const backgroundColor = colors.backgroundColor
  const arrowColor = colors.arrowColor

  return StyleSheet.create({
    '__react_component_tooltip': {
      'color': textColor,
      'backgroundColor': backgroundColor,

      '&.place-top': {
        'margin-top': '-10px'
      },
      '&.place-top:after': {
        'border-left': '8px solid transparent',
        'border-right': '8px solid transparent',
        'bottom': '-6px',
        'left': '50%',
        'margin-left': '-8px',
        'border-top-color': arrowColor,
        'border-top-style': 'solid',
        'border-top-width': '6px'
      },

      '&.place-bottom': {
        'margin-top': '10px'
      },
      '&.place-bottom:after': {
        'border-left': '8px solid transparent',
        'border-right': '8px solid transparent',
        'top': '-6px',
        'left': '50%',
        'margin-left': '-8px',
        'border-bottom-color': arrowColor,
        'border-bottom-style': 'solid',
        'border-bottom-width': '6px'
      },

      '&.place-left': {
        'margin-left': '-10px'
      },
      '&.place-left:after': {
        'border-top': '5px solid transparent',
        'border-bottom': '5px solid transparent',
        'right': '-6px',
        'top': '50%',
        'margin-top': '-4px',
        'border-left-color': arrowColor,
        'border-left-style': 'solid',
        'border-left-width': '6px'
      },

      '&.place-right': {
        'margin-left': '10px'
      },
      '&.place-right:after': {
        'border-top': '5px solid transparent',
        'border-bottom': '5px solid transparent',
        'left': '-6px',
        'top': '50%',
        'margin-top': '-4px',
        'border-right-color': arrowColor,
        'border-right-style': 'solid',
        'border-right-width': '6px'
      }
    }
  })
}
