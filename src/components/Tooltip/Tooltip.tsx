import styles from './styles.module.css'
import type { ITooltip } from './TooltipTypes'

const Tooltip = ({ innerRef, strategy, y, x, floatingProps }: ITooltip) => {
  return (
    <div
      ref={innerRef}
      className={styles['tooltip']}
      style={{
        // Positioning styles
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        width: 'max-content',
      }}
      {...floatingProps}
    >
      Hello World from a Tooltip
    </div>
  )
}

export default Tooltip
