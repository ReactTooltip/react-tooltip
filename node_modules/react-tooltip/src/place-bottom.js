var RCSS = require("rcss");

var tooltipBottom = {
  marginTop: '10px',
  ':after': {
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '8px solid #222',
    top: '-8px',
    left: '50%',
    marginLeft: '-10px',
    content: " ",
    width: 0,
    height: 0,
    position: 'absolute'
  }
}
module.exports = RCSS.registerClass(tooltipBottom);
