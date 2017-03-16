/**
 * Util method to get effect
 */

export default function (target) {
  target.prototype.isBodyMode = function () {
    return this.props.bodyMode
  }

  const clone = (e) => {
    const copy = {}
    for (const key in e) {
      copy[key] = e[key]
    }
    return copy
  }

  const bodyListener = function (callback, respectEffect, e) {
    const {id} = this.props

    const tip = e.target.dataset.tip
    const _for = e.target.dataset.for

    const target = e.target

    if (tip != null
      && (!respectEffect || this.getEffect(target) === 'float')
      && (
      (id == null && _for == null)
        || (id != null && _for === id)
    )) {
      const x = clone(e)
      x.currentTarget = target
      callback(x)
    }
  }

  target.prototype.bindBodyListener = function () {
    const body = document.getElementsByTagName('body')[0]

    const listeners = this.bodyModeListeners = {
      'mouseover': bodyListener.bind(this, this.showTooltip, false),
      'mousemove': bodyListener.bind(this, this.updateTooltip, true),
      'mouseout': bodyListener.bind(this, this.hideTooltip, false)
    }
    for (const event in listeners) {
      body.addEventListener(event, listeners[event])
    }
  }

  target.prototype.unbindBodyListener = function () {
    const body = document.getElementsByTagName('body')[0]

    const listeners = this.bodyModeListeners
    for (const event in listeners) {
      body.removeEventListener(event, listeners(event))
    }
  }
}


