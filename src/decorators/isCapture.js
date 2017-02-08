/**
 * Util method to judge if it should follow capture model
 */

export default function (target) {
  target.prototype.isCapture = function (currentTarget) {
    console.log('currentTarget', currentTarget)
    const dataIsCapture = currentTarget.getAttribute('data-iscapture')
    console.log(currentTarget.getAttribute('data-iscapture'), dataIsCapture)
    return dataIsCapture && dataIsCapture === 'true' || this.props.isCapture || false
  }
}
