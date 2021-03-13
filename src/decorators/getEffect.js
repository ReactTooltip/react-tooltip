/**
 * Util method to get effect
 */

export default function(target) {
  target.prototype.getEffect = function(currentTarget) {
    const dataEffect = currentTarget.getAttribute('data-effect');
    return dataEffect || this.props.effect || 'float';
  };
}
