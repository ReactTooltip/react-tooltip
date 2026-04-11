import { useEffect, useState } from 'react'

const getAnchorSelector = ({
  id,
  anchorSelect,
  imperativeAnchorSelect,
}: {
  id?: string
  anchorSelect?: string
  imperativeAnchorSelect?: string
}) => {
  let selector = imperativeAnchorSelect ?? anchorSelect ?? ''
  if (!selector && id) {
    selector = `[data-tooltip-id='${id.replace(/'/g, "\\'")}']`
  }
  return selector
}

const queryAnchorsBySelector = ({
  selector,
  disableTooltip,
}: {
  selector: string
  disableTooltip?: (anchorRef: HTMLElement | null) => boolean
}) => {
  if (!selector) {
    return []
  }

  return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (anchor) => !disableTooltip?.(anchor),
  )
}

const useTooltipAnchors = ({
  id,
  anchorSelect,
  imperativeAnchorSelect,
  activeAnchor,
  disableTooltip,
  onActiveAnchorRemoved,
}: {
  id?: string
  anchorSelect?: string
  imperativeAnchorSelect?: string
  activeAnchor: HTMLElement | null
  disableTooltip?: (anchorRef: HTMLElement | null) => boolean
  onActiveAnchorRemoved: () => void
}) => {
  const [anchorElements, setAnchorElements] = useState<HTMLElement[]>([])

  useEffect(() => {
    const selector = getAnchorSelector({ id, anchorSelect, imperativeAnchorSelect })
    if (!selector) {
      return
    }

    try {
      setAnchorElements(queryAnchorsBySelector({ selector, disableTooltip }))
    } catch {
      setAnchorElements([])
    }
  }, [id, anchorSelect, imperativeAnchorSelect, disableTooltip])

  useEffect(() => {
    const selector = getAnchorSelector({ id, anchorSelect, imperativeAnchorSelect })

    const documentObserverCallback: MutationCallback = (mutationList) => {
      const addedAnchors = new Set<HTMLElement>()
      const removedAnchors = new Set<HTMLElement>()

      const maybeAddAnchor = (anchor: HTMLElement) => {
        if (disableTooltip?.(anchor)) {
          return
        }
        addedAnchors.add(anchor)
      }

      mutationList.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-tooltip-id') {
          const target = mutation.target as HTMLElement
          const newId = target.getAttribute('data-tooltip-id')
          if (newId === id) {
            maybeAddAnchor(target)
          } else if (mutation.oldValue === id) {
            removedAnchors.add(target)
          }
        }

        if (mutation.type !== 'childList') {
          return
        }

        const removedNodes = [...mutation.removedNodes].filter((node) => node.nodeType === 1)
        if (activeAnchor) {
          removedNodes.some((node) => {
            if (node?.contains?.(activeAnchor)) {
              onActiveAnchorRemoved()
              return true
            }
            return false
          })
        }

        if (!selector) {
          return
        }

        try {
          removedNodes.forEach((node) => {
            const element = node as HTMLElement
            if (element.matches(selector)) {
              removedAnchors.add(element)
            } else {
              element
                .querySelectorAll<HTMLElement>(selector)
                .forEach((innerNode) => removedAnchors.add(innerNode))
            }
          })
        } catch {
          /* c8 ignore start */
          if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`[react-tooltip] "${selector}" is not a valid CSS selector`)
          }
          /* c8 ignore end */
        }

        try {
          const addedNodes = [...mutation.addedNodes].filter((node) => node.nodeType === 1)
          addedNodes.forEach((node) => {
            const element = node as HTMLElement
            if (element.matches(selector)) {
              maybeAddAnchor(element)
            } else {
              element
                .querySelectorAll<HTMLElement>(selector)
                .forEach((innerNode) => maybeAddAnchor(innerNode))
            }
          })
        } catch {
          /* c8 ignore start */
          if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`[react-tooltip] "${selector}" is not a valid CSS selector`)
          }
          /* c8 ignore end */
        }
      })

      if (addedAnchors.size || removedAnchors.size) {
        setAnchorElements((anchors) => [
          ...anchors.filter((anchor) => !removedAnchors.has(anchor) && anchor.isConnected),
          ...addedAnchors,
        ])
      }
    }

    const documentObserver = new MutationObserver(documentObserverCallback)
    documentObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-tooltip-id'],
      attributeOldValue: true,
    })

    return () => {
      documentObserver.disconnect()
    }
  }, [
    id,
    anchorSelect,
    imperativeAnchorSelect,
    activeAnchor,
    disableTooltip,
    onActiveAnchorRemoved,
  ])

  return anchorElements
}

export default useTooltipAnchors
