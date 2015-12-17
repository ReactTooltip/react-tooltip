'use strict'

import React, { Component, PropTypes } from 'react'
import {findDOMNode} from 'react-dom'
import classname from 'classnames'
import cssStyle from './style'

export default class ReactTooltip extends Component {

  static displayName = 'ReactTooltip'

  /**
   * Class method
   * @see ReactTooltip.hide() && ReactTooltup.rebuild()
   */
  static hide () {
    /**
     * Check for ie
     * @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
     */
    if (typeof window.Event === 'function') {
      window.dispatchEvent(new window.Event('__react_tooltip_hide_event'))
    } else {
      let event = document.createEvent('Event')
      event.initEvent('__react_tooltip_hide_event', false, true)
      window.dispatchEvent(event)
    }
  }

  static rebuild () {
    if (typeof window.Event === 'function') {
      window.dispatchEvent(new window.Event('__react_tooltip_rebuild_event'))
    } else {
      let event = document.createEvent('Event')
      event.initEvent('__react_tooltip_rebuild_event', false, true)
      window.dispatchEvent(event)
    }
  }

  static eventHideMark = `hide${Date.now()}`
  static eventRebuildMark = `rebuild${Date.now()}`

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

  constructor (props) {
    super(props)
    this._bind('showTooltip', 'updateTooltip', 'hideTooltip', 'checkStatus', 'onWindowResize')
    this.mount = true
    this.state = {
      show: false,
      border: false,
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
      delayHide: 0,
      delayShow: 0,
      event: props.event || null
    }
    this.delayShowLoop = null
  }

  /* Bind this with method */
  _bind (...handlers) {
    handlers.forEach(handler => this[handler] = this[handler].bind(this))
  }

  componentDidMount () {
    this.bindListener()
    this.setStyleHeader()
    /* Add window event listener for hide and rebuild */
    window.removeEventListener('__react_tooltip_hide_event', this.globalHide)
    window.addEventListener('__react_tooltip_hide_event', ::this.globalHide, false)

    window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild)
    window.addEventListener('__react_tooltip_rebuild_event', ::this.globalRebuild, false)
    /* Add listener on window resize  */
    window.removeEventListener('resize', this.onWindowResize)
    window.addEventListener('resize', ::this.onWindowResize, false)
  }

  componentWillUpdate () {
    this.unbindListener()
  }

  componentDidUpdate () {
    this.updatePosition()
    this.bindListener()
  }

  componentWillUnmount () {
    this.unbindListener()
    this.removeScrollListener()
    this.mount = false
    window.removeEventListener('__react_tooltip_hide_event', this.globalHide)
    window.removeEventListener('__react_tooltip_rebuild_event', this.globalRebuild)
    window.removeEventListener('resize', this.onWindowResize)
  }

  bindListener () {
    let targetArray = this.getTargetArray()

    let dataEvent
    for (let i = 0; i < targetArray.length; i++) {
      targetArray[i].setAttribute('currentItem', 'false')
      dataEvent = this.state.event || targetArray[i].getAttribute('data-event')
      if (dataEvent) {
        targetArray[i].removeEventListener(dataEvent, this.checkStatus)
        targetArray[i].addEventListener(dataEvent, this.checkStatus, false)
      } else {
        targetArray[i].removeEventListener('mouseenter', this.showTooltip)
        targetArray[i].addEventListener('mouseenter', this.showTooltip, false)

        if (this.state.effect === 'float') {
          targetArray[i].removeEventListener('mousemove', this.updateTooltip)
          targetArray[i].addEventListener('mousemove', this.updateTooltip, false)
        }

        targetArray[i].removeEventListener('mouseleave', this.hideTooltip)
        targetArray[i].addEventListener('mouseleave', this.hideTooltip, false)
      }
    }
  }

  unbindListener () {
    let targetArray = document.querySelectorAll('[data-tip]')
    let dataEvent

    for (let i = 0; i < targetArray.length; i++) {
      dataEvent = this.state.event || targetArray[i].getAttribute('data-event')
      if (dataEvent) {
        targetArray[i].removeEventListener(dataEvent, this.checkStatus)
      } else {
        targetArray[i].removeEventListener('mouseenter', this.showTooltip)
        targetArray[i].removeEventListener('mousemove', this.updateTooltip)
        targetArray[i].removeEventListener('mouseleave', this.hideTooltip)
      }
    }
  }

  /**
   * Get all tooltip targets
   */
  getTargetArray () {
    const {id} = this.props
    let targetArray

    if (id === undefined) {
      targetArray = document.querySelectorAll('[data-tip]:not([data-for])')
    } else {
      targetArray = document.querySelectorAll('[data-tip][data-for="' + id + '"]')
    }

    return targetArray
  }

  /**
   * listener on window resize
   */
  onWindowResize () {
    if (!this.mount) return
    let targetArray = this.getTargetArray()

    for (let i = 0; i < targetArray.length; i++) {
      if (targetArray[i].getAttribute('currentItem') === 'true') {
        // todo: timer for performance
        let {x, y} = this.getPosition(targetArray[i])
        findDOMNode(this).style.left = x + 'px'
        findDOMNode(this).style.top = y + 'px'
        /* this.setState({
         x,
         y
         }) */
      }
    }
  }

  /**
   * Used in customer event
   */
  checkStatus (e) {
    if (this.state.show && e.currentTarget.getAttribute('currentItem') === 'true') {
      this.hideTooltip(e)
    } else {
      e.currentTarget.setAttribute('currentItem', 'true')
      this.showTooltip(e)
      this.setUntargetItems(e.currentTarget)
    }
  }

  setUntargetItems (currentTarget) {
    let targetArray = this.getTargetArray()

    for (let i = 0; i < targetArray.length; i++) {
      if (currentTarget !== targetArray[i]) {
        targetArray[i].setAttribute('currentItem', 'false')
      } else {
        targetArray[i].setAttribute('currentItem', 'true')
      }
    }
  }

  /**
   * When mouse enter, show update
   */
  showTooltip (e) {
    const originTooltip = e.currentTarget.getAttribute('data-tip')
    /* Detect multiline */
    const regexp = /<br\s*\/?>/
    const multiline = e.currentTarget.getAttribute('data-multiline') ? e.currentTarget.getAttribute('data-multiline') : (this.props.multiline ? this.props.multiline : false)
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
    let extraClass = e.currentTarget.getAttribute('data-class') ? e.currentTarget.getAttribute('data-class') : ''
    extraClass = this.props.class ? this.props.class + ' ' + extraClass : extraClass
    this.setState({
      placeholder: tooltipText,
      multilineCount: multilineCount,
      place: e.currentTarget.getAttribute('data-place') ? e.currentTarget.getAttribute('data-place') : (this.props.place ? this.props.place : 'top'),
      type: e.currentTarget.getAttribute('data-type') ? e.currentTarget.getAttribute('data-type') : (this.props.type ? this.props.type : 'dark'),
      effect: e.currentTarget.getAttribute('data-effect') ? e.currentTarget.getAttribute('data-effect') : (this.props.effect ? this.props.effect : 'float'),
      offset: e.currentTarget.getAttribute('data-offset') ? e.currentTarget.getAttribute('data-offset') : (this.props.offset ? this.props.offset : {}),
      html: e.currentTarget.getAttribute('data-html') ? e.currentTarget.getAttribute('data-html') : (this.props.html ? this.props.html : false),
      delayShow: e.currentTarget.getAttribute('data-delay-show') ? e.currentTarget.getAttribute('data-delay-show') : (this.props.delayShow ? this.props.delayShow : 0),
      delayHide: e.currentTarget.getAttribute('data-delay-hide') ? e.currentTarget.getAttribute('data-delay-hide') : (this.props.delayHide ? this.props.delayHide : 0),
      border: e.currentTarget.getAttribute('data-border') ? (e.currentTarget.getAttribute('data-border') === 'true') : (this.props.border ? this.props.border : false),
      extraClass,
      multiline
    })

    this.addScrollListener()
    this.updateTooltip(e)
  }

  /**
   * When mouse hover, updatetooltip
   */
  updateTooltip (e) {
    const {delayShow, show} = this.state
    clearTimeout(this.delayShowLoop)

    const delayTime = show ? 0 : parseInt(delayShow, 10)
    const eventTarget = e.currentTarget
    this.delayShowLoop = setTimeout(() => {
      if (this.trim(this.state.placeholder).length > 0) {
        if (this.state.effect === 'float') {
          this.setState({
            show: true,
            x: e.clientX,
            y: e.clientY
          })
        } else if (this.state.effect === 'solid') {
          let {x, y} = this.getPosition(eventTarget)
          this.setState({
            show: true,
            x,
            y
          })
        }
      }
    }, delayTime)
  }

  /**
   * When mouse leave, hide tooltip
   */
  hideTooltip () {
    const {delayHide} = this.state
    clearTimeout(this.delayShowLoop)
    setTimeout(() => {
      this.setState({
        show: false
      })
      this.removeScrollListener()
    }, parseInt(delayHide, 10))
  }

  /**
   * Add scroll eventlistener when tooltip show
   * or tooltip will always existed
   */
  addScrollListener () {
    window.addEventListener('scroll', this.hideTooltip)
  }

  /* Remove listener when tooltip hide */
  removeScrollListener () {
    window.removeEventListener('scroll', this.hideTooltip)
  }

  /**
   * Get tooltip poisition by current target
   */
  getPosition (currentTarget) {
    const {place} = this.state
    const node = findDOMNode(this)
    const boundingClientRect = currentTarget.getBoundingClientRect()
    const targetTop = boundingClientRect.top
    const targetLeft = boundingClientRect.left
    const tipWidth = node.clientWidth
    const tipHeight = node.clientHeight
    const targetWidth = currentTarget.clientWidth
    const targetHeight = currentTarget.clientHeight
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

    return { x, y }
  }

  /**
   * Execute in componentDidUpdate, used in the render function, move out for server rending
   */
  updatePosition () {
    let node = findDOMNode(this)

    let tipWidth = node.clientWidth
    let tipHeight = node.clientHeight
    let { effect, place, offset } = this.state
    let offsetFromEffect = {}

    if (effect === 'float') {
      offsetFromEffect.top = {
        x: -(tipWidth / 2),
        y: -tipHeight
      }
      offsetFromEffect.bottom = {
        x: -(tipWidth / 2),
        y: 15
      }
      offsetFromEffect.left = {
        x: -(tipWidth + 15),
        y: -(tipHeight / 2)
      }
      offsetFromEffect.right = {
        x: 10,
        y: -(tipHeight / 2)
      }
    }
    let xPosition = 0
    let yPosition = 0

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
    let offsetEffectX = effect === 'solid' ? 0 : (place ? offsetFromEffect[place].x : 0)
    let offsetEffectY = effect === 'solid' ? 0 : (place ? offsetFromEffect[place].y : 0)
    const styleLeft = this.state.x + offsetEffectX + xPosition
    const styleTop = this.state.y + offsetEffectY + yPosition
    const windoWidth = window.innerWidth
    const windowHeight = window.innerHeight

    /* Solid use this method will get Uncaught RangeError: Maximum call stack size exceeded */
    if (effect === 'float') {
      if (styleLeft < 0 && this.state.x + offsetFromEffect['right'].x + xPosition <= windoWidth) {
        this.setState({
          place: 'right'
        })
        return
      } else if (styleLeft + tipWidth > windoWidth && this.state.x + offsetFromEffect['left'].x + xPosition >= 0) {
        this.setState({
          place: 'left'
        })
        return
      } else if (styleTop < 0 && this.state.y + offsetFromEffect['bottom'].y + yPosition + tipHeight < windowHeight) {
        this.setState({
          place: 'bottom'
        })
        return
      } else if (styleTop + tipHeight >= windowHeight && this.state.y + offsetFromEffect['top'].y + yPosition >= 0) {
        this.setState({
          place: 'top'
        })
        return
      }
    }

    node.style.left = styleLeft + 'px'
    node.style.top = styleTop + 'px'
  }

  /**
   * Set style tag in header
   * Insert style by this way
   */
  setStyleHeader () {
    if (!document.getElementsByTagName('head')[0].querySelector('style[id="react-tooltip"]')) {
      let tag = document.createElement('style')
      tag.id = 'react-tooltip'
      tag.innerHTML = cssStyle
      document.getElementsByTagName('head')[0].appendChild(tag)
    }
  }

  render () {
    const {placeholder, extraClass, html} = this.state
    let tooltipClass = classname(
      '__react_component_tooltip',
      {'show': this.state.show},
      {'border': this.state.border},
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

    if (html) {
      return (
        <div className={tooltipClass + ' ' + extraClass} data-id='tooltip' dangerouslySetInnerHTML={{__html: placeholder}}></div>
      )
    } else {
      const content = this.props.children ? this.props.children : placeholder
      return (
        <div className={tooltipClass + ' ' + extraClass} data-id='tooltip'>{content}</div>
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
  border: PropTypes.bool,
  class: PropTypes.string,
  id: PropTypes.string,
  html: PropTypes.bool,
  delayHide: PropTypes.number,
  delayShow: PropTypes.number,
  event: PropTypes.any,
  watchWindow: PropTypes.bool
}
