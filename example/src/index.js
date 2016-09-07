'use strict'

import React from 'react'
import {render, findDOMNode} from 'react-dom'
import ReactTooltip from '../../src'

const Test = React.createClass({

  getInitialState () {
    return {
      place: 'top',
      type: 'dark',
      effect: 'float',
      condition: false,
      disable: true
    }
  },

  changePlace (place) {
    this.setState({
      place: place
    })
  },

  changeType (type) {
    this.setState({
      type: type
    })
  },

  changeEffect (effect) {
    this.setState({
      effect: effect
    })
  },

  _onClick () {
    this.setState({
      condition: true
    })
  },

  showError () {
    this.setState({
      disable: false
    }, () => {
      ReactTooltip.show(findDOMNode(this.refs.btn))
    })
  },

  giveError () {
    return 'error'
  },

  render () {
    let { place, type, effect, disable } = this.state
    return (
      <div>
        <button ref='btn' data-tip onClick={this.showError} data-tip-disable={disable}>CLick</button>
        <ReactTooltip getContent={this.giveError} place='bottom' delayHide={1000} />
      </div>
    )
  }
})

render(<Test />, document.getElementById('main'))
