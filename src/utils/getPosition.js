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
 * @return {Object}
 * - `isNewState` {Bool} required
 * - `newState` {Object}
 * - `position` {Object} {left: {Number}, top: {Number}}
 */
export default function(e, target, node, place, desiredPlace, effect, offset) {
  const { width: tipWidth, height: tipHeight } = getDimensions(node);

  const { width: targetWidth, height: targetHeight } = getDimensions(target);

  const { mouseX, mouseY } = getCurrentOffset(e, target, effect);
  const defaultOffset = getDefaultPosition(
    effect,
    targetWidth,
    targetHeight,
    tipWidth,
    tipHeight
  );
  const { extraOffsetX, extraOffsetY } = calculateOffset(offset);

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const { parentTop, parentLeft } = getParent(node);

  // Get the edge offset of the tooltip
  const getTipOffsetLeft = place => {
    const offsetX = defaultOffset[place].l;
    return mouseX + offsetX + extraOffsetX;
  };
  const getTipOffsetRight = place => {
    const offsetX = defaultOffset[place].r;
    return mouseX + offsetX + extraOffsetX;
  };
  const getTipOffsetTop = place => {
    const offsetY = defaultOffset[place].t;
    return mouseY + offsetY + extraOffsetY;
  };
  const getTipOffsetBottom = place => {
    const offsetY = defaultOffset[place].b;
    return mouseY + offsetY + extraOffsetY;
  };

  //
  // Functions to test whether the tooltip's sides are inside
  // the client window for a given orientation p
  //
  //  _____________
  // |             | <-- Right side
  // | p = 'left'  |\
  // |             |/  |\
  // |_____________|   |_\  <-- Mouse
  //      / \           |
  //       |
  //       |
  //  Bottom side
  //
  const outsideLeft = p => getTipOffsetLeft(p) < 0;
  const outsideRight = p => getTipOffsetRight(p) > windowWidth;
  const outsideTop = p => getTipOffsetTop(p) < 0;
  const outsideBottom = p => getTipOffsetBottom(p) > windowHeight;

  // Check whether the tooltip with orientation p is completely inside the client window
  const outside = p =>
    outsideLeft(p) || outsideRight(p) || outsideTop(p) || outsideBottom(p);
  const inside = p => !outside(p);

  const placesList = ['top', 'bottom', 'left', 'right'];
  const insideList = [];
  for (let i = 0; i < 4; i++) {
    const p = placesList[i];
    if (inside(p)) {
      insideList.push(p);
    }
  }

  let isNewState = false;
  let newPlace;
  const shouldUpdatePlace = desiredPlace !== place;
  if (inside(desiredPlace) && shouldUpdatePlace) {
    isNewState = true;
    newPlace = desiredPlace;
  } else if (insideList.length > 0 && outside(desiredPlace) && outside(place)) {
    isNewState = true;
    newPlace = insideList[0];
  }

  if (isNewState) {
    return {
      isNewState: true,
      newState: { place: newPlace }
    };
  }

  return {
    isNewState: false,
    position: {
      left: parseInt(getTipOffsetLeft(place) - parentLeft, 10),
      top: parseInt(getTipOffsetTop(place) - parentTop, 10)
    }
  };
}

const getDimensions = node => {
  const { height, width } = node.getBoundingClientRect();
  return {
    height: parseInt(height, 10),
    width: parseInt(width, 10)
  };
};

// Get current mouse offset
const getCurrentOffset = (e, currentTarget, effect) => {
  const boundingClientRect = currentTarget.getBoundingClientRect();
  const targetTop = boundingClientRect.top;
  const targetLeft = boundingClientRect.left;
  const { width: targetWidth, height: targetHeight } = getDimensions(
    currentTarget
  );

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
const getDefaultPosition = (
  effect,
  targetWidth,
  targetHeight,
  tipWidth,
  tipHeight
) => {
  let top;
  let right;
  let bottom;
  let left;
  const disToMouse = 3;
  const triangleHeight = 2;
  const cursorHeight = 12; // Optimize for float bottom only, cause the cursor will hide the tooltip

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

  return { top, bottom, left, right };
};

// Consider additional offset into position calculation
const calculateOffset = offset => {
  let extraOffsetX = 0;
  let extraOffsetY = 0;

  if (Object.prototype.toString.apply(offset) === '[object String]') {
    offset = JSON.parse(offset.toString().replace(/'/g, '"'));
  }
  for (const key in offset) {
    if (key === 'top') {
      extraOffsetY -= parseInt(offset[key], 10);
    } else if (key === 'bottom') {
      extraOffsetY += parseInt(offset[key], 10);
    } else if (key === 'left') {
      extraOffsetX -= parseInt(offset[key], 10);
    } else if (key === 'right') {
      extraOffsetX += parseInt(offset[key], 10);
    }
  }

  return { extraOffsetX, extraOffsetY };
};

// Get the offset of the parent elements
const getParent = currentTarget => {
  let currentParent = currentTarget;
  while (currentParent) {
    const computedStyle = window.getComputedStyle(currentParent);
    // transform and will-change: transform change the containing block
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_Block
    if (
      computedStyle.getPropertyValue('transform') !== 'none' ||
      computedStyle.getPropertyValue('will-change') === 'transform'
    )
      break;
    currentParent = currentParent.parentElement;
  }

  const parentTop =
    (currentParent && currentParent.getBoundingClientRect().top) || 0;
  const parentLeft =
    (currentParent && currentParent.getBoundingClientRect().left) || 0;

  return { parentTop, parentLeft };
};
