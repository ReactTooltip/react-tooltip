/**
 * Util method to judge if it should follow capture model
 */

export default function(target) {
  target.prototype.isCapture = function(currentTarget) {
    return (
      (currentTarget &&
        currentTarget.getAttribute('data-tooltip-iscapture') === 'true') ||
      this.props.isCapture ||
      false
    );
  };
}
