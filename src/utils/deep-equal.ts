const isObject = (object: unknown): object is Record<string, unknown> => {
  return object !== null && typeof object === 'object'
}

const deepEqual = (object1: unknown, object2: unknown): boolean => {
  if (!isObject(object1) || !isObject(object2)) {
    return object1 === object2
  }

  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every((key) => {
    const val1 = object1[key]
    const val2 = object2[key]
    if (isObject(val1) && isObject(val2)) {
      return deepEqual(val1, val2)
    }
    return val1 === val2
  })
}

export default deepEqual
