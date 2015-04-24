'use strict';

jest.dontMock('../index.js');

var React = require('react/addons');
var ReactTooltip = require('../index');
var TestUtils = React.addons.TestUtils;

describe('react tooltip', function() {
  var tooltip = TestUtils.renderIntoDocument(
    <ReactTooltip />
  );
  //correct placeholder
  it('should render data-placeholder', function() {
    var testNode = TestUtils.renderIntoDocument(
      <p data-placeholder='placeholder'>Lorem</p>
    );
    TestUtils.Simulate.mouseOver(testNode)

  })
  //correct position
  //display when blur
})
