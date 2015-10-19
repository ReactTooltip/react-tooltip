'use strict'

import React, { Component, PropTypes } from 'react'
import {findDOMNode} from 'react-dom'
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
      offset: {},
      extraClass: '',
      html: false,
      delayHide: 0
    }
  }

  componentDidMount () {
    this.bindListener()
    /* Add window event listener for hide and rebuild */
    window.removeEventListener('__react_tooltip_hide_event', this.globalHide)
    window.addEventListener('__react_tooltip_hide_event', ::this.globalHide, false)

    window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild)
    window.addEventListener('__react_tooltip_rebuild_event', ::this.globalRebuild, false)
  }

  /** Method for window.addEventListener
   *
   **/
  globalHide () {
    if (this.mount) {
      this.hideTooltip()
    }
  }

  globalRebuild () {
    if (this.mount) {
      this.unbindListener()
      this.bindListener()
    }
  }

  componentWillUnmount () {
    this.unbindListener()
    this.mount = false
    let tag = document.querySelector('style[id="react-tooltip"]')

    if (tag !== null) {
      document.getElementsByTagName('head')[0].removeChild(tag)
    }

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
    const {id} = this.props
    let targetArray

    if (id === undefined) {
      targetArray = document.querySelectorAll('[data-tip]:not([data-for])')
    } else {
      targetArray = document.querySelectorAll('[data-tip][data-for="' + id + '"]')
    }

    for (let i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener('mouseenter', this.showTooltip)
      targetArray[i].addEventListener('mouseenter', this.showTooltip, false)

      targetArray[i].removeEventListener('mousemove', this.updateTooltip)
      targetArray[i].addEventListener('mousemove', this.updateTooltip, false)

      targetArray[i].removeEventListener('mouseleave', this.hideTooltip)
      targetArray[i].addEventListener('mouseleave', this.hideTooltip, false)
    }
  }

  unbindListener () {
    let targetArray = document.querySelectorAll('[data-tip]')
    for (let i = 0; i < targetArray.length; i++) {
      targetArray[i].removeEventListener('mouseenter', this.showTooltip)
      targetArray[i].removeEventListener('mousemove', this.updateTooltip)
      targetArray[i].removeEventListener('mouseleave', this.hideTooltip)
    }
  }

  _updatePosition () {
    let node = findDOMNode(this)

    let tipWidth = node.clientWidth
    let tipHeight = node.clientHeight
    let offsetFormEffect = {x: 0, y: 0}
    let { effect } = this.state
    if (effect === 'float') {
      if (this.state.place === 'top') {
        offsetFormEffect.x = -(tipWidth / 2)
        offsetFormEffect.y = -tipHeight
      } else if (this.state.place === 'bottom') {
        offsetFormEffect.x = -(tipWidth / 2)
        offsetFormEffect.y = 15
      } else if (this.state.place === 'left') {
        offsetFormEffect.x = -(tipWidth + 15)
        offsetFormEffect.y = -(tipHeight / 2)
      } else if (this.state.place === 'right') {
        offsetFormEffect.x = 10
        offsetFormEffect.y = -(tipHeight / 2)
      }
    }
    let xPosition = 0
    let yPosition = 0
    let {offset} = this.state

    if (Object.prototype.toString.apply(offset) === '[object String]') {
      offset = JSON.parse(offset.toString().replace(/\'/g, '\"'))
    }
    for (let key in offset) {
      if (key === 'top') {
        yPosition -= parseInt(offset[key], 10)
      } else if (key === 'bottom') {
        yPosition += parseInt(offset[key], 10)
      } else if (key === 'left') {
        xPosition -= parseInt(offset[key], 10)
      } else if (key === 'right') {
        xPosition += parseInt(offset[key], 10)
      }
    }
    /* When tooltip over the screen */
    const styleLeft = this.state.x + offsetFormEffect.x + xPosition
    const styleTop = this.state.y + offsetFormEffect.y + yPosition
    const windoWidth = window.innerWidth
    const windowHeight = window.innerHeight

    /* Solid use this method will get Uncaught RangeError: Maximum call stack size exceeded */
    if (effect === 'float') {
      if (styleLeft < 0) {
        this.setState({
          place: 'right'
        })
        return
      } else if (styleLeft + tipWidth > windoWidth) {
        this.setState({
          place: 'left'
        })
        return
      } else if (styleTop < 0) {
        this.setState({
          place: 'bottom'
        })
        return
      } else if (styleTop + tipHeight > windowHeight) {
        this.setState({
          place: 'top'
        })
        return
      }
    }

    node.style.left = styleLeft + 'px'
    node.style.top = styleTop + 'px'
  }

  showTooltip (e) {
    e.stopPropagation()
    const originTooltip = e.target.getAttribute('data-tip')
    /* Detect multiline */
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
    /* Define extra class */
    let extraClass = e.target.getAttribute('data-class') ? e.target.getAttribute('data-class') : ''
    extraClass = this.props.class ? this.props.class + ' ' + extraClass : extraClass
    this.setState({
      placeholder: tooltipText,
      multilineCount: multilineCount,
      place: e.target.getAttribute('data-place') ? e.target.getAttribute('data-place') : (this.props.place ? this.props.place : 'top'),
      type: e.target.getAttribute('data-type') ? e.target.getAttribute('data-type') : (this.props.type ? this.props.type : 'dark'),
      effect: e.target.getAttribute('data-effect') ? e.target.getAttribute('data-effect') : (this.props.effect ? this.props.effect : 'float'),
      offset: e.target.getAttribute('data-offset') ? e.target.getAttribute('data-offset') : (this.props.offset ? this.props.offset : {}),
      extraClass,
      multiline,
      html: e.target.getAttribute('data-html') ? e.target.getAttribute('data-html') : (this.props.html ? this.props.html : false),
      delayHide: e.target.getAttribute('data-delay-hide') ? e.target.getAttribute('data-delay-hide') : (this.props.delayHide ? this.props.delayHide : 0)
    })
    this.updateTooltip(e)
  }

  updateTooltip (e) {
    e.stopPropagation()
    if (this.trim(this.state.placeholder).length > 0) {
      const {place} = this.state
      const node = findDOMNode(this)
      if (this.state.effect === 'float') {
        // const offsetY = e.clientY
        this.setState({
          show: true,
          x: e.clientX,
          y: e.clientY
        })
      } else if (this.state.effect === 'solid') {
        const boundingClientRect = e.target.getBoundingClientRect()
        const targetTop = boundingClientRect.top
        const targetLeft = boundingClientRect.left
        const tipWidth = node.clientWidth
        const tipHeight = node.clientHeight
        const targetWidth = e.target.clientWidth
        const targetHeight = e.target.clientHeight
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
    const {delayHide} = this.state
    setTimeout(() => {
      this.setState({
        show: false,
        x: 'NONE',
        y: 'NONE'
      })
    }, parseInt(delayHide, 10))
  }

  render () {
    const {placeholder, extraClass, html} = this.state

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

    if (html) {
      return (
        <span className={tooltipClass + ' ' + extraClass} data-id='tooltip' dangerouslySetInnerHTML={{__html: placeholder}}></span>
      )
    } else {
      const content = this.props.children ? this.props.children : placeholder
      return (
        <span className={tooltipClass + ' ' + extraClass} data-id='tooltip'>{content}</span>
      )
    }
  }

  trim (string) {
    if (Object.prototype.toString.call(string) !== '[object String]') {
      return string
    }
    let newString = string.split('')
    let firstCount = 0
    let lastCount = 0
    for (let i = 0; i < string.length; i++) {
      if (string[i] !== ' ') {
        break
      }
      firstCount++
    }
    for (let i = string.length - 1; i >= 0; i--) {
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
  children: PropTypes.any,
  place: PropTypes.string,
  type: PropTypes.string,
  effect: PropTypes.string,
  offset: PropTypes.object,
  multiline: PropTypes.bool,
  class: PropTypes.string,
  id: PropTypes.string,
  html: PropTypes.bool,
  delayHide: PropTypes.number
}
