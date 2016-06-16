/**
 * Static methods for react-tooltip
 */
import CONSTANT from '../constant'

const dispatchGlobalEvent = (eventName) => {
  // Compatibale with IE
  // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
  let event

  if (typeof window.Event === 'function') {
    event = new window.Event(eventName)
  } else {
    event = document.createEvent('Event')
    event.initEvent(eventName, false, true)
  }

  window.dispatchEvent(event)
}

export default function (target) {
  /**
   * Hide all tooltip
   * @trigger ReactTooltip.hide()
   */
  target.hide = () => {
    dispatchGlobalEvent(CONSTANT.GLOBAL.HIDE)
  }

  /**
   * Rebuild all tooltip
   * @trigger ReactTooltip.rebuild()
   */
  target.rebuild = () => {
    dispatchGlobalEvent(CONSTANT.GLOBAL.REBUILD)
  }

  target.prototype.globalRebuild = function () {
    if (this.mount) {
      this.unbindListener()
      this.bindListener()
    }
  }
}
