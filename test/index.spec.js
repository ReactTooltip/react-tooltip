import React from 'react'
import {expect} from 'chai'
const forEach = require('mocha-each')
const jsdom = require('mocha-jsdom')
import ReactTooltip from '../src/index.js'
import { render, cleanup } from '@testing-library/react'
import jss from 'jss'

afterEach(cleanup)

describe('Tooltip', () => {
 	jsdom({url: 'http://localhost/'})

	forEach([[{'textColor': 'green', 'backgroundColor': 'red', 'arrowColor': 'blue'}]
		]).it('Popup color generation', (props) => {



//console.log(wrapper.renderer._element)


// console.log(jss)

	const tooltip = render(<ReactTooltip id='colorSpec' {...props}/>)
		const style = window.getComputedStyle(document.getElementById('colorSpec'))


		// console.log(document.getElementById('colorSpec'))
		// console.dir(style)


		// // console.dir(document.getElementById('colorSpec').classList[0])




    var cssText = "";


    var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
    for (var x = 0; x < classes.length; x++) {        
        // if (classes[x].selectorText == className) {
       		//console.dir(classes[x])
       		       	//	console.dir(classes[x].selectorText)
            cssText += classes[x].cssText || classes[x].style.cssText;
        // }         
    }
    // console.log(cssText)


		// //console.dir(window.getComputedStyle(tooltip))
	})
})