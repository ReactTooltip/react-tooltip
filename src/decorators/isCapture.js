/**
 * Util method to judge if it should follow capture model
 */

export default function (target) {
  target.prototype.isCapture = function (currentTarget) {
    const dataIsCapture = currentTarget.getAttribute('data-iscapture')
    return dataIsCapture && dataIsCapture === 'true' || this.props.isCapture || false
  }
}
