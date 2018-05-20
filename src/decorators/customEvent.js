/**
 * Custom events to control showing and hiding of tooltip
 *
 * @attributes
 * - `event` {String}
 * - `eventOff` {String}
 */

const checkStatus = function (dataEventOff, e) {
  const {show} = this.state
  const {id} = this.props
  const dataIsCapture = e.currentTarget.getAttribute('data-iscapture')
  const isCapture = dataIsCapture && dataIsCapture === 'true' || this.props.isCapture
  const currentItem = e.currentTarget.getAttribute('currentItem')

  if (!isCapture) e.stopPropagation()
  if (show && currentItem === 'true') {
    if (!dataEventOff) this.hideTooltip(e)
  } else {
    e.currentTarget.setAttribute('currentItem', 'true')
    setUntargetItems(e.currentTarget, this.getTargetArray(id))
    this.showTooltip(e)
  }
}

const setUntargetItems = function (currentTarget, targetArray) {
  for (let i = 0; i < targetArray.length; i++) {
    if (currentTarget !== targetArray[i]) {
      targetArray[i].setAttribute('currentItem', 'false')
    } else {
      targetArray[i].setAttribute('currentItem', 'true')
    }
  }
}

const customListeners = {
  registry: new WeakMap(),
  set (target, event, listener) {
    if (this.registry.has(target)) {
      const map = this.registry.get(target)
      map[event] = listener
      return this.registry
    }

    return this.registry.set(target, { [event]: listener })
  },

  get (target, event) {
    const map = this.registry.get(target)
    if (map !== undefined) {
      return map[event]
    }

    return void 0
  }
}

export default function (target) {
  target.prototype.isCustomEvent = function (ele) {
    const {event} = this.state
    return event || !!ele.getAttribute('data-event')
  }

  /* Bind listener for custom event */
  target.prototype.customBindListener = function (ele) {
    const {event, eventOff} = this.state
    const dataEvent = ele.getAttribute('data-event') || event
    const dataEventOff = ele.getAttribute('data-event-off') || eventOff

    dataEvent.split(' ').forEach(event => {
      ele.removeEventListener(event, customListeners.get(ele, event))
      const customListener = checkStatus.bind(this, dataEventOff)
      customListeners.set(ele, event, customListener)
      ele.addEventListener(event, customListener, false)
    })
    if (dataEventOff) {
      dataEventOff.split(' ').forEach(event => {
        ele.removeEventListener(event, this.hideTooltip)
        ele.addEventListener(event, this.hideTooltip, false)
      })
    }
  }

  /* Unbind listener for custom event */
  target.prototype.customUnbindListener = function (ele) {
    const {event, eventOff} = this.state
    const dataEvent = event || ele.getAttribute('data-event')
    const dataEventOff = eventOff || ele.getAttribute('data-event-off')

    ele.removeEventListener(dataEvent, customListeners.get(ele, event))
    if (dataEventOff) ele.removeEventListener(dataEventOff, this.hideTooltip)
  }
}
