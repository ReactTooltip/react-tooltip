import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useEffect,
  createRef,
  cloneElement,
} from 'react'
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
import { computePosition } from '@floating-ui/dom'

import type { AppContextTypeData, AppContextTypeApi } from './AppContextTypes'

export const AppContextData = createContext({} as AppContextTypeData)
export const AppContextApi = createContext({} as AppContextTypeApi)

export function useAppGlobalStateData(): AppContextTypeData {
  const context = useContext(AppContextData)

  if (!context) {
    throw new Error('useAppGlobalStateData must be used within a AppGlobalStateProvider')
  }

  return context
}
export function useAppGlobalStateApi(): AppContextTypeApi {
  const context = useContext(AppContextApi)

  if (!context) {
    throw new Error('useAppGlobalStateApi must be used within a AppGlobalStateProvider')
  }

  return context
}

export const AppGlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const ref = createRef()

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('browser', ref)

      const elementsWithDataTip = []

      const tooltipElements = document.querySelectorAll('[data-tip]')

      tooltipElements.forEach((element) => {
        computePosition(element, tooltip, {
          placement: 'top',
          middleware: [offset(5), flip(), shift()],
        }).then(({ x, y }) => {
          Object.assign(tooltip.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
        })

        // elementsWithDataTip.push(newElement)
      })

      console.log(tooltipElements)
      // console.log(elementsWithDataTip)
    }
  }, [])

  const DataValue = useMemo(
    () => ({
      state: {
        open,
      },
    }),
    [open],
  )

  const ApiValue = useMemo(
    () => ({
      setOpen,
      getReferenceProps,
      getFloatingProps,
    }),
    [open],
  )

  return (
    <AppContextData.Provider value={DataValue}>
      <AppContextApi.Provider value={ApiValue}>{children}</AppContextApi.Provider>
    </AppContextData.Provider>
  )
}
