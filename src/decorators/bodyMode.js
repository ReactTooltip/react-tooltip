/**
 * Util method to get effect
 */
import {checkStatus} from './customEvent'

export default function (target) {
  target.prototype.isBodyMode = function () {
    return this.props.bodyMode
  }

  const makeProxy = (e) => {
    const proxy = {}
    for (const key in e) {
      if (typeof e[key] === 'function') {
        proxy[key] = e[key].bind(e)
      } else {
        proxy[key] = e[key]
      }
    }
    return proxy
  }

  const bodyListener = function (callback, options, e) {
    const {respectEffect = false, customEvent = false} = options
    const {id} = this.props

    const tip = e.target.dataset.tip
    const _for = e.target.dataset.for

    const target = e.target
    if (!!target.getAttribute('data-event') && !customEvent) {
      return
    }

    if (tip != null &&
      (!respectEffect || this.getEffect(target) === 'float') &&
      ((id == null && _for == null) || (id != null && _for === id))
    ) {
      const proxy = makeProxy(e)
      proxy.currentTarget = target
      callback(proxy)
    }
  }

  const findCustomEvents = (targetArray, dataAttribute) => {
    const events = {}
    targetArray.forEach(target => {
      const event = target.getAttribute(dataAttribute)
      if (event) event.split(' ').forEach(event => events[event] = true)
    })

    return events
  }

  target.prototype.bindBodyListener = function () {
    const { id } = this.props
    const { event, eventOff } = this.state
    const body = document.getElementsByTagName('body')[0]

    const targetArray = this.getTargetArray(id)

    const customEvents = findCustomEvents(targetArray, 'data-event')
    const customEventsOff = findCustomEvents(targetArray, 'data-event-off')

    if (event != null) customEvents[event] = true
    if (eventOff != null) customEventsOff[eventOff] = true
    for (const event of this.state.possibleCustomEvents) customEvents[event] = true
    for (const event of this.state.possibleCustomEventsOff) customEventsOff[event] = true

    this.unbindBodyListener(body)

    const listeners = this.bodyModeListeners = {
      'mouseover': bodyListener.bind(this, this.showTooltip, {}),
      'mousemove': bodyListener.bind(this, this.updateTooltip, { respectEffect: true }),
      'mouseout': bodyListener.bind(this, this.hideTooltip, {})
    }

    for (const event in customEvents) {
      listeners[event] = bodyListener.bind(this, (e) => {
        checkStatus.call(this, e.currentTarget.getAttribute('data-event-off') || eventOff, e)
      }, { customEvent: true })
    }
    for (const event in customEventsOff) {
      listeners[event] = bodyListener.bind(this, this.hideTooltip, { customEvent: true })
    }
    for (const event in listeners) {
      body.addEventListener(event, listeners[event])
    }
  }

  target.prototype.unbindBodyListener = function (body) {
    body = body || document.getElementsByTagName('body')[0]

    const listeners = this.bodyModeListeners
    for (const event in listeners) {
      body.removeEventListener(event, listeners(event))
    }
  }
}
