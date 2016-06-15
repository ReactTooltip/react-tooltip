/**
 * Custom events to control showing and hiding of tooltip
 *
 * @attributes
 * - `event` {String}
 * - `eventOff` {String}
 */

const checkStatus = function (dataEventOff, e) {
  const {show} = this.state
  const dataIsCapture = e.currentTarget.getAttribute('data-iscapture')
  const isCapture = dataIsCapture && dataIsCapture === 'true' || this.state.isCapture
  const currentItem = e.currentTarget.getAttribute('currentItem')

  if (!isCapture) e.stopPropagation()
  if (show && currentItem === 'true') {
    if (!dataEventOff) this.hideTooltip(e)
  } else {
    e.currentTarget.setAttribute('currentItem', 'true')
    setUntargetItems(e.currentTarget, this.getTargetArray())
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

export default function (target) {
  target.prototype.isCustomEvent = function (ele) {
    const {event} = this.state
    return event || ele.getAttribute('data-event')
  }

  /* Bind listener for custom event */
  target.prototype.customBindListener = function (ele) {
    const {event, eventOff} = this.state
    const dataEvent = event || ele.getAttribute('data-event')
    const dataEventOff = eventOff || ele.getAttribute('data-event-off')

    ele.removeEventListener(dataEvent, checkStatus)
    ele.addEventListener(dataEvent, checkStatus.bind(this, dataEventOff), false)
    if (dataEventOff) {
      ele.removeEventListener(dataEventOff, this.hideTooltip)
      ele.addEventListener(dataEventOff, ::this.hideTooltip, false)
    }
  }

  /* Unbind listener for custom event */
  target.prototype.customUnbindListener = function (ele) {
    const {event, eventOff} = this.state
    const dataEvent = event || ele.getAttribute('data-event')
    const dataEventOff = eventOff || ele.getAttribute('data-event-off')

    ele.removeEventListener(dataEvent, checkStatus)
    if (dataEventOff) ele.removeEventListener(dataEventOff, this.hideTooltip)
  }
}
