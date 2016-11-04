/* For Standard.js lint checking */
/* eslint-env mocha */
import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
// import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import ReactTooltip from '../src'

// Initial test tools
// @note chai enzyme has bug
// chai.use(chaiEnzyme())

describe.skip('Global methods', () => {
  before(() => {
    sinon.spy(ReactTooltip.prototype, 'hideTooltip')
    sinon.spy(ReactTooltip.prototype, 'globalRebuild')
  })

  it('should be hided by invoking ReactTooltip.hide', done => {
    const wrapper = mount(<ReactTooltip />)
    wrapper.setState({ show: true })
    ReactTooltip.hide()
    setImmediate(() => {
      expect(ReactTooltip.prototype.hideTooltip.calledOnce).to.equal(true)
      expect(wrapper).to.have.state('show', false)
      done()
    })
  })

  it('should invoke globalRebuild when using ReactTooltip.rebuild', done => {
    ReactTooltip.rebuild()
    setImmediate(() => {
      expect(ReactTooltip.prototype.globalRebuild.calledOnce).to.equal(true)
      done()
    })
  })
})
