// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
const getMutationObserverClass = () => {
  return window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
}

const isMutationObserverAvailable = () => {
  return getMutationObserverClass() != null
}

class ObserverBasedRemovalTracker {
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
      this.removalTracker = new ObserverBasedRemovalTracker(this)
      this.removalTracker.init()
    }
  }

  target.prototype.unbindRemovalTracker = function () {
    this.removalTracker.unbind()
    this.removalTracker = null
  }
}
