/* For Standard.js lint checking */
/* eslint-env mocha */

import React from 'react'
import { mount } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import ReactTooltip from '../src'

/* Initial test tools */
chai.use(chaiEnzyme())

describe('Global methods', () => {
  it('should be hided by invoking ReactTooltip.hide', () => {
    const wrapper = mount(<ReactTooltip />)
    wrapper.setState({ show: true })
    expect(wrapper).to.have.state('show', true)
    ReactTooltip.hide()
    setImmediate(() => {
      expect(wrapper).to.have.state('show', false)
    })
  })

  it('should be rebuild by invoking ReactTooltip.rebuild', () => {
    sinon.spy(ReactTooltip.prototype, 'globalRebuild')
    ReactTooltip.rebuild()
    setImmediate(() => {
      expect(ReactTooltip.prototype.globalRebuild.calledOnce).to.equal(true)
    })
  })
})
