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

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

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

  // Judge if the tooltip has over the window(screen)
  const outsideVertical = () => {
     // Check for horazontal tooltip, if their vertical out of screen
    let result = false
    let newPlace
    if (getTipOffsetTop('left') < 0 && getTipOffsetBottom('left') <= windowHeight) {
      result = true
      newPlace = 'bottom'
    } else if (getTipOffsetBottom('left') > windowHeight && getTipOffsetTop('left') >= 0) {
      result = true
      newPlace = 'top'
    }
    if (result && outsideHorizontal().result) result = false
    return {result, newPlace}
  }
  const outsideLeft = () => {
    // For horizontal tooltip, if vertical out of screen, change the vertical place
    let {result, newPlace} = outsideVertical()
    if (!result && getTipOffsetLeft('left') < 0 && getTipOffsetRight('right') <= windowWidth) {
      result = true
      newPlace = 'right'
    }
    return {result, newPlace}
  }
  const outsideRight = () => {
    let {result, newPlace} = outsideVertical()
    if (!result && getTipOffsetRight('right') > windowWidth && getTipOffsetLeft('left') >= 0) {
      result = true
      newPlace = 'left'
    }
    return {result, newPlace}
  }

  const outsideHorizontal = () => {
    let result = false
    let newPlace
    if (getTipOffsetLeft('top') < 0 && getTipOffsetRight('top') <= windowWidth) {
      result = true
      newPlace = 'right'
    } else if (getTipOffsetRight('top') > windowWidth && getTipOffsetLeft('top') >= 0) {
      result = true
      newPlace = 'left'
    }

    if (result && outsideVertical().result) result = false
    return {result, newPlace}
  }
  const outsideTop = () => {
    let {result, newPlace} = outsideHorizontal()
    if (!result && getTipOffsetTop('top') < 0 && getTipOffsetBottom('bottom') <= windowHeight) {
      result = true
      newPlace = 'bottom'
    }
    return {result, newPlace}
  }
  const outsideBottom = () => {
    let {result, newPlace} = outsideHorizontal()
    if (!result && getTipOffsetBottom('bottom') > windowHeight && getTipOffsetTop('top') >= 0) {
      result = true
      newPlace = 'top'
    }
    return {result, newPlace}
  }

  // Return new state to change the placement to the reverse if possible
  const outsideLeftResult = outsideLeft()
  const outsideRightResult = outsideRight()
  const outsideTopResult = outsideTop()
  const outsideBottomResult = outsideBottom()

  if (place === 'left' && outsideLeftResult.result) {
    return {
      isNewState: true,
      newState: {place: outsideLeftResult.newPlace}
    }
  } else if (place === 'right' && outsideRightResult.result) {
    return {
      isNewState: true,
      newState: {place: outsideRightResult.newPlace}
    }
  } else if (place === 'top' && outsideTopResult.result) {
    return {
      isNewState: true,
      newState: {place: outsideTopResult.newPlace}
    }
  } else if (place === 'bottom' && outsideBottomResult.result) {
    return {
      isNewState: true,
      newState: {place: outsideBottomResult.newPlace}
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
  const disToMouse = 8
  const triangleHeight = 2

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
      t: disToMouse,
      b: tipHeight + disToMouse + triangleHeight
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
