// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
const getMutationObserverClass = () => {
  return window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
}

const isMutationObserverAvailable = () => {
  return getMutationObserverClass() != null
}

class EventBasedRemovalTracker {
  constructor (tooltip) {
    this.tooltip = tooltip
    this.listeners = []
  }

  attach (element) {
    const {tooltip} = this

    const listener = (e) => {
      if (e.currentTarget === tooltip.state.currentTarget) {
        tooltip.hideTooltip()
        this.listeners.splice(this.listeners.indexOf(listener), 1)
      }
    }

    this.listeners.push({
      element,
      listener
    })

    element.addEventListener('DOMNodeRemovedFromDocument', listener)
  }

  unbind () {
    for (const {listener, element} of this.listeners) {
      element.removeEventListener('DOMNodeRemovedFromDocument', listener)
    }
    this.listeners = []
  }
}

class MutationBasedRemovalTracker {
  constructor (tooltip) {
    this.tooltip = tooltip

    this.observer = null
    this.inited = false
  }

  init () {
    if (this.inited) {
      this.unbind()
    }
    this.inited = true

    const MutationObserver = getMutationObserverClass()
    if (!MutationObserver) {
      return
    }

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const element of mutation.removedNodes) {
          if (element === this.tooltip.state.currentTarget) {
            this.tooltip.hideTooltip()
            return
          }
        }
      }
    })

    this.observer.observe(window.document, { childList: true, subtree: true })
  }

  unbind () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.inited = false
  }
}

export default function (target) {
  target.prototype.bindRemovalTracker = function () {
    if (isMutationObserverAvailable()) {
      this.removalTracker = new MutationBasedRemovalTracker(this)
      this.removalTracker.init()
    } else {
      this.removalTracker = new EventBasedRemovalTracker(this)
    }
  }

  target.prototype.attachRemovalTracker = function (element) {
    if (this.removalTracker.attach) {
      this.removalTracker.attach(element)
    }
  }

  target.prototype.unbindRemovalTracker = function () {
    this.removalTracker.unbind()
    this.removalTracker = null
  }
}
