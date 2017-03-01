'use strict'

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classname from 'classnames'

/* Decoraters */
import staticMethods from './decorators/staticMethods'
import windowListener from './decorators/windowListener'
import customEvent from './decorators/customEvent'
import isCapture from './decorators/isCapture'
import getEffect from './decorators/getEffect'

/* Utils */
import getPosition from './utils/getPosition'
import getTipContent from './utils/getTipContent'
import { parseAria } from './utils/aria'
import nodeListToArray from './utils/nodeListToArray'

/* CSS */
import cssStyle from './style'

@staticMethods @windowListener @customEvent @isCapture @getEffect
class ReactTooltip extends Component {

  static propTypes = {
    children: PropTypes.any,
    place: PropTypes.string,
    type: PropTypes.string,
    effect: PropTypes.string,
    offset: PropTypes.object,
    multiline: PropTypes.bool,
    border: PropTypes.bool,
    insecure: PropTypes.bool,
    class: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
    html: PropTypes.bool,
    delayHide: PropTypes.number,
    delayShow: PropTypes.number,
    event: PropTypes.string,
    eventOff: PropTypes.string,
    watchWindow: PropTypes.bool,
    isCapture: PropTypes.bool,
    globalEventOff: PropTypes.string,
    getContent: PropTypes.any,
    afterShow: PropTypes.func,
    afterHide: PropTypes.func,
    disable: PropTypes.bool,
    scrollHide: PropTypes.bool,
    resizeHide: PropTypes.bool,
    wrapper: PropTypes.string
  };

  static defaultProps = {
    insecure: true,
    resizeHide: true,
    wrapper: 'div'
  };

  static supportedWrappers = {
    'div': React.DOM.div,
    'span': React.DOM.span
  };

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
      currentTarget: null, // Current target of mouse event
      ariaProps: parseAria(props), // aria- and role attributes
      isEmptyTip: false,
      disable: false
    }

    this.bind([
      'showTooltip',
      'updateTooltip',
      'hideTooltip',
      'globalRebuild',
      'globalShow',
      'globalHide',
      'onWindowResize'
    ])

    this.mount = true
    this.delayShowLoop = null
    this.delayHideLoop = null
    this.intervalUpdateContent = null
  }

  /**
   * For unify the bind and unbind listener
   */
  bind (methodArray) {
    methodArray.forEach(method => {
      this[method] = this[method].bind(this)
    })
  }

  componentDidMount () {
    const { insecure, resizeHide } = this.props
    if (insecure) {
      this.setStyleHeader() // Set the style to the <link>
    }
    this.bindListener() // Bind listener for tooltip
    this.bindWindowEvents(resizeHide) // Bind global event for static method
  }

  componentWillReceiveProps (props) {
    const { ariaProps } = this.state
    const newAriaProps = parseAria(props)

    const isChanged = Object.keys(newAriaProps).some(props => {
      return newAriaProps[props] !== ariaProps[props]
    })
    if (isChanged) {
      this.setState({ ariaProps: newAriaProps })
    }
  }

  componentWillUnmount () {
    this.mount = false

    this.clearTimer()

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
    return nodeListToArray(targetArray)
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
      const effect = this.getEffect(target)
      if (target.getAttribute('currentItem') === null) {
        target.setAttribute('currentItem', 'false')
      }
      this.unbindBasicListener(target)

      if (this.isCustomEvent(target)) {
        this.customBindListener(target)
        return
      }

      target.addEventListener('mouseenter', this.showTooltip, isCaptureMode)
      if (effect === 'float') {
        target.addEventListener('mousemove', this.updateTooltip, isCaptureMode)
      }
      target.addEventListener('mouseleave', this.hideTooltip, isCaptureMode)
    })

    // Global event to hide tooltip
    if (globalEventOff) {
      window.removeEventListener(globalEventOff, this.hideTooltip)
      window.addEventListener(globalEventOff, this.hideTooltip, false)
    }
  }

  /**
   * Unbind listeners on target elements
   */
  unbindListener () {
    const {id, globalEventOff} = this.props
    const targetArray = this.getTargetArray(id)
    targetArray.forEach(target => {
      this.unbindBasicListener(target)
      if (this.isCustomEvent(target)) this.customUnbindListener(target)
    })

    if (globalEventOff) window.removeEventListener(globalEventOff, this.hideTooltip)
  }

  /**
   * Invoke this before bind listener and ummount the compont
   * it is necessary to invloke this even when binding custom event
   * so that the tooltip can switch between custom and default listener
   */
  unbindBasicListener (target) {
    const isCaptureMode = this.isCapture(target)
    target.removeEventListener('mouseenter', this.showTooltip, isCaptureMode)
    target.removeEventListener('mousemove', this.updateTooltip, isCaptureMode)
    target.removeEventListener('mouseleave', this.hideTooltip, isCaptureMode)
  }

  /**
   * When mouse enter, show the tooltip
   */
  showTooltip (e, isGlobalCall) {
    if (isGlobalCall) {
      // Don't trigger other elements belongs to other ReactTooltip
      const targetArray = this.getTargetArray(this.props.id)
      const isMyElement = targetArray.some(ele => ele === e.currentTarget)
      if (!isMyElement || this.state.show) return
    }
    // Get the tooltip content
    // calculate in this phrase so that tip width height can be detected
    const {children, multiline, getContent} = this.props
    const originTooltip = e.currentTarget.getAttribute('data-tip')
    const isMultiline = e.currentTarget.getAttribute('data-multiline') || multiline || false

    // Generate tootlip content
    let content
    if (getContent) {
      if (Array.isArray(getContent)) {
        content = getContent[0] && getContent[0]()
      } else {
        content = getContent()
      }
    }
    const placeholder = getTipContent(originTooltip, children, content, isMultiline)
    const isEmptyTip = typeof placeholder === 'string' && placeholder === '' || placeholder === null

    // If it is focus event or called by ReactTooltip.show, switch to `solid` effect
    const switchToSolid = e instanceof window.FocusEvent || isGlobalCall

    // if it need to skip adding hide listener to scroll
    let scrollHide = true
    if (e.currentTarget.getAttribute('data-scroll-hide')) {
      scrollHide = e.currentTarget.getAttribute('data-scroll-hide') === 'true'
    } else if (this.props.scrollHide != null) {
      scrollHide = this.props.scrollHide
    }

    // To prevent previously created timers from triggering
    this.clearTimer()

    this.setState({
      placeholder,
      isEmptyTip,
      place: e.currentTarget.getAttribute('data-place') || this.props.place || 'top',
      type: e.currentTarget.getAttribute('data-type') || this.props.type || 'dark',
      effect: switchToSolid && 'solid' || this.getEffect(e.currentTarget),
      offset: e.currentTarget.getAttribute('data-offset') || this.props.offset || {},
      html: e.currentTarget.getAttribute('data-html')
        ? e.currentTarget.getAttribute('data-html') === 'true'
        : (this.props.html || false),
      delayShow: e.currentTarget.getAttribute('data-delay-show') || this.props.delayShow || 0,
      delayHide: e.currentTarget.getAttribute('data-delay-hide') || this.props.delayHide || 0,
      border: e.currentTarget.getAttribute('data-border')
        ? e.currentTarget.getAttribute('data-border') === 'true'
        : (this.props.border || false),
      extraClass: e.currentTarget.getAttribute('data-class') || this.props.class || this.props.className || '',
      disable: e.currentTarget.getAttribute('data-tip-disable')
        ? e.currentTarget.getAttribute('data-tip-disable') === 'true'
        : (this.props.disable || false)
    }, () => {
      if (scrollHide) this.addScrollListener(e)
      this.updateTooltip(e)

      if (getContent && Array.isArray(getContent)) {
        this.intervalUpdateContent = setInterval(() => {
          if (this.mount) {
            const {getContent} = this.props
            const placeholder = getTipContent(originTooltip, getContent[0](), isMultiline)
            const isEmptyTip = typeof placeholder === 'string' && placeholder === ''
            this.setState({
              placeholder,
              isEmptyTip
            })
          }
        }, getContent[1])
      }
    })
  }

  /**
   * When mouse hover, updatetooltip
   */
  updateTooltip (e) {
    const {delayShow, show, isEmptyTip, disable} = this.state
    const {afterShow} = this.props
    let {placeholder} = this.state
    const delayTime = show ? 0 : parseInt(delayShow, 10)
    const eventTarget = e.currentTarget

    if (isEmptyTip || disable) return // if the tooltip is empty, disable the tooltip
    const updateState = () => {
      if (Array.isArray(placeholder) && placeholder.length > 0 || placeholder) {
        const isInvisible = !this.state.show
        this.setState({
          currentEvent: e,
          currentTarget: eventTarget,
          show: true
        }, () => {
          this.updatePosition()
          if (isInvisible && afterShow) afterShow()
        })
      }
    }

    clearTimeout(this.delayShowLoop)
    if (delayShow) {
      this.delayShowLoop = setTimeout(updateState, delayTime)
    } else {
      updateState()
    }
  }

  /**
   * When mouse leave, hide tooltip
   */
  hideTooltip (e, hasTarget) {
    const {delayHide, isEmptyTip, disable} = this.state
    const {afterHide} = this.props
    if (!this.mount) return
    if (isEmptyTip || disable) return // if the tooltip is empty, disable the tooltip
    if (hasTarget) {
      // Don't trigger other elements belongs to other ReactTooltip
      const targetArray = this.getTargetArray(this.props.id)
      const isMyElement = targetArray.some(ele => ele === e.currentTarget)
      if (!isMyElement || !this.state.show) return
    }
    const resetState = () => {
      const isVisible = this.state.show
      this.setState({
        show: false
      }, () => {
        this.removeScrollListener()
        if (isVisible && afterHide) afterHide()
      })
    }

    this.clearTimer()
    if (delayHide) {
      this.delayHideLoop = setTimeout(resetState, parseInt(delayHide, 10))
    } else {
      resetState()
    }
  }

  /**
   * Add scroll eventlistener when tooltip show
   * automatically hide the tooltip when scrolling
   */
  addScrollListener (e) {
    const isCaptureMode = this.isCapture(e.currentTarget)
    window.addEventListener('scroll', this.hideTooltip, isCaptureMode)
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

  /**
   * CLear all kinds of timeout of interval
   */
  clearTimer () {
    clearTimeout(this.delayShowLoop)
    clearTimeout(this.delayHideLoop)
    clearInterval(this.intervalUpdateContent)
  }

  render () {
    const {placeholder, extraClass, html, ariaProps, disable, isEmptyTip} = this.state
    let tooltipClass = classname(
      '__react_component_tooltip',
      {'show': this.state.show && !disable && !isEmptyTip},
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

    let wrapper = ReactTooltip.supportedWrappers[this.props.wrapper]
    if (!wrapper) wrapper = ReactTooltip.supportedWrappers['div']

    if (html) {
      return (
        <wrapper className={`${tooltipClass} ${extraClass}`}
          {...ariaProps}
          data-id='tooltip'
          dangerouslySetInnerHTML={{__html: placeholder}}></wrapper>
      )
    } else {
      return (
        <wrapper className={`${tooltipClass} ${extraClass}`}
          {...ariaProps}
          data-id='tooltip'>{placeholder}</wrapper>
      )
    }
  }
}

/* export default not fit for standalone, it will exports {default:...} */
module.exports = ReactTooltip
