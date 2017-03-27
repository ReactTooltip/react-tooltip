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

    let listener = function (e) {
      if (e.currentTarget === tooltip.state.currentTarget) {
        tooltip.hideTooltip()
        this.listeners.splice(this.listeners.indexOf(listener), 1)
      }
    }
    listener = listener.bind(this)

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
    this.trackedElements = null
  }

  init () {
    if (this.inited) {
      this.unbind()
    }

    this.trackedElements = []

    const MutationObserver = getMutationObserverClass()
    if (MutationObserver) {
      this.observer = new MutationObserver(() => {
        for (const element of this.trackedElements) {
          if (this.isDetached(element) && element === this.tooltip.state.currentTarget) {
            this.tooltip.hideTooltip()
          }
        }
      })
      this.observer.observe(window.document, { childList: true, subtree: true })
    }

    this.inited = true
  }

  unbind () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
      this.trackedElements = null
    }
    this.inited = false
  }

  attach (element) {
    this.trackedElements.push(element)
  }

  // http://stackoverflow.com/a/32726412/7571078
  isDetached (element) {
    if (element.parentNode === window.document) {
      return false
    }
    if (element.parentNode == null) return true
    return this.isDetached(element.parentNode)
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
    this.removalTracker.attach(element)
  }

  target.prototype.unbindRemovalTracker = function () {
    this.removalTracker.unbind()
  }
}
