import { useState } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions'
import { Tooltip } from 'components/Tooltip'
import styles from './styles.module.css'

function App() {
  const [open, setOpen] = useState(false)

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top',
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  })

  // Event listeners to change the open state
  const hover = useHover(context, { move: false })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  // Role props for screen readers
  const role = useRole(context, { role: 'tooltip' })

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role])

  return (
    <main className={styles['main']}>
      <button ref={reference} {...getReferenceProps()}>
        Hover or focus me
      </button>
      <FloatingPortal>
        {open && (
          <Tooltip
            innerRef={floating}
            x={x}
            y={y}
            strategy={strategy}
            floatingProps={{ ...getFloatingProps() }}
          />
        )}
      </FloatingPortal>
    </main>
  )
}

export default App
