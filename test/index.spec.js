import React from 'react'
import {expect} from 'chai'
const forEach = require('mocha-each')
const jsdom = require('mocha-jsdom')
import ReactTooltip from '../src/index.js'
import { render, cleanup } from '@testing-library/react'
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
            [{'textColor': 'green', 'backgroundColor': 'red', 'arrowColor': 'blue'}, 
              {popupType: 'type-custom', textColor: 'green', backgroundColor: 'red', arrowColor: 'blue'}],
            [{'textColor': 'green', 'backgroundColor': 'red', 'arrowColor': 'blue', 'borderColor': 'teal'}, 
              {popupType: 'type-custom', textColor: 'green', backgroundColor: 'red', arrowColor: 'blue', borderColor: 'transparent'}],
            [{'textColor': 'green', 'backgroundColor': 'red', 'arrowColor': 'blue', 'border': true, 'borderColor': 'teal'}, 
              {popupType: 'type-custom', textColor: 'green', backgroundColor: 'red', arrowColor: 'blue', borderColor: 'teal'}],
            [{'textColor': 'green', 'backgroundColor': 'red', 'arrowColor': 'blue', 'border': false, 'borderColor': 'teal'}, 
              {popupType: 'type-custom', textColor: 'green', backgroundColor: 'red', arrowColor: 'blue'}],
            [{'textColor': 'teal', 'backgroundColor': 'orange'}, 
              {popupType: 'type-custom', textColor: 'teal', backgroundColor: 'orange'}],
            [{'textColor': 'green', 'arrowColor': 'red'}, 
              {popupType: 'type-custom', textColor: 'green', backgroundColor: '#222', arrowColor: 'red'}], 
            [{'backgroundColor': 'green', 'arrowColor': 'yellow'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: 'green', arrowColor: 'yellow'}],
            [{'textColor': 'red'}, 
              {popupType: 'type-custom', textColor: 'red', backgroundColor: '#222'}],
            [{'textColor': 'red', 'borderColor': 'pink'}, 
              {popupType: 'type-custom', textColor: 'red', backgroundColor: '#222'}],
            [{'textColor': 'red', 'border': true, 'borderColor': 'pink'}, 
              {popupType: 'type-custom', textColor: 'red', backgroundColor: '#222', borderColor: 'pink'}],
            [{'backgroundColor': 'red'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: 'red'}],
            [{'backgroundColor': 'red', 'borderColor': 'yellow'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: 'red'}],
            [{'backgroundColor': 'red', 'border': true, 'borderColor': 'yellow'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: 'red', borderColor: 'yellow'}],
            [{'arrowColor': 'red'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: '#222', arrowColor: 'red'}],
            [{'arrowColor': 'red', 'borderColor': 'green'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: '#222', arrowColor: 'red'}],
            [{'arrowColor': 'red', 'border': true, 'borderColor': 'green'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: '#222', arrowColor: 'red', borderColor: 'green'}],
            [{'borderColor': 'blue'}, 
              {popupType: 'type-dark', textColor: '#fff', backgroundColor: '#222', arrowColor: '#222'}],
            [{'border': true, 'borderColor': 'blue'}, 
              {popupType: 'type-custom', textColor: '#fff', backgroundColor: '#222', arrowColor: '#222', borderColor: 'blue'}],
		]).it('Popup color generation - show', (props, res) => {
           render(<span id='colorSpecInvoker' data-tip data-for='colorSpec'>Invoker</span>)
           render(<ReactTooltip id='colorSpec' {...props}/>)

           const tooltip = document.getElementById('colorSpec')

           document.getElementById('colorSpecInvoker').dispatchEvent(new window.Event('mouseenter'))

           const tooltipGeneratedClass = spy.returnValues[1]['__react_component_tooltip'].className
           const tooltipGeneratedStyle = spy.returnValues[1]['__react_component_tooltip'].style

           expect(tooltip.className).to.
           equal(tooltipGeneratedClass + ' __react_component_tooltip show' + (props.border ? ' border ' : ' ') + 'place-top ' + res.popupType)

           expect(tooltipGeneratedStyle.color, 'Text color').to.equal(res.textColor)
           expect(tooltipGeneratedStyle.backgroundColor, 'Background color').to.equal(res.backgroundColor)
           expect(tooltipGeneratedStyle.border, 'Border color').to.equal('1px solid ' + (res.borderColor ? res.borderColor : 'transparent'))

           const arrowPositions = ['top', 'bottom', 'left', 'right']
           arrowPositions.forEach((pos) => {
              expect(tooltipGeneratedStyle['&.place-' + pos + '::after']['border-' + pos + '-color'], pos + ' arrow color').to.
              equal(res.arrowColor ? res.arrowColor : res.backgroundColor)
           })
  })
})