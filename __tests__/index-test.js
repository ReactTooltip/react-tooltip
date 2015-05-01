// __tests__/index-test.js

'use strict';

jest.dontMock('../index');

var React = require('react/addons');
var ReactTooltip = require('../index');
var TestUtils = React.addons.TestUtils;

describe('react tooltip', function() {
  var tooltip = TestUtils.renderIntoDocument(
    <ReactTooltip />
  );
  it('should render data-placeholder', function() {
    var span = TestUtils.findRenderDOMComponentWithTag(tooltip, "span");
    expect(span.getDOMNode().textContent).toEqual("");

  })
})
