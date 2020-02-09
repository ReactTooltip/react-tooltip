/**
 * Convert nodelist to array
 * @see https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/core/createArrayFromMixed.js#L24
 * NodeLists are functions in Safari
 */

export default function(nodeList) {
  const length = nodeList.length;
  if (nodeList.hasOwnProperty) {
    return Array.prototype.slice.call(nodeList);
  }
  return new Array(length).fill().map(index => nodeList[index]);
}
