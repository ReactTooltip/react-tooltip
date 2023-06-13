export default `
.rt-tooltip {
  visibility: hidden;
  width: max-content;
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 16px;
  border-radius: 3px;
  font-size: 90%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease-out;
  will-change: opacity, visibility;
}

.rt-fixed {
  position: fixed;
}

.rt-arrow {
  position: absolute;
  background: inherit;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}

.rt-noArrow {
  display: none;
}

.rt-clickable {
  pointer-events: auto;
}

.rt-show {
  visibility: visible;
  opacity: var(--rt-opacity);
}

/** Types variant **/
.rt-dark {
  background: var(--rt-color-dark);
  color: var(--rt-color-white);
}

.rt-light {
  background-color: var(--rt-color-white);
  color: var(--rt-color-dark);
}

.rt-success {
  background-color: var(--rt-color-success);
  color: var(--rt-color-white);
}

.rt-warning {
  background-color: var(--rt-color-warning);
  color: var(--rt-color-white);
}

.rt-error {
  background-color: var(--rt-color-error);
  color: var(--rt-color-white);
}

.rt-info {
  background-color: var(--rt-color-info);
  color: var(--rt-color-white);
}
`
