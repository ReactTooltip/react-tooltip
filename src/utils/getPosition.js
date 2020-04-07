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
export default function (e, target, node, place, desiredPlace, effect, offset, autoFitWindowBounds) {
  if (!target || !node) {
    return {
      isNewState: false,
      position: {
        left: 0,
        top: 0
      }
    }
  }

  const {
    width: tipWidth,
    height: tipHeight
  } = getDimensions(node)

  const {
    width: targetWidth,
    height: targetHeight
  } = getDimensions(target)

  const { mouseX, mouseY } = getCurrentOffset(e, target, effect)
  const defaultOffset = getDefaultPosition(effect, targetWidth, targetHeight, tipWidth, tipHeight)
  const { extraOffset_X, extraOffset_Y } = calculateOffset(offset)

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const { parentTop, parentLeft } = getParent(node)

  // Get the edge offset of the tooltip
  const getTipOffsetLeft = (place) => {
    const offset_X = defaultOffset[place].l
    return mouseX + offset_X + extraOffset_X
  }
  const getTipOffsetRight = (place) => {
    const offset_X = defaultOffset[place].r
    return mouseX + offset_X + extraOffset_X
  }
  const getTipOffsetTop = (place) => {
    const offset_Y = defaultOffset[place].t
    return mouseY + offset_Y + extraOffset_Y
  }
  const getTipOffsetBottom = (place) => {
    const offset_Y = defaultOffset[place].b
    return mouseY + offset_Y + extraOffset_Y
  }

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
  let outsideLeft = p => getTipOffsetLeft(p) < 0
  let outsideRight = p => getTipOffsetRight(p) > windowWidth
  let outsideTop = p => getTipOffsetTop(p) < 0
  let outsideBottom = p => getTipOffsetBottom(p) > windowHeight

  // Check whether the tooltip with orientation p is completely inside the client window
  let outside = p => outsideLeft(p) || outsideRight(p) || outsideTop(p) || outsideBottom(p)
  let inside = p => !outside(p)

  let placesList = ['top', 'bottom', 'left', 'right']
  let insideList = []
  for (let i = 0; i < 4; i++) {
    let p = placesList[i]
    if (inside(p)) {
      insideList.push(p)
    }
  }

  let isNewState = false
  let newPlace

  if (autoFitWindowBounds) {
    if (inside(desiredPlace) && desiredPlace !== place) {
      isNewState = true
      newPlace = desiredPlace
    } else if (insideList.length > 0 && outside(desiredPlace) && outside(place)) {
      isNewState = true
      newPlace = insideList[0]
    }
  }

  if (isNewState) {
    return {
      isNewState: true,
      newState: { place: newPlace }
    }
  }

  return {
    isNewState: false,
    position: {
      left: parseInt(getTipOffsetLeft(place) - parentLeft, 10),
      top: parseInt(getTipOffsetTop(place) - parentTop, 10)
    }
  }
}

const getDimensions = (node) => {
  if (!node) {
    return {
      height: 0,
      width: 0
    }
  }

  const { height, width } = node.getBoundingClientRect()
  return {
    height: parseInt(height, 10),
    width: parseInt(width, 10)
  }
}

// Get current mouse offset
const getCurrentOffset = (e, currentTarget, effect) => {
  const boundingClientRect = currentTarget.getBoundingClientRect()
  const targetTop = boundingClientRect.top
  const targetLeft = boundingClientRect.left
  const {
    width: targetWidth,
    height: targetHeight
  } = getDimensions(currentTarget)

  if (effect === 'float') {
    return {
      mouseX: e.clientX,
      mouseY: e.clientY
    }
  }
  return {
    mouseX: targetLeft + (targetWidth / 2),
    mouseY: targetTop + (targetHeight / 2)
  }
}

// List all possibility of tooltip final offset
// This is useful in judging if it is necessary for tooltip to switch position when out of window
const getDefaultPosition = (effect, targetWidth, targetHeight, tipWidth, tipHeight) => {
  let top
  let right
  let bottom
  let left
  const disToMouse = 3
  const triangleHeight = 2
  const cursorHeight = 12 // Optimize for float bottom only, cause the cursor will hide the tooltip

  if (effect === 'float') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(tipHeight + disToMouse + triangleHeight),
      b: -disToMouse
    }
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: disToMouse + cursorHeight,
      b: tipHeight + disToMouse + triangleHeight + cursorHeight
    }
    left = {
      l: -(tipWidth + disToMouse + triangleHeight),
      r: -disToMouse,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    }
    right = {
      l: disToMouse,
      r: tipWidth + disToMouse + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    }
  } else if (effect === 'solid') {
    top = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: -(targetHeight / 2 + tipHeight + triangleHeight),
      b: -(targetHeight / 2)
    }
    bottom = {
      l: -(tipWidth / 2),
      r: tipWidth / 2,
      t: targetHeight / 2,
      b: targetHeight / 2 + tipHeight + triangleHeight
    }
    left = {
      l: -(tipWidth + targetWidth / 2 + triangleHeight),
      r: -(targetWidth / 2),
      t: -(tipHeight / 2),
      b: tipHeight / 2
    }
    right = {
      l: targetWidth / 2,
      r: tipWidth + targetWidth / 2 + triangleHeight,
      t: -(tipHeight / 2),
      b: tipHeight / 2
    }
  }

  return { top, bottom, left, right }
}

// Consider additional offset into position calculation
const calculateOffset = (offset) => {
  let extraOffset_X = 0
  let extraOffset_Y = 0

  if (Object.prototype.toString.apply(offset) === '[object String]') {
    offset = JSON.parse(offset.toString().replace(/\'/g, '\"'))
  }
  for (let key in offset) {
    if (key === 'top') {
      extraOffset_Y -= parseInt(offset[key], 10)
    } else if (key === 'bottom') {
      extraOffset_Y += parseInt(offset[key], 10)
    } else if (key === 'left') {
      extraOffset_X -= parseInt(offset[key], 10)
    } else if (key === 'right') {
      extraOffset_X += parseInt(offset[key], 10)
    }
  }

  return { extraOffset_X, extraOffset_Y }
}

// Get the offset of the parent elements
const getParent = (currentTarget) => {
  let currentParent = currentTarget
  while (currentParent) {
    if (window.getComputedStyle(currentParent).getPropertyValue('transform') !== 'none') {
      break
    }
    currentParent = currentParent.parentElement
  }

  const parentTop = currentParent && currentParent.getBoundingClientRect().top || 0
  const parentLeft = currentParent && currentParent.getBoundingClientRect().left || 0

  return { parentTop, parentLeft }
}
