import React, { useEffect, useState, useRef, useCallback, useImperativeHandle, memo } from 'react'
import clsx from 'clsx'
import {
  deepEqual,
  useIsomorphicLayoutEffect,
  computeTooltipPosition,
  cssTimeToMs,
  clearTimeoutRef,
} from 'utils'
import type { IComputedPosition } from 'utils'
import coreStyles from './core-styles.module.css'
import styles from './styles.module.css'
import useTooltipAnchors from './use-tooltip-anchors'
import useTooltipEvents from './use-tooltip-events'
import type { IPosition, ITooltip, TooltipImperativeOpenOptions } from './TooltipTypes'

const Tooltip = ({
  // props
  forwardRef,
  id,
  className,
  classNameArrow,
  variant = 'dark',
  anchorSelect,
  place = 'top',
  offset = 10,
  openOnClick = false,
  positionStrategy = 'absolute',
  middlewares,
  wrapper: WrapperElement,
  delayShow = 0,
  delayHide = 0,
  float = false,
  hidden = false,
  noArrow = false,
  clickable = false,
  openEvents,
  closeEvents,
  globalCloseEvents,
  imperativeModeOnly,
  style: externalStyles,
  position,
  afterShow,
  afterHide,
  disableTooltip,
  // props handled by controller
  content,
  contentWrapperRef,
  isOpen,
  defaultIsOpen = false,
  setIsOpen,
  previousActiveAnchor,
  activeAnchor,
  setActiveAnchor,
  border,
  opacity,
  arrowColor,
  arrowSize = 8,
  role = 'tooltip',
}: ITooltip) => {
  const tooltipRef = useRef<HTMLElement>(null)
  const tooltipArrowRef = useRef<HTMLElement>(null)
  const tooltipShowDelayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipHideDelayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const missedTransitionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [computedPosition, setComputedPosition] = useState<IComputedPosition>({
    tooltipStyles: {},
    tooltipArrowStyles: {},
    place,
  })
  const [show, setShow] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [imperativeOptions, setImperativeOptions] = useState<TooltipImperativeOpenOptions | null>(
    null,
  )
  const wasShowing = useRef(false)
  const lastFloatPosition = useRef<IPosition | null>(null)
  const hoveringTooltip = useRef(false)
  const mounted = useRef(false)

  /**
   * useLayoutEffect runs before useEffect,
   * but should be used carefully because of caveats
   * https://beta.reactjs.org/reference/react/useLayoutEffect#caveats
   */
  useIsomorphicLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const handleShow = useCallback(
    (value: boolean) => {
      if (!mounted.current) {
        return
      }
      if (value) {
        setRendered(true)
      }
      /**
       * wait for the component to render and calculate position
       * before actually showing
       */
      setTimeout(() => {
        if (!mounted.current) {
          return
        }
        setIsOpen?.(value)
        if (isOpen === undefined) {
          setShow(value)
        }
      }, 10)
    },
    [isOpen, setIsOpen],
  )

  /**
   * Add aria-describedby to activeAnchor when tooltip is active
   */
  useEffect(() => {
    if (!id) return

    function getAriaDescribedBy(element: HTMLElement | null) {
      return element?.getAttribute('aria-describedby')?.split(' ') || []
    }

    function removeAriaDescribedBy(element: HTMLElement | null) {
      const newDescribedBy = getAriaDescribedBy(element).filter((s) => s !== id)
      if (newDescribedBy.length) {
        element?.setAttribute('aria-describedby', newDescribedBy.join(' '))
      } else {
        element?.removeAttribute('aria-describedby')
      }
    }

    if (show) {
      removeAriaDescribedBy(previousActiveAnchor)
      const currentDescribedBy = getAriaDescribedBy(activeAnchor)
      const describedBy = [...new Set([...currentDescribedBy, id])].filter(Boolean).join(' ')
      activeAnchor?.setAttribute('aria-describedby', describedBy)
    } else {
      removeAriaDescribedBy(activeAnchor)
    }

    // eslint-disable-next-line consistent-return
    return () => {
      // cleanup aria-describedby when the tooltip is closed
      removeAriaDescribedBy(activeAnchor)
      removeAriaDescribedBy(previousActiveAnchor)
    }
  }, [activeAnchor, show, id, previousActiveAnchor])

  /**
   * this replicates the effect from `handleShow()`
   * when `isOpen` is changed from outside
   */
  useEffect(() => {
    if (isOpen === undefined) {
      return () => null
    }
    if (isOpen) {
      setRendered(true)
    }
    const timeout = setTimeout(() => {
      setShow(isOpen)
    }, 10)
    return () => {
      clearTimeout(timeout)
    }
  }, [isOpen])

  useEffect(() => {
    if (show === wasShowing.current) {
      return
    }
    clearTimeoutRef(missedTransitionTimerRef)
    wasShowing.current = show
    if (show) {
      afterShow?.()
    } else {
      /**
       * see `onTransitionEnd` on tooltip wrapper
       */
      const style = getComputedStyle(document.body)
      const transitionShowDelay = cssTimeToMs(style.getPropertyValue('--rt-transition-show-delay'))
      missedTransitionTimerRef.current = setTimeout(() => {
        /**
         * if the tooltip switches from `show === true` to `show === false` too fast
         * the transition never runs, so `onTransitionEnd` callback never gets fired
         */
        setRendered(false)
        setImperativeOptions(null)
        afterHide?.()
        // +25ms just to make sure `onTransitionEnd` (if it gets fired) has time to run
      }, transitionShowDelay + 25)
    }
  }, [afterHide, afterShow, show])

  const handleComputedPosition = useCallback((newComputedPosition: IComputedPosition) => {
    if (!mounted.current) {
      return
    }
    setComputedPosition((oldComputedPosition) =>
      deepEqual(oldComputedPosition, newComputedPosition)
        ? oldComputedPosition
        : newComputedPosition,
    )
  }, [])

  const handleShowTooltipDelayed = useCallback(
    (delay = delayShow) => {
      if (tooltipShowDelayTimerRef.current) {
        clearTimeout(tooltipShowDelayTimerRef.current)
      }

      if (rendered) {
        // if the tooltip is already rendered, ignore delay
        handleShow(true)
        return
      }

      tooltipShowDelayTimerRef.current = setTimeout(() => {
        handleShow(true)
      }, delay)
    },
    [delayShow, handleShow, rendered],
  )

  const handleHideTooltipDelayed = useCallback(
    (delay = delayHide) => {
      if (tooltipHideDelayTimerRef.current) {
        clearTimeout(tooltipHideDelayTimerRef.current)
      }

      tooltipHideDelayTimerRef.current = setTimeout(() => {
        if (hoveringTooltip.current) {
          return
        }
        handleShow(false)
      }, delay)
    },
    [delayHide, handleShow],
  )

  const handleTooltipPosition = useCallback(
    ({ x, y }: IPosition) => {
      const virtualElement = {
        getBoundingClientRect() {
          return {
            x,
            y,
            width: 0,
            height: 0,
            top: y,
            left: x,
            right: x,
            bottom: y,
          }
        },
      } as Element
      computeTooltipPosition({
        place: imperativeOptions?.place ?? place,
        offset,
        elementReference: virtualElement,
        tooltipReference: tooltipRef.current,
        tooltipArrowReference: tooltipArrowRef.current,
        strategy: positionStrategy,
        middlewares,
        border,
        arrowSize,
      }).then((computedStylesData) => {
        handleComputedPosition(computedStylesData)
      })
    },
    [
      imperativeOptions?.place,
      place,
      offset,
      positionStrategy,
      middlewares,
      border,
      arrowSize,
      handleComputedPosition,
    ],
  )

  const updateTooltipPosition = useCallback(() => {
    const actualPosition = imperativeOptions?.position ?? position
    if (actualPosition) {
      // if `position` is set, override regular and `float` positioning
      handleTooltipPosition(actualPosition)
      return
    }

    if (float) {
      if (lastFloatPosition.current) {
        /*
          Without this, changes to `content`, `place`, `offset`, ..., will only
          trigger a position calculation after a `mousemove` event.

          To see why this matters, comment this line, run `yarn dev` and click the
          "Hover me!" anchor.
        */
        handleTooltipPosition(lastFloatPosition.current)
      }
      // if `float` is set, override regular positioning
      return
    }

    if (!activeAnchor?.isConnected) {
      return
    }

    computeTooltipPosition({
      place: imperativeOptions?.place ?? place,
      offset,
      elementReference: activeAnchor,
      tooltipReference: tooltipRef.current,
      tooltipArrowReference: tooltipArrowRef.current,
      strategy: positionStrategy,
      middlewares,
      border,
      arrowSize,
    }).then((computedStylesData) => {
      if (!mounted.current) {
        // invalidate computed positions after remount
        return
      }
      handleComputedPosition(computedStylesData)
    })
  }, [
    imperativeOptions?.position,
    imperativeOptions?.place,
    position,
    float,
    activeAnchor,
    place,
    offset,
    positionStrategy,
    middlewares,
    border,
    handleTooltipPosition,
    handleComputedPosition,
    arrowSize,
  ])

  const handleActiveAnchorRemoved = useCallback(() => {
    setRendered(false)
    handleShow(false)
    setActiveAnchor(null)
    clearTimeoutRef(tooltipShowDelayTimerRef)
    clearTimeoutRef(tooltipHideDelayTimerRef)
  }, [handleShow, setActiveAnchor])

  const anchorElements = useTooltipAnchors({
    id,
    anchorSelect,
    imperativeAnchorSelect: imperativeOptions?.anchorSelect,
    activeAnchor,
    disableTooltip,
    onActiveAnchorRemoved: handleActiveAnchorRemoved,
  })

  useTooltipEvents({
    activeAnchor,
    anchorElements,
    clickable,
    closeEvents,
    delayHide,
    delayShow,
    disableTooltip,
    float,
    globalCloseEvents,
    handleHideTooltipDelayed,
    handleShow,
    handleShowTooltipDelayed,
    handleTooltipPosition,
    hoveringTooltip,
    imperativeModeOnly,
    lastFloatPosition,
    openEvents,
    openOnClick,
    setActiveAnchor,
    show,
    tooltipHideDelayTimerRef,
    tooltipRef,
    tooltipShowDelayTimerRef,
    updateTooltipPosition,
  })

  useEffect(() => {
    updateTooltipPosition()
  }, [updateTooltipPosition])

  useEffect(() => {
    if (!contentWrapperRef?.current) {
      return () => null
    }

    let timeoutId: NodeJS.Timeout | null = null
    const contentObserver = new ResizeObserver(() => {
      // Clear any existing timeout to prevent memory leaks
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        if (mounted.current) {
          updateTooltipPosition()
        }
        timeoutId = null
      }, 0)
    })
    contentObserver.observe(contentWrapperRef.current)

    return () => {
      contentObserver.disconnect()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [content, contentWrapperRef, updateTooltipPosition])

  useEffect(() => {
    if (!activeAnchor || !anchorElements.includes(activeAnchor)) {
      /**
       * if there is no active anchor,
       * or if the current active anchor is not amongst the allowed ones,
       * reset it
       */
      setActiveAnchor(anchorElements[0] ?? null)
    }
  }, [anchorElements, activeAnchor, setActiveAnchor])

  useEffect(() => {
    if (defaultIsOpen) {
      handleShow(true)
    }
    return () => {
      clearTimeoutRef(tooltipShowDelayTimerRef)
      clearTimeoutRef(tooltipHideDelayTimerRef)
      clearTimeoutRef(missedTransitionTimerRef)
    }
  }, [defaultIsOpen, handleShow])

  useEffect(() => {
    if (tooltipShowDelayTimerRef.current) {
      /**
       * if the delay changes while the tooltip is waiting to show,
       * reset the timer with the new delay
       */
      clearTimeoutRef(tooltipShowDelayTimerRef)
      handleShowTooltipDelayed(delayShow)
    }
  }, [delayShow, handleShowTooltipDelayed])

  const actualContent = imperativeOptions?.content ?? content
  const hasContent = actualContent !== null && actualContent !== undefined
  const canShow = show && Object.keys(computedPosition.tooltipStyles).length > 0

  useImperativeHandle(forwardRef, () => ({
    open: (options) => {
      if (options?.anchorSelect) {
        try {
          document.querySelector(options.anchorSelect)
        } catch {
          if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`[react-tooltip] "${options.anchorSelect}" is not a valid CSS selector`)
          }
          return
        }
      }
      setImperativeOptions(options ?? null)
      if (options?.delay) {
        handleShowTooltipDelayed(options.delay)
      } else {
        handleShow(true)
      }
    },
    close: (options) => {
      if (options?.delay) {
        handleHideTooltipDelayed(options.delay)
      } else {
        handleShow(false)
      }
    },
    activeAnchor,
    place: computedPosition.place,
    isOpen: Boolean(rendered && !hidden && hasContent && canShow),
  }))

  useEffect(() => {
    return () => {
      // Final cleanup to ensure no memory leaks
      clearTimeoutRef(tooltipShowDelayTimerRef)
      clearTimeoutRef(tooltipHideDelayTimerRef)
      clearTimeoutRef(missedTransitionTimerRef)
    }
  }, [])

  return rendered && !hidden && hasContent ? (
    <WrapperElement
      id={id}
      role={role}
      className={clsx(
        'react-tooltip',
        coreStyles['tooltip'],
        styles['tooltip'],
        styles[variant],
        className,
        `react-tooltip__place-${computedPosition.place}`,
        coreStyles[canShow ? 'show' : 'closing'],
        canShow ? 'react-tooltip__show' : 'react-tooltip__closing',
        positionStrategy === 'fixed' && coreStyles['fixed'],
        clickable && coreStyles['clickable'],
      )}
      onTransitionEnd={(event: TransitionEvent) => {
        clearTimeoutRef(missedTransitionTimerRef)
        if (show || event.propertyName !== 'opacity') {
          return
        }
        setRendered(false)
        setImperativeOptions(null)
        afterHide?.()
      }}
      style={{
        ...externalStyles,
        ...computedPosition.tooltipStyles,
        opacity: opacity !== undefined && canShow ? opacity : undefined,
      }}
      ref={tooltipRef}
    >
      <WrapperElement
        className={clsx('react-tooltip-content-wrapper', coreStyles['content'], styles['content'])}
      >
        {actualContent}
      </WrapperElement>
      <WrapperElement
        className={clsx(
          'react-tooltip-arrow',
          coreStyles['arrow'],
          styles['arrow'],
          classNameArrow,
          noArrow && coreStyles['noArrow'],
        )}
        style={{
          ...computedPosition.tooltipArrowStyles,
          background: arrowColor
            ? `linear-gradient(to right bottom, transparent 50%, ${arrowColor} 50%)`
            : undefined,
          '--rt-arrow-size': `${arrowSize}px`,
        }}
        ref={tooltipArrowRef}
      />
    </WrapperElement>
  ) : null
}

export default memo(Tooltip)
