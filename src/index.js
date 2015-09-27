'use strict'

import React, { Component, PropTypes, findDOMNode } from 'react'
import classname from 'classnames'
import cssStyle from './style'

export default class ReactTooltip extends Component {

  _bind (...handlers) {
    handlers.forEach(handler => this[handler] = this[handler].bind(this))
  }

  static displayName = 'ReactTooltip'

  static hide () {
    window.dispatchEvent(new window.Event('__react_tooltip_hide_event'))
  }

  static rebuild () {
    window.dispatchEvent(new window.Event('__react_tooltip_rebuild_event'))
  }

  static eventHideMark = `hide${Date.now()}`
  static eventRebuildMark = `rebuild${Date.now()}`

  constructor (props) {
    super(props)
    this._bind('showTooltip', 'updateTooltip', 'hideTooltip')
    this.mount = true
    this.state = {
      show: false,
      multilineCount: 0,
      placeholder: '',
      x: 'NONE',
      y: 'NONE',
      place: '',
      type: '',
      effect: '',
      multiline: false,
      position: {}
    }
  }

  componentDidMount () {
    this.bindListener()
    /* Add window event listener for hide and rebuild */
    window.addEventListener('__react_tooltip_hide_event', ::this.globalHide, false)
    window.addEventListener('__react_tooltip_rebuild_event', ::this.globalRebuild, false)
  }

  /** Method for window.addEventListener
   *
   **/
  globalHide () {
    if(this.mount) {
      this.hideTooltip()
    }
  }

  globalRebuild () {
    if(this.mount) {
      this.unbindListener()
      this.bindListener()
    }
  }

  componentWillUnmount () {
    this.unbindListener()
    this.mount = false
    let tag = document.querySelector('style[id="react-tooltip"]')
    document.getElementsByTagName('head')[0].removeChild(tag)
    window.removeEventListener('__react_tooltip_hide_event', this.globalHide)
    window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild)
  }

  componentWillUpdate () {
    this.unbindListener()
  }

  componentDidUpdate () {
    this._updatePosition()
    this.bindListener()
  }

  bindListener () {
    let targetArray = document.querySelectorAll('[data-tip]')
    for (let i = 0 ; i < targetArray.length ; i++) {
      targetArray[i].addEventListener('mouseenter', this.showTooltip, false)
      targetArray[i].addEventListener('mousemove', this.updateTooltip, false)
      targetArray[i].addEventListener('mouseleave', this.hideTooltip, false)
    }
  }

  unbindListener () {
    let targetArray = document.querySelectorAll('[data-tip]')
    for (let i = 0 ; i < targetArray.length ; i++) {
      targetArray[i].removeEventListener('mouseenter', this.showTooltip)
      targetArray[i].removeEventListener('mousemove', this.updateTooltip)
      targetArray[i].removeEventListener('mouseleave', this.hideTooltip)
    }
  }

  _updatePosition () {
    let node = findDOMNode(this)

    let tipWidth = node.clientWidth
    let tipHeight = node.clientHeight
    let offset = {x: 0, y: 0}
    let { effect } = this.state
    if (effect === 'float') {
      if (this.state.place === 'top') {
        offset.x = -(tipWidth / 2)
        offset.y = -50
      } else if (this.state.place === 'bottom') {
        offset.x = -(tipWidth / 2)
        offset.y = 30
      } else if (this.state.place === 'left') {
        offset.x = -(tipWidth + 15)
        offset.y = -(tipHeight / 2)
      } else if (this.state.place === 'right') {
        offset.x = 10
        offset.y = -(tipHeight / 2)
      }
    }
    let xPosition = 0
    let yPosition = 0
    let {position} = this.state

    if (Object.prototype.toString.apply(position) === '[object String]') {
      position = JSON.parse(position.toString().replace(/\'/g, '\"'))
    }
    for (let key in position) {
      if (key === 'top') {
        yPosition -= parseInt(position[key], 10)
      } else if (key === 'bottom') {
        yPosition += parseInt(position[key], 10)
      } else if (key === 'left') {
        xPosition -= parseInt(position[key], 10)
      } else if (key === 'right') {
        xPosition += parseInt(position[key], 10)
      }
    }

    node.style.left = this.state.x + offset.x + xPosition + 'px'
    node.style.top = this.state.y + offset.y + yPosition + 'px'
  }

  showTooltip (e) {
    const originTooltip = e.target.getAttribute('data-tip')
    // Detect multiline
    const regexp = /<br\s*\/?>/
    const multiline = e.target.getAttribute('data-multiline') ? e.target.getAttribute('data-multiline') : (this.props.multiline ? this.props.multiline : false)
    let tooltipText
    let multilineCount = 0
    if (!multiline || multiline === 'false' || !regexp.test(originTooltip)) {
      tooltipText = originTooltip
    } else {
      tooltipText = originTooltip.split(regexp).map((d, i) => {
        multilineCount += 1
        return (
          <span key={i} className='multi-line'>{d}</span>
        )
      })
    }
    this.setState({
      placeholder: tooltipText,
      multilineCount: multilineCount,
      place: e.target.getAttribute('data-place') ? e.target.getAttribute('data-place') : (this.props.place ? this.props.place : 'top'),
      type: e.target.getAttribute('data-type') ? e.target.getAttribute('data-type') : (this.props.type ? this.props.type : 'dark'),
      effect: e.target.getAttribute('data-effect') ? e.target.getAttribute('data-effect') : (this.props.effect ? this.props.effect : 'float'),
      position: e.target.getAttribute('data-position') ? e.target.getAttribute('data-position') : (this.props.position ? this.props.position : {}),
      multiline: multiline
    })
    this.updateTooltip(e)
  }

  updateTooltip (e) {
    if (this.trim(this.state.placeholder).length > 0) {
      const {multilineCount, place} = this.state
      if (this.state.effect === 'float') {
        const offsetY = !multilineCount ? e.clientY : (place !== 'top' ? e.clientY : (e.clientY - multilineCount * 14.5))
        this.setState({
          show: true,
          x: e.clientX,
          y: offsetY
        })
      } else if (this.state.effect === 'solid') {
        const boundingClientRect = e.target.getBoundingClientRect()
        let targetTop = boundingClientRect.top
        let targetLeft = boundingClientRect.left
        let node = React.findDOMNode(this)
        let tipWidth = node.clientWidth
        let tipHeight = node.clientHeight
        let targetWidth = e.target.clientWidth
        let targetHeight = e.target.clientHeight
        let x
        let y
        if (place === 'top') {
          x = targetLeft - (tipWidth / 2) + (targetWidth / 2)
          y = targetTop - tipHeight - 8
        } else if (place === 'bottom') {
          x = targetLeft - (tipWidth / 2) + (targetWidth / 2)
          y = targetTop + targetHeight + 8
        } else if (place === 'left') {
          x = targetLeft - tipWidth - 6
          y = targetTop + (targetHeight / 2) - (tipHeight / 2)
        } else if (place === 'right') {
          x = targetLeft + targetWidth + 6
          y = targetTop + (targetHeight / 2) - (tipHeight / 2)
        }
        this.setState({
          show: true,
          x: this.state.x === 'NONE' ? x : this.state.x,
          y: this.state.y === 'NONE' ? y : this.state.y
        })
      }
    }
  }

  hideTooltip () {
    this.setState({
      show: false,
      x: 'NONE',
      y: 'NONE'
    })
  }

  render () {
    let tooltipClass = classname(
      '__react_component_tooltip',
      {'show': this.state.show},
      {'place-top': this.state.place === 'top'},
      {'place-bottom': this.state.place === 'bottom'},
      {'place-left': this.state.place === 'left'},
      {'place-right': this.state.place === 'right'},
      {'type-dark': this.state.type === 'dark'},
      {'type-success': this.state.type === 'success'},
      {'type-warning': this.state.type === 'warning'},
      {'type-error': this.state.type === 'error'},
      {'type-info': this.state.type === 'info'},
      {'type-light': this.state.type === 'light'}
    )

    if (!document.getElementsByTagName('head')[0].querySelector('style[id="react-tooltip"]')) {
      let tag = document.createElement('style')
      tag.id = 'react-tooltip'
      tag.innerHTML = cssStyle
      document.getElementsByTagName('head')[0].appendChild(tag)
    }

    return (
      <span className={tooltipClass} data-id='tooltip'>{this.state.placeholder}</span>
    )
  }

  trim (string) {
    if (Object.prototype.toString.call(string) !== '[object String]') {
      return string
    }
    let newString = string.split('')
    let firstCount = 0
    let lastCount = 0
    for (let i = 0 ; i < string.length ; i++) {
      if (string[i] !== ' ') {
        break
      }
      firstCount++
    }
    for (let i = string.length - 1 ; i >= 0 ; i--) {
      if (string[i] !== ' ') {
        break
      }
      lastCount++
    }
    newString.splice(0, firstCount)
    newString.splice(-lastCount, lastCount)
    return newString.join('')
  }

}

ReactTooltip.propTypes = {
  place: PropTypes.string,
  type: PropTypes.string,
  effect: PropTypes.string,
  position: PropTypes.object,
  multiline: PropTypes.bool
}
