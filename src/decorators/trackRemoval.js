// http://stackoverflow.com/a/32726412/7571078
const isDetached = (element) => {
  if (element.parentNode === window.document) {
    return false
  }
  if (element.parentNode == null) return true
  return isDetached(element.parentNode)
}

// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
const getMutationObserverClass = () => {
  return window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
}

export default function (target) {
  target.prototype.trackRemoval = function () {
    if (this.removalObserver) {
      this.releaseRemovalTracker()
    }

    this.tracked = []

    const MutationObserver = getMutationObserverClass()
    if (MutationObserver) {
      const observer = this.removalObserver = new MutationObserver(() => {
        for (const element of this.tracked) {
          if (isDetached(element) && element === this.state.currentTarget) {
            this.hideTooltip()
          }
        }
      })
      observer.observe(window.document, { childList: true, subtree: true })
    }
  }

  target.prototype.attachRemovalTracker = function (element) {
    this.tracked.push(element)

    const isMutationObserverAvailable = getMutationObserverClass()
    if (!isMutationObserverAvailable) {
      this.listeners = this.listeners || []

      let listener = function (e) {
        if (e.currentTarget === this.state.currentTarget) {
          this.hideTooltip()
          const idx = this.listeners.indexOf(listener)
          this.listeners.splice(idx, 1)
        }
      }
      listener = listener.bind(this)

      this.listeners.push({
        element,
        listener
      })

      element.addEventListener('DOMNodeRemovedFromDocument', listener)
    }
  }

  target.prototype.releaseRemovalTracker = function () {
    if (this.removalObserver) {
      this.removalObserver.disconnect()
      this.removalObserver = null
      this.tracked = []
    }
    if (this.listeners) {
      for (const {listener, element} of this.listeners) {
        element.removeEventListener('DOMNodeRemovedFromDocument', listener)
      }
      this.listeners = []
    }
  }
}
