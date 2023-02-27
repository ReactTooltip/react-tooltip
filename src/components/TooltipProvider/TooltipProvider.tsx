import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import type {
  AnchorRef,
  TooltipContextData,
  TooltipContextDataWrapper,
} from './TooltipProviderTypes'

const DEFAULT_TOOLTIP_ID = 'DEFAULT_TOOLTIP_ID'
const DEFAULT_CONTEXT_DATA: TooltipContextData = {
  anchorRefs: new Set(),
  activeAnchor: { current: null },
  attach: () => {
    /* attach anchor element */
  },
  detach: () => {
    /* detach anchor element */
  },
  setActiveAnchor: () => {
    /* set active anchor */
  },
}

const DEFAULT_CONTEXT_DATA_WRAPPER: TooltipContextDataWrapper = {
  getTooltipData: () => DEFAULT_CONTEXT_DATA,
}

const TooltipContext = createContext<TooltipContextDataWrapper>(DEFAULT_CONTEXT_DATA_WRAPPER)

/**
 * @deprecated Use the `data-tooltip-id` attribute, or the `anchorSelect` prop instead.
 * See https://react-tooltip.com/docs/getting-started
 */
const TooltipProvider: React.FC<PropsWithChildren<void>> = ({ children }) => {
  const [anchorRefMap, setAnchorRefMap] = useState<Record<string, Set<AnchorRef>>>({
    [DEFAULT_TOOLTIP_ID]: new Set(),
  })
  const [activeAnchorMap, setActiveAnchorMap] = useState<Record<string, AnchorRef>>({
    [DEFAULT_TOOLTIP_ID]: { current: null },
  })

  const attach = (tooltipId: string, ...refs: AnchorRef[]) => {
    setAnchorRefMap((oldMap) => {
      const tooltipRefs = oldMap[tooltipId] ?? new Set()
      refs.forEach((ref) => tooltipRefs.add(ref))
      // create new object to trigger re-render
      return { ...oldMap, [tooltipId]: new Set(tooltipRefs) }
    })
  }

  const detach = (tooltipId: string, ...refs: AnchorRef[]) => {
    setAnchorRefMap((oldMap) => {
      const tooltipRefs = oldMap[tooltipId]
      if (!tooltipRefs) {
        // tooltip not found
        // maybe thow error?
        return oldMap
      }
      refs.forEach((ref) => tooltipRefs.delete(ref))
      // create new object to trigger re-render
      return { ...oldMap }
    })
  }

  const setActiveAnchor = (tooltipId: string, ref: React.RefObject<HTMLElement>) => {
    setActiveAnchorMap((oldMap) => {
      if (oldMap[tooltipId]?.current === ref.current) {
        return oldMap
      }
      // create new object to trigger re-render
      return { ...oldMap, [tooltipId]: ref }
    })
  }

  const getTooltipData = useCallback(
    (tooltipId = DEFAULT_TOOLTIP_ID) => ({
      anchorRefs: anchorRefMap[tooltipId] ?? new Set(),
      activeAnchor: activeAnchorMap[tooltipId] ?? { current: null },
      attach: (...refs: AnchorRef[]) => attach(tooltipId, ...refs),
      detach: (...refs: AnchorRef[]) => detach(tooltipId, ...refs),
      setActiveAnchor: (ref: AnchorRef) => setActiveAnchor(tooltipId, ref),
    }),
    [anchorRefMap, activeAnchorMap, attach, detach],
  )

  const context = useMemo(() => {
    return {
      getTooltipData,
    }
  }, [getTooltipData])

  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>
}

export function useTooltip(tooltipId = DEFAULT_TOOLTIP_ID) {
  return useContext(TooltipContext).getTooltipData(tooltipId)
}

export default TooltipProvider
