"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (nodeList) {
  var length = nodeList.length;
  if (nodeList.hasOwnProperty) {
    return Array.prototype.slice.call(nodeList);
  }
  return new Array(length).fill().map(function (index) {
    return nodeList[index];
  });
};