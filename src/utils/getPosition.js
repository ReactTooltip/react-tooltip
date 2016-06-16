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
export default function (e, target, node, place, effect, offset) {
  const tipWidth = node.clientWidth
  const tipHeight = node.clientHeight
  const {mouseX, mouseY} = getCurrentOffset(e, target, effect)
  const defaultOffset = getDefaultPosition(effect, target.clientWidth, target.clientHeight, tipWidth, tipHeight)
  const {extraOffset_X, extraOffset_Y} = calculateOffset(offset)

  const widnowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // Get the edge offset of the tooltip
  const getTipOffsetLeft = (place) => {
    const offset_X = defaultOffset[place].x
    return mouseX + offset_X + extraOffset_X
  }
  const getTipOffsetTop = (place) => {
    const offset_Y = defaultOffset[place].y
    return mouseY + offset_Y + extraOffset_Y
  }

  // Judge if the tooltip has over the window(screen)
  const outsideLeft = () => {
    // if switch to right will out of screen, return false because switch placement doesn't make sense
    return getTipOffsetLeft('left') < 0 && getTipOffsetLeft('right') <= widnowWidth
  }
  const outsideRight = () => {
    return getTipOffsetLeft('right') > widnowWidth && getTipOffsetLeft('left') >= 0
  }
  const outsideTop = () => {
    return getTipOffsetTop('top') < 0 && getTipOffsetTop('bottom') + tipHeight <= windowHeight
  }
  const outsideBottom = () => {
    return getTipOffsetTop('bottom') + tipHeight > windowHeight && getTipOffsetTop('top') >= 0
  }

  // Return new state to change the placement to the reverse if possible
  if (place === 'left' && outsideLeft()) {
    return {
      isNewState: true,
      newState: {place: 'right'}
    }
  } else if (place === 'right' && outsideRight()) {
    return {
      isNewState: true,
      newState: {place: 'left'}
    }
  } else if (place === 'top' && outsideTop()) {
    return {
      isNewState: true,
      newState: {place: 'bottom'}
    }
  } else if (place === 'bottom' && outsideBottom()) {
    return {
      isNewState: true,
      newState: {place: 'top'}
    }
  }

  // Return tooltip offset position
  return {
    isNewState: false,
    position: {
      left: getTipOffsetLeft(place),
      top: getTipOffsetTop(place)
    }
  }
}

// Get current mouse offset
const getCurrentOffset = (e, currentTarget, effect) => {
  const boundingClientRect = currentTarget.getBoundingClientRect()
  const targetTop = boundingClientRect.top
  const targetLeft = boundingClientRect.left
  const targetWidth = currentTarget.clientWidth
  const targetHeight = currentTarget.clientHeight

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
  const disToMouse = 15
  const triangleHeight = 5

  if (effect === 'float') {
    top = {x: -(tipWidth / 2), y: -(tipHeight + disToMouse - triangleHeight)}
    bottom = {x: -(tipWidth / 2), y: disToMouse}
    left = {x: -(tipWidth + disToMouse - triangleHeight), y: -(tipHeight / 2)}
    right = {x: disToMouse, y: -(tipHeight / 2)}
  } else if (effect === 'solid') {
    top = {x: -(tipWidth / 2), y: -(targetHeight / 2 + tipHeight)}
    bottom = {x: -(tipWidth / 2), y: targetHeight / 2}
    left = {x: -(tipWidth + targetWidth / 2), y: -(tipHeight / 2)}
    right = {x: targetWidth / 2, y: -(tipHeight / 2)}
  }

  return {top, bottom, left, right}
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

  return {extraOffset_X, extraOffset_Y}
}
