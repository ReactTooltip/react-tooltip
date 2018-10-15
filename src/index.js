'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classname from 'classnames'
import sanitizeHtml from 'sanitize-html-react'

/* Decoraters */
import staticMethods from './decorators/staticMethods'
import windowListener from './decorators/windowListener'
import customEvent from './decorators/customEvent'
import isCapture from './decorators/isCapture'
import getEffect from './decorators/getEffect'
import trackRemoval from './decorators/trackRemoval'

/* Utils */
import getPosition from './utils/getPosition'
import getTipContent from './utils/getTipContent'
import { parseAria } from './utils/aria'
import nodeListToArray from './utils/nodeListToArray'

/* CSS */
import cssStyle from './style'

@staticMethods
@windowListener
@customEvent
@isCapture
@getEffect
@trackRemoval
class ReactTooltip extends React.Component {

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
    delayUpdate: PropTypes.number,
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
    wrapper: PropTypes.string,
    sanitizeHtmlOptions: PropTypes.any
  };

  static defaultProps = {
    insecure: true,
    resizeHide: true,
    wrapper: 'div'
  };

  static supportedWrappers = ['div', 'span'];

  static displayName = 'ReactTooltip';

  constructor (props) {
    super(props)
    this.state = {
      place: props.place || 'top', // Direction of tooltip
      desiredPlace: props.place || 'top',
      type: 'dark', // Color theme of tooltip
      effect: 'float', // float or fixed
      show: false,
      border: false,
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
      disable: false,
      originTooltip: null,
      isMultiline: false
    }

    this.bind([
      'showTooltip',
      'updateTooltip',
      'hideTooltip',
      'getTooltipContent',
      'globalRebuild',
      'globalShow',
      'globalHide',
      'onWindowResize',
      'mouseOnToolTip'
    ])

    this.mount = true
    this.delayShowLoop = null
    this.delayHideLoop = null
    this.delayReshow = null
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
     * Return if the mouse is on the tooltip.
     * @returns {boolean} true - mouse is on the tooltip
     */
  mouseOnToolTip () {
    const {show} = this.state

    if (show && this.tooltipRef) {
      /* old IE work around */
      if (!this.tooltipRef.matches) {
        this.tooltipRef.matches = this.tooltipRef.msMatchesSelector
      }
      return this.tooltipRef.matches(':hover')
    }
    return false
  }
  /**
   * Pick out corresponded target elements
   */
  getTargetArray (id) {
    let targetArray
    if (!id) {
      targetArray = document.querySelectorAll('[data-tip]:not([data-for])')
    } else {
      const escaped = id.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      targetArray = document.querySelectorAll(`[data-tip][data-for="${escaped}"]`)
    }
    // targetArray is a NodeList, convert it to a real array
    return nodeListToArray(targetArray)
  }

  /**
   * Bind listener to the target elements
   * These listeners used to trigger showing or hiding the tooltip
   */
  bindListener () {
    const {id, globalEventOff, isCapture} = this.props
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
      window.addEventListener(globalEventOff, this.hideTooltip, isCapture)
    }

    // Track removal of targetArray elements from DOM
    this.bindRemovalTracker()
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
    this.unbindRemovalTracker()
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

  getTooltipContent () {
    const {getContent, children} = this.props

    // Generate tooltip content
    let content
    if (getContent) {
      if (Array.isArray(getContent)) {
        content = getContent[0] && getContent[0](this.state.originTooltip)
      } else {
        content = getContent(this.state.originTooltip)
      }
    }

    return getTipContent(this.state.originTooltip, children, content, this.state.isMultiline)
  }

  isEmptyTip (placeholder) {
    return typeof placeholder === 'string' && placeholder === '' || placeholder === null
  }

  /**
   * When mouse enter, show the tooltip
   */
  showTooltip (e, isGlobalCall) {
    if (isGlobalCall) {
      // Don't trigger other elements belongs to other ReactTooltip
      const targetArray = this.getTargetArray(this.props.id)
      const isMyElement = targetArray.some(ele => ele === e.currentTarget)
      if (!isMyElement) return
    }
    // Get the tooltip content
    // calculate in this phrase so that tip width height can be detected
    const {multiline, getContent} = this.props
    const originTooltip = e.currentTarget.getAttribute('data-tip')
    const isMultiline = e.currentTarget.getAttribute('data-multiline') || multiline || false

    // If it is focus event or called by ReactTooltip.show, switch to `solid` effect
    const switchToSolid = e instanceof window.FocusEvent || isGlobalCall

    // if it needs to skip adding hide listener to scroll
    let scrollHide = true
    if (e.currentTarget.getAttribute('data-scroll-hide')) {
      scrollHide = e.currentTarget.getAttribute('data-scroll-hide') === 'true'
    } else if (this.props.scrollHide != null) {
      scrollHide = this.props.scrollHide
    }

    // Make sure the correct place is set
    let desiredPlace = e.currentTarget.getAttribute('data-place') || this.props.place || 'top'
    let effect = switchToSolid && 'solid' || this.getEffect(e.currentTarget)
    let offset = e.currentTarget.getAttribute('data-offset') || this.props.offset || {}
    let result = getPosition(e, e.currentTarget, ReactDOM.findDOMNode(this), desiredPlace, desiredPlace, effect, offset)
    let place = result.isNewState ? result.newState.place : desiredPlace

    // To prevent previously created timers from triggering
    this.clearTimer()

    var target = e.currentTarget

    var reshowDelay = this.state.show ? target.getAttribute('data-delay-update') || this.props.delayUpdate : 0

    var self = this

    var updateState = function updateState () {
      self.setState({
        originTooltip: originTooltip,
        isMultiline: isMultiline,
        desiredPlace: desiredPlace,
        place: place,
        type: target.getAttribute('data-type') || self.props.type || 'dark',
        effect: effect,
        offset: offset,
        html: target.getAttribute('data-html') ? target.getAttribute('data-html') === 'true' : self.props.html || false,
        delayShow: target.getAttribute('data-delay-show') || self.props.delayShow || 0,
        delayHide: target.getAttribute('data-delay-hide') || self.props.delayHide || 0,
        delayUpdate: target.getAttribute('data-delay-update') || self.props.delayUpdate || 0,
        border: target.getAttribute('data-border') ? target.getAttribute('data-border') === 'true' : self.props.border || false,
        extraClass: target.getAttribute('data-class') || self.props.class || self.props.className || '',
        disable: target.getAttribute('data-tip-disable') ? target.getAttribute('data-tip-disable') === 'true' : self.props.disable || false,
        currentTarget: target
      }, () => {
        if (scrollHide) self.addScrollListener(self.state.currentTarget)
        self.updateTooltip(e)

        if (getContent && Array.isArray(getContent)) {
          self.intervalUpdateContent = setInterval(() => {
            if (self.mount) {
              const {getContent} = self.props
              const placeholder = getTipContent(originTooltip, '', getContent[0](), isMultiline)
              const isEmptyTip = self.isEmptyTip(placeholder)
              self.setState({
                isEmptyTip
              })
              self.updatePosition()
            }
          }, getContent[1])
        }
      })
    }

    // If there is no delay call immediately, don't allow events to get in first.
    if (reshowDelay) {
      this.delayReshow = setTimeout(updateState, reshowDelay)
    } else {
      updateState()
    }
  }

  /**
   * When mouse hover, updatetooltip
   */
  updateTooltip (e) {
    const {delayShow, disable} = this.state
    const {afterShow} = this.props
    const placeholder = this.getTooltipContent()
    const delayTime = parseInt(delayShow, 10)
    const eventTarget = e.currentTarget || e.target

    // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
    if (this.mouseOnToolTip()) {
      return
    }

    if (this.isEmptyTip(placeholder) || disable) return // if the tooltip is empty, disable the tooltip
    const updateState = () => {
      if (Array.isArray(placeholder) && placeholder.length > 0 || placeholder) {
        const isInvisible = !this.state.show
        this.setState({
          currentEvent: e,
          currentTarget: eventTarget,
          show: true
        }, () => {
          this.updatePosition()
          if (isInvisible && afterShow) afterShow(e)
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

  /*
  * If we're mousing over the tooltip remove it when we leave.
   */
  listenForTooltipExit () {
    const {show} = this.state

    if (show && this.tooltipRef) {
      this.tooltipRef.addEventListener('mouseleave', this.hideTooltip)
    }
  }

  removeListenerForTooltipExit () {
    const {show} = this.state

    if (show && this.tooltipRef) {
      this.tooltipRef.removeEventListener('mouseleave', this.hideTooltip)
    }
  }

  /**
   * When mouse leave, hide tooltip
   */
  hideTooltip (e, hasTarget) {
    const {delayHide, disable} = this.state
    const {afterHide} = this.props
    const placeholder = this.getTooltipContent()
    if (!this.mount) return
    if (this.isEmptyTip(placeholder) || disable) return // if the tooltip is empty, disable the tooltip
    if (hasTarget) {
      // Don't trigger other elements belongs to other ReactTooltip
      const targetArray = this.getTargetArray(this.props.id)
      const isMyElement = targetArray.some(ele => ele === e.currentTarget)
      if (!isMyElement || !this.state.show) return
    }

    const resetState = () => {
      const isVisible = this.state.show
      // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
      if (this.mouseOnToolTip()) {
        this.listenForTooltipExit()
        return
      }
      this.removeListenerForTooltipExit()

      this.setState({
        show: false
      }, () => {
        this.removeScrollListener()
        if (isVisible && afterHide) afterHide(e)
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
  addScrollListener (currentTarget) {
    const isCaptureMode = this.isCapture(currentTarget)
    window.addEventListener('scroll', this.hideTooltip, isCaptureMode)
  }

  removeScrollListener () {
    window.removeEventListener('scroll', this.hideTooltip)
  }

  // Calculation the position
  updatePosition () {
    const {currentEvent, currentTarget, place, desiredPlace, effect, offset} = this.state
    const node = ReactDOM.findDOMNode(this)
    const result = getPosition(currentEvent, currentTarget, node, place, desiredPlace, effect, offset)

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
    const head = document.getElementsByTagName('head')[0]
    if (!head.querySelector('style[id="react-tooltip"]')) {
      let tag = document.createElement('style')
      tag.id = 'react-tooltip'
      tag.innerHTML = cssStyle
      /* eslint-disable */
      if (typeof __webpack_nonce__ !== 'undefined' && __webpack_nonce__) {
        tag.setAttribute('nonce', __webpack_nonce__)
      }
      /* eslint-enable */
      head.insertBefore(tag, head.firstChild)
    }
  }

  /**
   * CLear all kinds of timeout of interval
   */
  clearTimer () {
    clearTimeout(this.delayShowLoop)
    clearTimeout(this.delayHideLoop)
    clearTimeout(this.delayReshow)
    clearInterval(this.intervalUpdateContent)
  }

  render () {
    const {extraClass, html, ariaProps, disable} = this.state
    const placeholder = this.getTooltipContent()
    const isEmptyTip = this.isEmptyTip(placeholder)
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
      {'type-light': this.state.type === 'light'},
      {'allow_hover': this.props.delayUpdate}
    )

    let Wrapper = this.props.wrapper
    if (ReactTooltip.supportedWrappers.indexOf(Wrapper) < 0) {
      Wrapper = ReactTooltip.defaultProps.wrapper
    }

    if (html) {
      return (
        <Wrapper className={`${tooltipClass} ${extraClass}`}
                 id={this.props.id}
                 ref={ref => this.tooltipRef = ref}
                 {...ariaProps}
                 data-id='tooltip'
                 dangerouslySetInnerHTML={{__html: sanitizeHtml(placeholder, this.props.sanitizeHtmlOptions)}}/>
      )
    } else {
      return (
        <Wrapper className={`${tooltipClass} ${extraClass}`}
                 id={this.props.id}
                 {...ariaProps}
                 ref={ref => this.tooltipRef = ref}
                 data-id='tooltip'>{placeholder}</Wrapper>
      )
    }
  }
}

/* export default not fit for standalone, it will exports {default:...} */
module.exports = ReactTooltip
