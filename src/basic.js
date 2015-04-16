var RCSS = require("rcss");

var tooltip = {
  background: '#222',
  borderRadius: '3px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '14px',
  left: '-999em',
  opacity: 0,
  padding: '8px 21px',
  position: 'fixed',
  pointerEvents: 'none',
  transition: 'opacity 0.5s ease-out, margin-top 0.3s ease-out',
  top: '-999em'
}
module.exports = RCSS.registerClass(tooltip);
