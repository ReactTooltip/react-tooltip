import { StyleSheet } from 'aphrodite-jss'
/**
 * Generates the tooltip style based on the element-specified "data-type" property.
 */
export function getTooltipStyle(textColor, backgroundColor, borderColor) {

    return StyleSheet.create({

        '__react_component_tooltip': {
            'color': textColor,
            'backgroundColor': backgroundColor,
            'border': '6px solid ' + borderColor,


            // TODO: JUST TEST WORKING EXAMPLE - REMOVE WHEN DONE
            // '&.place-top' : {
            //  	'width' : '5000px !important'
            //  },
            //  '&.place-top' : {
            //  	'width' : '6000px !important'
            //  },
            //  // TODO: JUST TEST

            '&.place-top': {
                'marginTop': '-10px',
                'backgroundColor': backgroundColor,
                'border': '1px solid' + borderColor,

                '&:before': {
                    'borderLeft': '10px solid transparent',
                    'borderRight': '10px solid transparent',
                    'bottom': '-8px',
                    'left': '50%',
                    'marginLeft': '-10px'
                },
                '&:after': {
                    'borderLeft': '8px solid transparent',
                    'borderRight': '8px solid transparent',
                    'bottom': '-6px',
                    'left': '50%',
                    'marginLeft': '-8px'
                },
            },

            // TODO: WHERE DOES IT GO??? GOTTA BE SOMEWHERE! - check the existing example: https://react-tooltip.netlify.com/
            ':after': {
                'textAlign': 'right !important', // TODO: DEL DEBUG
                'borderTop': '6px solid violet !important', //'6px solid ' + backgroundColor, // TODO: REVERT TO SET COLOUR WHEN DONE DEV
                'fontWeight': 'bold' // TODO: DEL DEBUG
            },
            ':before': {
                'textAlign': 'right !important', // TODO: DEL DEBUG
                'borderTop': '8px solid violet !important', //'8px solid ' + borderColor, // TODO: REVERT TO SET COLOUR WHEN DONE DEV
                'fontWeight': 'bold' // TODO: DEL DEBUG
            }

            // '.place-bottom': {
            //     'backgroundColor': backgroundColor,
            //     'border': '1px solid' + borderColor,
            //     ':after': {
            //         'borderBottom': '6px solid ' + backgroundColor
            //     },
            //     ':before': {
            //         'borderBottom': '8px solid ' + borderColor
            //     }
            // },
            // '.place-left': {
            //     'backgroundColor': backgroundColor,
            //     'border': '1px solid' + borderColor,
            //     ':after': {
            //         'borderLeft': '6px solid ' + backgroundColor
            //     },
            //     ':before': {
            //         'borderLeft': '8px solid ' + borderColor
            //     }
            // },
            // '.place-right': {
            //     'backgroundColor': backgroundColor,
            //     'border': '1px solid' + borderColor,
            //     ':after': {
            //         'borderRight': '6px solid ' + backgroundColor
            //     },
            //     ':before': {
            //         'borderRight': '8px solid ' + borderColor
            //     }
            // }
        }

    })
}