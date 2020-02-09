/**
 * Tracking target removing from DOM.
 * It's necessary to hide tooltip when it's target disappears.
 * Otherwise, the tooltip would be shown forever until another target
 * is triggered.
 *
 * If MutationObserver is not available, this feature just doesn't work.
 */

// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
const getMutationObserverClass = () => {
  return (
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
  );
};

export default function(target) {
  target.prototype.bindRemovalTracker = function() {
    const MutationObserver = getMutationObserverClass();
    if (MutationObserver == null) return;

    const observer = new MutationObserver(mutations => {
      for (let m1 = 0; m1 < mutations.length; m1++) {
        const mutation = mutations[m1];
        for (let m2 = 0; m2 < mutation.removedNodes.length; m2++) {
          const element = mutation.removedNodes[m2];
          if (element === this.state.currentTarget) {
            this.hideTooltip();
            return;
          }
        }
      }
    });

    observer.observe(window.document, { childList: true, subtree: true });

    this.removalTracker = observer;
  };

  target.prototype.unbindRemovalTracker = function() {
    if (this.removalTracker) {
      this.removalTracker.disconnect();
      this.removalTracker = null;
    }
  };
}
