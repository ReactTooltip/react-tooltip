/**
 * Events that should be bound to the window
 */
import CONSTANT from '../constant'

export default function (target) {
  target.prototype.bindWindowEvents = function () {
    // ReactTooltip.hide
    window.removeEventListener(CONSTANT.GLOBAL.HIDE, this.hideTooltip)
    window.addEventListener(CONSTANT.GLOBAL.HIDE, ::this.hideTooltip, false)

    // ReactTooltip.rebuild
    window.removeEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild)
    window.addEventListener(CONSTANT.GLOBAL.REBUILD, ::this.globalRebuild, false)

    // Resize
    window.removeEventListener('resize', this.onWindowResize)
    window.addEventListener('resize', ::this.onWindowResize, false)
  }

  target.prototype.unbindWindowEvents = function () {
    window.removeEventListener(CONSTANT.GLOBAL.HIDE, this.hideTooltip)
    window.removeEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild)
    window.removeEventListener(CONSTANT.GLOBAL.REBUILD, this.globalShow)
    window.removeEventListener('resize', this.onWindowResize)
  }

  /**
   * invoked by resize event of window
   */
  target.prototype.onWindowResize = function () {
    if (!this.mount) return
    this.hideTooltip()
  }
}
