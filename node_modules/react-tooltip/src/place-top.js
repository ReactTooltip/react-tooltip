var RCSS = require("rcss");

var tooltipTop = {
  marginTop: '-10px',
  ':after': {
    marginLeft: '-10px',
    content: " ",
    width: 0,
    height: 0,
    position: 'absolute',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '8px solid #222',
    bottom: '-8px',
    left: '50%'
  }
}
module.exports = RCSS.registerClass(tooltipTop);
