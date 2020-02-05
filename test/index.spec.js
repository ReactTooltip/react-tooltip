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
            [{'textColor': 'teal', 'backgroundColor': 'orange'}, 
              {popupType: 'type-custom', textColor: 'teal', backgroundColor: 'orange'}],
            [{'textColor': 'green', 'arrowColor': 'red'}, 
              {popupType: 'type-dark', textColor: '#fff', backgroundColor: '#222'},], // all props must be set for custom theme
            [{'backgroundColor': 'green', 'arrowColor': 'red'}, 
              {popupType: 'type-dark', textColor: '#fff', backgroundColor: '#222'}],
            [{'textColor': 'red'}, 
              {popupType: 'type-dark', textColor: '#fff', backgroundColor: '#222'}],
            [{'backgroundColor': 'red'}, 
              {popupType: 'type-dark', textColor: '#fff', backgroundColor: '#222'}],
            [{'arrowColor': 'red'}, 
              {popupType: 'type-dark', textColor: '#fff', backgroundColor: '#222'}],
		]).it('Popup color generation', (props, res) => {
           render(<ReactTooltip id='colorSpec' {...props}/>)

           const tooltip = document.getElementById('colorSpec')
           const tooltipGeneratedClass = spy.returnValues[0]['__react_component_tooltip'].className
           const tooltipGeneratedStyle = spy.returnValues[0]['__react_component_tooltip'].style


           expect(tooltip.className).to.
           equal(tooltipGeneratedClass + ' __react_component_tooltip place-top ' + res.popupType)

           expect(tooltipGeneratedStyle.color, 'Text color').to.equal(res.textColor)
           expect(tooltipGeneratedStyle.backgroundColor, 'Background color').to.equal(res.backgroundColor)

           const arrowPositions = ['top', 'bottom', 'left', 'right']
           arrowPositions.forEach((pos) => {
              expect(tooltipGeneratedStyle['&.place-' + pos + ':after']['border-' + pos + '-color'], pos + ' arrow color').to.
              equal(res.arrowColor ? res.arrowColor : res.backgroundColor)
           })
  })
})