import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { v4 } from 'uuid'

import type {
  AnchorRef,
  TooltipContextData,
  TooltipContextDataWrapper,
} from './TooltipProviderTypes'

const defaultContextData: TooltipContextData = {
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

const defaultContextWrapper = Object.assign(() => defaultContextData, defaultContextData)
const TooltipContext = createContext<TooltipContextDataWrapper>(defaultContextWrapper)

const TooltipProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const defaultTooltipId = v4()
  const [anchorRefMap, setAnchorRefMap] = useState<Record<string, Set<AnchorRef>>>({
    [defaultTooltipId]: new Set(),
  })
  const [activeAnchorMap, setActiveAnchorMap] = useState<Record<string, AnchorRef>>({
    [defaultTooltipId]: { current: null },
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
    (tooltipId?: string) => ({
      anchorRefs: anchorRefMap[tooltipId ?? defaultTooltipId] ?? new Set(),
      activeAnchor: activeAnchorMap[tooltipId ?? defaultTooltipId] ?? { current: null },
      attach: (...refs: AnchorRef[]) => attach(tooltipId ?? defaultTooltipId, ...refs),
      detach: (...refs: AnchorRef[]) => detach(tooltipId ?? defaultTooltipId, ...refs),
      setActiveAnchor: (ref: AnchorRef) => setActiveAnchor(tooltipId ?? defaultTooltipId, ref),
    }),
    [defaultTooltipId, anchorRefMap, activeAnchorMap, attach, detach],
  )

  const context = useMemo(() => {
    const contextData: TooltipContextData = getTooltipData(defaultTooltipId)
    const contextWrapper = Object.assign(
      (tooltipId?: string) => getTooltipData(tooltipId),
      contextData,
    )
    return contextWrapper
  }, [getTooltipData])

  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>
}

/*
  // this will use the "global" tooltip (same as `useTooltip()()`)
  const { anchorRefs, attach, detach } = useTooltip()

  // this will use the tooltip with id `tooltip-id`
  const { anchorRefs, attach, detach } = useTooltip()('tooltip-id')
*/
export function useTooltip() {
  return useContext(TooltipContext)
}

export default TooltipProvider
