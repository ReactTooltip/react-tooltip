/**
 * Tracking target removing from DOM.
 * It's nessesary to hide tooltip when it's target disappears.
 * Otherwise, the tooltip would be shown forever until another target
 * is triggered.
 *
 * If MutationObserver is not available, this feature just doesn't work.
 */

// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
const getMutationObserverClass = () => {
  return window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
}

export default function (target) {
  target.prototype.bindRemovalTracker = function () {
    const MutationObserver = getMutationObserverClass()
    if (MutationObserver == null) return

    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const removedNodes = mutations[i].removedNodes
        for (let j = 0; j < removedNodes.length; j++) {
          const element = removedNodes[j]
          if (element === this.state.currentTarget) {
            this.hideTooltip()
            return
          }
        }
      }
    })

    observer.observe(window.document, { childList: true, subtree: true })

    this.removalTracker = observer
  }

  target.prototype.unbindRemovalTracker = function () {
    if (this.removalTracker) {
      this.removalTracker.disconnect()
      this.removalTracker = null
    }
  }
}
