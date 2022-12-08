import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'

interface TooltipContextData {
  anchorRefs: Set<React.RefObject<HTMLElement>>
  attach: (...ref: React.RefObject<HTMLElement>[]) => void
  detach: (...ref: React.RefObject<HTMLElement>[]) => void
  activeAnchor: React.RefObject<HTMLElement>
  setActiveAnchor: React.Dispatch<React.SetStateAction<React.RefObject<HTMLElement>>>
}

const TooltipContext = createContext<TooltipContextData>({
  anchorRefs: new Set(),
  attach: () => {
    /* attach anchor element */
  },
  detach: () => {
    /* detach anchor element */
  },
  activeAnchor: { current: null },
  setActiveAnchor: () => {
    /* set active anchor */
  },
})

const TooltipProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [anchorRefs, setAnchorRefs] = useState<Set<React.RefObject<HTMLElement>>>(new Set())
  const [activeAnchor, setActiveAnchor] = useState<React.RefObject<HTMLElement>>({ current: null })

  const attach = (...refs: React.RefObject<HTMLElement>[]) => {
    setAnchorRefs((oldRefs) => {
      refs.forEach((ref) => oldRefs.add(ref))
      // create new set to trigger re-render
      return new Set(oldRefs)
    })
  }

  const detach = (...refs: React.RefObject<HTMLElement>[]) => {
    setAnchorRefs((oldRefs) => {
      refs.forEach((ref) => oldRefs.delete(ref))
      // create new set to trigger re-render
      return new Set(oldRefs)
    })
  }

  const context = useMemo(
    () => ({ anchorRefs, attach, detach, activeAnchor, setActiveAnchor }),
    [anchorRefs, attach, detach, activeAnchor, setActiveAnchor],
  )

  return <TooltipContext.Provider value={context}>{children}</TooltipContext.Provider>
}

export function useTooltip() {
  return useContext(TooltipContext)
}

export { TooltipProvider }
