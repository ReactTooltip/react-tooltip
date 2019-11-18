import { StyleSheet } from 'aphrodite'
/**
 * Generates the tooltip style based on the element-specified "data-type" property.
 */
export function getTooltipStyle(textColor, backgroundColor, borderColor) {
    return StyleSheet.create({

        'base': {
            'color': textColor,
            'backgroundColor': backgroundColor,
            'border': '6px solid ' + borderColor
        },
        'place-top': {
            'backgroundColor': backgroundColor,
            'border': '1px solid' + borderColor,
            ':after': {
                'borderTop': '6px solid ' + backgroundColor
            },
            ':before': {
                'borderTop': '8px solid ' + borderColor
            }
        },
        'place-bottom': {
            'backgroundColor': backgroundColor,
            'border': '1px solid' + borderColor,
            ':after': {
                'borderBottom': '6px solid ' + backgroundColor
            },
            ':before': {
                'borderBottom': '8px solid ' + borderColor
            }
        },
        'place-left': {
            'backgroundColor': backgroundColor,
            'border': '1px solid' + borderColor,
            ':after': {
                'borderLeft': '6px solid ' + backgroundColor
            },
            ':before': {
                'borderLeft': '8px solid ' + borderColor
            }
        },
        'place-right': {
            'backgroundColor': backgroundColor,
            'border': '1px solid' + borderColor,
            ':after': {
                'borderRight': '6px solid ' + backgroundColor
            },
            ':before': {
                'borderRight': '8px solid ' + borderColor
            }
        }
        
    })
}