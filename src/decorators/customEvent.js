/**
 * Custom events to control showing and hiding of tooltip
 *
 * @attributes
 * - `event` {String}
 * - `eventOff` {String}
 */

const checkStatus = function (e) {
  const {show} = this.state
  const dataIsCapture = e.currentTarget.getAttribute('data-iscapture')
  const isCapture = dataIsCapture && dataIsCapture === 'true' || this.state.isCapture
  const currentItem = e.currentTarget.getAttribute('currentItem')

  if (!isCapture) e.stopPropagation()
  if (show && currentItem === 'true') {
    this.hideTooltip(e)
  } else {
    e.currentTarget.setAttribute('currentItem', 'true')

    this.showTooltip(e)
    setUntargetItems(e.currentTarget)
  }
}

const setUntargetItems = function (currentTarget) {
  let targetArray = this.getTargetArray()
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
  target.prototype.customBindListener = function () {
    const {event, eventOff} = this.state
    const dataEvent = event || target.getAttribute('data-event')
    const dataEventOff = eventOff || target.getAttribute('data-event-off')

    target.removeEventListener(dataEvent, checkStatus)
    target.addEventListener(dataEvent, checkStatus, false)
    if (dataEventOff) {
      target.removeEventListener(dataEventOff, this.hideTooltip)
      target.addEventListener(dataEventOff, ::this.hideTooltip, false)
    }
  }

  /* Unbind listener for custom event */
  target.prototype.customUnbindListener = function () {
    const {event, eventOff} = this.state
    const dataEvent = event || target.getAttribute('data-event')
    const dataEventOff = eventOff || target.getAttribute('data-event-off')

    target.removeEventListener(dataEvent, checkStatus)
    if (dataEventOff) target.removeEventListener(dataEventOff, this.hideTooltip)
  }
}
