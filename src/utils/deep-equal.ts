const isObject = (object: unknown): object is Record<string, unknown> => {
  return object !== null && !Array.isArray(object) && typeof object === 'object'
}

const deepEqual = (object1: unknown, object2: unknown): boolean => {
  if (object1 === object2) {
    return true
  }

  if (Array.isArray(object1) && Array.isArray(object2)) {
    if (object1.length !== object2.length) {
      return false
    }
    return object1.every((val, index) => deepEqual(val, object2[index]))
  }

  if (Array.isArray(object1) !== Array.isArray(object2)) {
    return false
  }

  if (!isObject(object1) || !isObject(object2)) {
    return object1 === object2
  }

  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every((key) => deepEqual(object1[key], object2[key]))
}

export default deepEqual
