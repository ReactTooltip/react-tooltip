'use strict'

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classname from 'classnames'

/* Decoraters */
import staticMethods from './decorators/staticMethods'
import windowListener from './decorators/windowListener'
import customEvent from './decorators/customEvent'
import isCapture from './decorators/isCapture'

/* Utils */
import getPosition from './utils/getPosition'
import getTipContent from './utils/getTipContent'

/* CSS */
import cssStyle from './style'

@staticMethods @windowListener @customEvent @isCapture
class ReactTooltip extends Component {

  static propTypes = {
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
    event: PropTypes.string,
    eventOff: PropTypes.string,
    watchWindow: PropTypes.bool,
    isCapture: PropTypes.bool,
    globalEventOff: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      place: 'top', // Direction of tooltip
      type: 'dark', // Color theme of tooltip
      effect: 'float', // float or fixed
      show: false,
      border: false,
      placeholder: '',
      offset: {},
      extraClass: '',
      html: false,
      delayHide: 0,
      delayShow: 0,
      event: props.event || null,
      eventOff: props.eventOff || null,
      currentEvent: null, // Current mouse event
      currentTarget: null // Current target of mouse event
    }

    this.mount = true
    this.delayShowLoop = null
    this.delayHideLoop = null
  }

  componentDidMount () {
    this.setStyleHeader() // Set the style to the <link>
    this.bindListener() // Bind listener for tooltip
    this.bindWindowEvents() // Bind global event for static method
  }

  componentWillUnmount () {
    this.mount = false

    clearTimeout(this.delayShowLoop)
    clearTimeout(this.delayHideLoop)

    this.unbindListener()
    this.removeScrollListener()
    this.unbindWindowEvents()
  }

  /**
   * Pick out corresponded target elements
   */
  getTargetArray (id) {
    let targetArray

    if (!id) {
      targetArray = document.querySelectorAll('[data-tip]:not([data-for])')
    } else {
      targetArray = document.querySelectorAll(`[data-tip][data-for="${id}"]`)
    }

    // targetArray is a NodeList, convert it to a real array
    // I hope I can use Object.values...
    return Object.keys(targetArray).filter(key => key !== 'length').map(key => {
      return targetArray[key]
    })
  }

  /**
   * Bind listener to the target elements
   * These listeners used to trigger showing or hiding the tooltip
   */
  bindListener () {
    const {id, globalEventOff} = this.props
    let targetArray = this.getTargetArray(id)

    targetArray.forEach(target => {
      const isCaptureMode = this.isCapture(target)
      if (target.getAttribute('currentItem') === null) {
        target.setAttribute('currentItem', 'false')
      }

      if (this.isCustomEvent(target)) {
        this.customBindListener(target)
        return
      }

      target.removeEventListener('mouseenter', this.showTooltip)
      target.addEventListener('mouseenter', ::this.showTooltip, isCaptureMode)
      if (this.state.effect === 'float') {
        target.removeEventListener('mousemove', this.updateTooltip)
        target.addEventListener('mousemove', ::this.updateTooltip, isCaptureMode)
      }

      target.removeEventListener('mouseleave', this.hideTooltip)
      target.addEventListener('mouseleave', ::this.hideTooltip, isCaptureMode)
    })

    // Global event to hide tooltip
    if (globalEventOff) {
      window.removeEventListener(globalEventOff, this.hideTooltip)
      window.addEventListener(globalEventOff, ::this.hideTooltip, false)
    }
  }

  /**
   * Unbind listeners on target elements
   */
  unbindListener () {
    const {id, globalEventOff} = this.props
    const targetArray = this.getTargetArray(id)

    targetArray.forEach(target => {
      if (this.isCustomEvent(target)) {
        this.customUnbindListener(target)
        return
      }

      target.removeEventListener('mouseenter', this.showTooltip)
      target.removeEventListener('mousemove', this.updateTooltip)
      target.removeEventListener('mouseleave', this.hideTooltip)
    })

    if (globalEventOff) window.removeEventListener(globalEventOff, this.hideTooltip)
  }

  /**
   * When mouse enter, show the tooltip
   */
  showTooltip (e) {
    // Get the tooltip content
    // calculate in this phrase so that tip width height can be detected
    const {children, multiline} = this.props
    const originTooltip = e.currentTarget.getAttribute('data-tip')
    const isMultiline = e.currentTarget.getAttribute('data-multiline') || multiline || false
    const placeholder = getTipContent(originTooltip, children, isMultiline)

    this.setState({
      placeholder,
      place: e.currentTarget.getAttribute('data-place') || this.props.place || 'top',
      type: e.currentTarget.getAttribute('data-type') || this.props.type || 'dark',
      effect: e.currentTarget.getAttribute('data-effect') || this.props.effect || 'float',
      offset: e.currentTarget.getAttribute('data-offset') || this.props.offset || {},
      html: e.currentTarget.getAttribute('data-html') === 'true' || this.props.html || false,
      delayShow: e.currentTarget.getAttribute('data-delay-show') || this.props.delayShow || 0,
      delayHide: e.currentTarget.getAttribute('data-delay-hide') || this.props.delayHide || 0,
      border: e.currentTarget.getAttribute('data-border') === 'true' || this.props.border || false,
      extraClass: e.currentTarget.getAttribute('data-class') || this.props.class || ''
    }, () => {
      this.addScrollListener(e)
      this.updateTooltip(e)
    })
  }

  /**
   * When mouse hover, updatetooltip
   */
  updateTooltip (e) {
    const {delayShow, show} = this.state
    let {placeholder} = this.state
    const delayTime = show ? 0 : parseInt(delayShow, 10)
    const eventTarget = e.currentTarget

    clearTimeout(this.delayShowLoop)
    this.delayShowLoop = setTimeout(() => {
      if (typeof placeholder === 'string') placeholder = placeholder.trim()
      if (Array.isArray(placeholder) && placeholder.length > 0 || placeholder) {
        this.setState({
          currentEvent: e,
          currentTarget: eventTarget,
          show: true
        }, () => {
          this.updatePosition()
        })
      }
    }, delayTime)
  }

  /**
   * When mouse leave, hide tooltip
   */
  hideTooltip () {
    const {delayHide} = this.state

    if (!this.mount) return

    clearTimeout(this.delayShowLoop)
    clearTimeout(this.delayHideLoop)
    this.delayHideLoop = setTimeout(() => {
      this.setState({
        show: false
      })
      this.removeScrollListener()
    }, parseInt(delayHide, 10))
  }

  /**
   * Add scroll eventlistener when tooltip show
   * automatically hide the tooltip when scrolling
   */
  addScrollListener (e) {
    const isCaptureMode = this.isCapture(e.currentTarget)
    window.addEventListener('scroll', ::this.hideTooltip, isCaptureMode)
  }

  removeScrollListener () {
    window.removeEventListener('scroll', this.hideTooltip)
  }

  // Calculation the position
  updatePosition () {
    const {currentEvent, currentTarget, place, effect, offset} = this.state
    const node = ReactDOM.findDOMNode(this)

    const result = getPosition(currentEvent, currentTarget, node, place, effect, offset)
    if (result.isNewState) {
      // Switch to reverse placement
      return this.setState(result.newState, () => {
        this.updatePosition()
      })
    }
    // Set tooltip position
    node.style.left = result.position.left + 'px'
    node.style.top = result.position.top + 'px'
  }

  /**
   * Set style tag in header
   * in this way we can insert default css
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
        <div className={`${tooltipClass} ${extraClass}`}
          data-id='tooltip'
          dangerouslySetInnerHTML={{__html: placeholder}}></div>
      )
    } else {
      return (
        <div className={`${tooltipClass} ${extraClass}`}
          data-id='tooltip'>{placeholder}</div>
      )
    }
  }
}

/* export default not fit for standalone, it will exports {default:...} */
module.exports = ReactTooltip
