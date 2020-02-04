import React from 'react'
import {expect} from 'chai'
const forEach = require('mocha-each')
const jsdom = require('mocha-jsdom')
import ReactTooltip from '../src/index.js'
import { render, cleanup } from '@testing-library/react'
import jss from 'jss'
import * as Aphrodite from 'aphrodite-jss'
import sinon from 'sinon'

const spy = sinon.spy(Aphrodite.StyleSheet, 'create')

afterEach(() => {
    cleanup()
    spy.reset()
})

describe('Tooltip', () => {
 	jsdom({url: 'http://localhost/'})

	forEach([
            [{'textColor': 'green', 'backgroundColor': 'red', 'arrowColor': 'blue'}, {popupType: 'type-custom'}],
            [{'textColor': 'green', 'backgroundColor': 'red'}, {popupType: 'type-custom'}],
            [{'textColor': 'green', 'arrowColor': 'red'}, {popupType: 'type-dark'}], // all props must be set for custom theme
            [{'backgroundColor': 'green', 'arrowColor': 'red'}, {popupType: 'type-dark'}],
            [{'textColor': 'red'}, {popupType: 'type-dark'}],
            [{'backgroundColor': 'red'}, {popupType: 'type-dark'}],
            [{'arrowColor': 'red'}, {popupType: 'type-dark'}],
		]).it('Popup color generation', (props, res) => {

           render(<ReactTooltip id='colorSpec' {...props}/>)
           const tooltip = document.getElementById('colorSpec')
           const tooltipGeneratedClass = spy.returnValues[0]['__react_component_tooltip'].className
           const tooltipGeneratedStyle = spy.returnValues[0]['__react_component_tooltip'].style

           // TODO: text colour assert
           // TODO: background colour assert
           // TODO: arrow colour assert

           expect(tooltip.className).to.
           equal(tooltipGeneratedClass + ' __react_component_tooltip place-top ' + res.popupType)
	})
})