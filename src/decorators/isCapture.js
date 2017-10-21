/**
 * Util method to judge if it should follow capture model
 */

export default function (target) {
  target.prototype.isCapture = function (currentTarget) {
    const dataIsCapture = currentTarget !== null ? currentTarget.getAttribute('data-iscapture') : null;
    return dataIsCapture && dataIsCapture === 'true' || this.props.isCapture || false
  }
}
