import React from 'react'

global.React = React

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.CSS = {
  supports: (key, value) => {
    if (key === 'opacity') {
      return value
    }

    return false
  },
}
