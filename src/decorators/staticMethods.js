/**
 * Static methods for react-tooltip
 */
import CONSTANT from '../constant'

const dispatchGlobalEvent = (eventName, opts) => {
  // Compatibale with IE
  // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
  let event

  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(eventName, { detail: opts })
  } else {
    event = document.createEvent('Event')
    event.initEvent(eventName, false, true)
    event.detail = opts
  }

  window.dispatchEvent(event)
}

export default function (target) {
  /**
   * Hide all tooltip
   * @trigger ReactTooltip.hide()
   */
  target.hide = (target) => {
    dispatchGlobalEvent(CONSTANT.GLOBAL.HIDE, {target})
  }

  /**
   * Rebuild all tooltip
   * @trigger ReactTooltip.rebuild()
   */
  target.rebuild = () => {
    dispatchGlobalEvent(CONSTANT.GLOBAL.REBUILD)
  }

  /**
   * Show specific tooltip
   * @trigger ReactTooltip.show()
   */
  target.show = (target) => {
    dispatchGlobalEvent(CONSTANT.GLOBAL.SHOW, {target})
  }

  target.prototype.globalRebuild = function () {
    if (this.mount) {
      this.unbindListener()
      this.bindListener()
    }
  }

  target.prototype.globalShow = function (event) {
    if (this.mount) {
      // Create a fake event, specific show will limit the type to `solid`
      // only `float` type cares e.clientX e.clientY
      const e = { currentTarget: event.detail.target }
      this.showTooltip(e, true)
    }
  }

  target.prototype.globalHide = function (event) {
    if (this.mount) {
      const hasTarget = event && event.detail && event.detail.target && true || false
      this.hideTooltip({ currentTarget: hasTarget && event.detail.target }, hasTarget)
    }
  }
}
