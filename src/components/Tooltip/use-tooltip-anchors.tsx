import { useEffect, useMemo, useRef, useState } from 'react'
import { subscribeAnchorSelector } from './anchor-registry'

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
  const [rawAnchorElements, setRawAnchorElements] = useState<HTMLElement[]>([])
  const [selectorError, setSelectorError] = useState<Error | null>(null)
  const warnedSelectorRef = useRef<string | null>(null)
  const selector = useMemo(
    () => getAnchorSelector({ id, anchorSelect, imperativeAnchorSelect }),
    [id, anchorSelect, imperativeAnchorSelect],
  )
  const anchorElements = useMemo(
    () => rawAnchorElements.filter((anchor) => !disableTooltip?.(anchor)),
    [rawAnchorElements, disableTooltip],
  )

  const activeAnchorMatchesSelector = useMemo(() => {
    if (!activeAnchor || !selector) {
      return false
    }

    try {
      return activeAnchor.matches(selector)
    } catch {
      return false
    }
  }, [activeAnchor, selector])

  useEffect(() => {
    if (!selector) {
      setRawAnchorElements([])
      setSelectorError(null)
      return undefined
    }

    return subscribeAnchorSelector(selector, (anchors, error) => {
      setRawAnchorElements(anchors)
      setSelectorError(error)
    })
  }, [selector])

  useEffect(() => {
    if (!selectorError || warnedSelectorRef.current === selector) {
      return
    }
    warnedSelectorRef.current = selector
    /* c8 ignore start */
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[react-tooltip] "${selector}" is not a valid CSS selector`)
    }
    /* c8 ignore end */
  }, [selector, selectorError])

  useEffect(() => {
    if (!activeAnchor) {
      return
    }

    if (!activeAnchor.isConnected) {
      onActiveAnchorRemoved()
      return
    }

    if (!anchorElements.includes(activeAnchor) && !activeAnchorMatchesSelector) {
      onActiveAnchorRemoved()
    }
  }, [activeAnchor, anchorElements, activeAnchorMatchesSelector, onActiveAnchorRemoved])

  return anchorElements
}

export default useTooltipAnchors
