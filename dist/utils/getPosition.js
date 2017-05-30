'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (e, target, node, place, effect, offset) {
  var tipWidth = node.clientWidth;
  var tipHeight = node.clientHeight;

  var _getCurrentOffset = getCurrentOffset(e, target, effect),
      mouseX = _getCurrentOffset.mouseX,
      mouseY = _getCurrentOffset.mouseY;

  var defaultOffset = getDefaultPosition(effect, target.clientWidth, target.clientHeight, tipWidth, tipHeight);

  var _calculateOffset = calculateOffset(offset),
      extraOffset_X = _calculateOffset.extraOffset_X,
      extraOffset_Y = _calculateOffset.extraOffset_Y;

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var _getParent = getParent(node),
      parentTop = _getParent.parentTop,
      parentLeft = _getParent.parentLeft;

  // Get the edge offset of the tooltip


  var getTipOffsetLeft = function getTipOffsetLeft(place) {
    var offset_X = defaultOffset[place].l;
    return mouseX + offset_X + extraOffset_X;
  };
  var getTipOffsetRight = function getTipOffsetRight(place) {
    var offset_X = defaultOffset[place].r;
    return mouseX + offset_X + extraOffset_X;
  };
  var getTipOffsetTop = function getTipOffsetTop(place) {
    var offset_Y = defaultOffset[place].t;
    return mouseY + offset_Y + extraOffset_Y;
  };
  var getTipOffsetBottom = function getTipOffsetBottom(place) {
    var offset_Y = defaultOffset[place].b;
    return mouseY + offset_Y + extraOffset_Y;
  };

  // Judge if the tooltip has over the window(screen)
  var outsideVertical = function outsideVertical() {
    var result = false;
    var newPlace = void 0;
    if (getTipOffsetTop('left') < 0 && getTipOffsetBottom('left') <= windowHeight && getTipOffsetBottom('bottom') <= windowHeight) {
      result = true;
      newPlace = 'bottom';
    } else if (getTipOffsetBottom('left') > windowHeight && getTipOffsetTop('left') >= 0 && getTipOffsetTop('top') >= 0) {
      result = true;
      newPlace = 'top';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideLeft = function outsideLeft() {
    var _outsideVertical = outsideVertical(),
        result = _outsideVertical.result,
        newPlace = _outsideVertical.newPlace; // Deal with vertical as first priority


    if (result && outsideHorizontal().result) {
      return { result: false }; // No need to change, if change to vertical will out of space
    }
    if (!result && getTipOffsetLeft('left') < 0 && getTipOffsetRight('right') <= windowWidth) {
      result = true; // If vertical ok, but let out of side and right won't out of side
      newPlace = 'right';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideRight = function outsideRight() {
    var _outsideVertical2 = outsideVertical(),
        result = _outsideVertical2.result,
        newPlace = _outsideVertical2.newPlace;

    if (result && outsideHorizontal().result) {
      return { result: false }; // No need to change, if change to vertical will out of space
    }
    if (!result && getTipOffsetRight('right') > windowWidth && getTipOffsetLeft('left') >= 0) {
      result = true;
      newPlace = 'left';
    }
    return { result: result, newPlace: newPlace };
  };

  var outsideHorizontal = function outsideHorizontal() {
    var result = false;
    var newPlace = void 0;
    if (getTipOffsetLeft('top') < 0 && getTipOffsetRight('top') <= windowWidth && getTipOffsetRight('right') <= windowWidth) {
      result = true;
      newPlace = 'right';
    } else if (getTipOffsetRight('top') > windowWidth && getTipOffsetLeft('top') >= 0 && getTipOffsetLeft('left') >= 0) {
      result = true;
      newPlace = 'left';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideTop = function outsideTop() {
    var _outsideHorizontal = outsideHorizontal(),
        result = _outsideHorizontal.result,
        newPlace = _outsideHorizontal.newPlace;

    if (result && outsideVertical().result) {
      return { result: false };
    }
    if (!result && getTipOffsetTop('top') < 0 && getTipOffsetBottom('bottom') <= windowHeight) {
      result = true;
      newPlace = 'bottom';
    }
    return { result: result, newPlace: newPlace };
  };
  var outsideBottom = function outsideBottom() {
    var _outsideHorizontal2 = outsideHorizontal(),
        result = _outsideHorizontal2.result,
        newPlace = _outsideHorizontal2.newPlace;

    if (result && outsideVertical().result) {
      return { result: false };
    }
    if (!result && getTipOffsetBottom('bottom') > windowHeight && getTipOffsetTop('top') >= 0) {
      result = true;
      newPlace = 'top';
    }
    return { result: result, newPlace: newPlace };
  };

  // Return new state to change the placement to the reverse if possible
  var outsideLeftResult = outsideLeft();
  var outsideRightResult = outsideRight();
  var outsideTopResult = outsideTop();
  var outsideBottomResult = outsideBottom();

  if (place === 'left' && outsideLeftResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideLeftResult.newPlace }
    };
  } else if (place === 'right' && outsideRightResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideRightResult.newPlace }
    };
  } else if (place === 'top' && outsideTopResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideTopResult.newPlace }
    };
  } else if (place === 'bottom' && outsideBottomResult.result) {
    return {
      isNewState: true,
      newState: { place: outsideBottomResult.newPlace }
    };
  }

  // Return tooltip offset position
  return {
    isNewState: false,
    position: {
      left: parseInt(getTipOffsetLeft(place) - parentLeft, 10),
      top: parseInt(getTipOffsetTop(place) - parentTop, 10)
    }
  };
};

// Get current mouse offset
var getCurrentOffset = function getCurrentOffset(e, currentTarget, effect) {
  var boundingClientRect = currentTarget.getBoundingClientRect();
  var targetTop = boundingClientRect.top;
  var targetLeft = boundingClientRect.left;
  var targetWidth = currentTarget.clientWidth;
  var targetHeight = currentTarget.clientHeight;

  if (effect === 'float') {
    return {
      mouseX: e.clientX,
      mouseY: e.clientY
    };
  }
  return {
    mouseX: targetLeft + targetWidth / 2,
    mouseY: targetTop + targetHeight / 2
  };
};

// List all possibility of tooltip final offset
// This is useful in judging if it is necessary for tooltip to switch position when out of window
/**
 * Calculate the position of tooltip
 *
 * @params
 * - `e` {Event} the event of current mouse
 * - `target` {Element} the currentTarget of the event
 * - `node` {DOM} the react-tooltip object
 * - `place` {String} top / right / bottom / left
 * - `effect` {String} float / solid
 * - `offset` {Object} the offset to default position
 *
 * @return {Object
 * - `isNewState` {Bool} required
 * - `newState` {Object}
 * - `position` {OBject} {left: {Number}, top: {Number}}
 */
var getDefaultPosition = function getDefaultPosition(effect, targetWidth, targetHeight, tipWidth, tipHeight) {
  var top = void 0;
  var right = void 0;
  var bottom = void 0;
  var left = void 0;
  var disToMouse = 3;
  var triangleHeight = 2;
  var cursorHeight = 12; // Optimize for float bottom only, cause the cursor will hide the tooltip

  if (effect === 'float') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(tipHeight + disToMouse + triangleHeight),
      b: -disToMouse
    };
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: disToMouse + cursorHeight,
      b: tipHeight + disToMouse + triangleHeight + cursorHeight
    };
    left = {
      l: -(tipWidth + disToMouse + triangleHeight),
      r: -disToMouse,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
    right = {
      l: disToMouse,
      r: tipWidth + disToMouse + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
  } else if (effect === 'solid') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(targetHeight / 2 + tipHeight + triangleHeight),
      b: -(targetHeight / 2)
    };
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: targetHeight / 2,
      b: targetHeight / 2 + tipHeight + triangleHeight
    };
    left = {
      l: -(tipWidth + targetWidth / 2 + triangleHeight),
      r: -(targetWidth / 2),
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
    right = {
      l: targetWidth / 2,
      r: tipWidth + targetWidth / 2 + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    };
  }

  return { top: top, bottom: bottom, left: left, right: right };
};

// Consider additional offset into position calculation
var calculateOffset = function calculateOffset(offset) {
  var extraOffset_X = 0;
  var extraOffset_Y = 0;

  if (Object.prototype.toString.apply(offset) === '[object String]') {
    offset = JSON.parse(offset.toString().replace(/\'/g, '\"'));
  }
  for (var key in offset) {
    if (key === 'top') {
      extraOffset_Y -= parseInt(offset[key], 10);
    } else if (key === 'bottom') {
      extraOffset_Y += parseInt(offset[key], 10);
    } else if (key === 'left') {
      extraOffset_X -= parseInt(offset[key], 10);
    } else if (key === 'right') {
      extraOffset_X += parseInt(offset[key], 10);
    }
  }

  return { extraOffset_X: extraOffset_X, extraOffset_Y: extraOffset_Y };
};

// Get the offset of the parent elements
var getParent = function getParent(currentTarget) {
  var currentParent = currentTarget;
  while (currentParent) {
    if (window.getComputedStyle(currentParent).getPropertyValue('transform') !== 'none') break;
    currentParent = currentParent.parentElement;
  }

  var parentTop = currentParent && currentParent.getBoundingClientRect().top || 0;
  var parentLeft = currentParent && currentParent.getBoundingClientRect().left || 0;

  return { parentTop: parentTop, parentLeft: parentLeft };
};