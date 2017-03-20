/**
 * Util method to get effect
 */
import {checkStatus} from './customEvent'

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
  if (this.isCustomEvent(target) && !customEvent) {
    return
  }

  const isTargetBelongsToTooltip =
    (id == null && _for == null) || (id != null && _for === id)

  if (tip != null &&
    (!respectEffect || this.getEffect(target) === 'float') &&
    isTargetBelongsToTooltip
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

const getBody = () => document.getElementsByTagName('body')[0]

export default function (target) {
  target.prototype.isBodyMode = function () {
    return this.props.bodyMode
  }

  target.prototype.bindBodyListener = function (targetArray) {
    const { id } = this.props
    const { event, eventOff } = this.state
    const body = getBody()

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
        const targetEventOff = e.currentTarget.getAttribute('data-event-off') || eventOff
        checkStatus.call(this, targetEventOff, e)
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
    body = body || getBody()

    const listeners = this.bodyModeListeners
    for (const event in listeners) {
      body.removeEventListener(event, listeners(event))
    }
  }
}
