import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react'

type AnchorRef = React.RefObject<HTMLElement>

interface TooltipContextData {
  // when using one tooltip
  anchorRefs: Set<AnchorRef>
  activeAnchor: AnchorRef
  attach: (...refs: AnchorRef[]) => void
  detach: (...refs: AnchorRef[]) => void
  setActiveAnchor: (ref: AnchorRef) => void
}

type TooltipContextDataBuilder = (tooltipId?: string) => TooltipContextData

const TooltipContext = createContext<TooltipContextDataBuilder>(() => ({
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
}))

const TooltipProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const defaultTooltipId = useId()
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
      return { ...oldMap, [tooltipId]: tooltipRefs }
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
      // create new object to trigger re-render
      return { ...oldMap, [tooltipId]: ref }
    })
  }

  const context = useCallback(
    (tooltipId?: string) => ({
      anchorRefs: anchorRefMap[tooltipId ?? defaultTooltipId] ?? new Set(),
      activeAnchor: activeAnchorMap[tooltipId ?? defaultTooltipId] ?? { current: null },
      attach: (...refs: AnchorRef[]) => attach(tooltipId ?? defaultTooltipId, ...refs),
      detach: (...refs: AnchorRef[]) => detach(tooltipId ?? defaultTooltipId, ...refs),
      setActiveAnchor: (ref: AnchorRef) => setActiveAnchor(tooltipId ?? defaultTooltipId, ref),
    }),
    [defaultTooltipId, anchorRefMap, activeAnchorMap, attach, detach],
  )

  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>
}

export function useTooltip() {
  return useContext(TooltipContext)
}

export { TooltipProvider }
