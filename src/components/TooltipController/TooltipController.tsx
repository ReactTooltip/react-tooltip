import React, { useCallback, useEffect, useRef, useState, memo } from 'react'
import clsx from 'clsx'
import { Tooltip } from '../Tooltip'
import type {
  PositionStrategy,
  PlacesType,
  VariantType,
  WrapperType,
  DataAttribute,
  ITooltip,
  TooltipRefProps,
} from '../Tooltip/TooltipTypes'
import type { ITooltipController } from './TooltipControllerTypes'
import { observeAnchorAttributes } from './shared-attribute-observer'

const TooltipController = React.forwardRef<TooltipRefProps, ITooltipController>(
  (
    {
      id,
      anchorSelect,
      content,
      render,
      className,
      classNameArrow,
      variant = 'dark',
      portalRoot,
      place = 'top',
      offset = 10,
      wrapper = 'div',
      children = null,
      openOnClick = false,
      positionStrategy = 'absolute',
      middlewares,
      delayShow = 0,
      delayHide = 0,
      autoClose,
      float = false,
      hidden = false,
      noArrow = false,
      clickable = false,
      openEvents,
      closeEvents,
      globalCloseEvents,
      imperativeModeOnly = false,
      style,
      position,
      isOpen,
      defaultIsOpen = false,
      disableStyleInjection = false,
      border,
      opacity,
      arrowColor,
      arrowSize,
      setIsOpen,
      afterShow,
      afterHide,
      disableTooltip,
      role = 'tooltip',
    }: ITooltipController,
    ref,
  ) => {
    const [activeAnchor, setActiveAnchor] = useState<HTMLElement | null>(null)
    const [anchorDataAttributes, setAnchorDataAttributes] = useState<
      Partial<Record<DataAttribute, string | null>>
    >({})
    const previousActiveAnchorRef = useRef<HTMLElement | null>(null)
    const styleInjectionRef = useRef(disableStyleInjection)

    const handleSetActiveAnchor = useCallback((anchor: HTMLElement | null) => {
      setActiveAnchor((prev) => {
        if (!anchor?.isSameNode(prev)) {
          previousActiveAnchorRef.current = prev
        }
        return anchor
      })
    }, [])

    /* c8 ignore start */
    const getDataAttributesFromAnchorElement = (elementReference: HTMLElement) => {
      const dataAttributes = elementReference?.getAttributeNames().reduce(
        (acc, name) => {
          if (name.startsWith('data-tooltip-')) {
            const parsedAttribute = name.replace(/^data-tooltip-/, '') as DataAttribute
            acc[parsedAttribute] = elementReference?.getAttribute(name) ?? null
          }
          return acc
        },
        {} as Record<DataAttribute, string | null>,
      )

      return dataAttributes
    }
    /* c8 ignore end */

    useEffect(() => {
      if (styleInjectionRef.current === disableStyleInjection) {
        return
      }
      /* c8 ignore start */
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[react-tooltip] Do not change `disableStyleInjection` dynamically.')
      }
      /* c8 ignore end */
    }, [disableStyleInjection])

    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('react-tooltip-inject-styles', {
            detail: {
              disableCore: disableStyleInjection === 'core',
              disableBase: disableStyleInjection,
            },
          }),
        )
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (!activeAnchor) {
        setAnchorDataAttributes({})
        return () => {}
      }

      const updateAttributes = (element: HTMLElement) => {
        const attrs = getDataAttributesFromAnchorElement(element)
        setAnchorDataAttributes((prev) => {
          const keys = Object.keys(attrs) as DataAttribute[]
          const prevKeys = Object.keys(prev) as DataAttribute[]
          if (keys.length === prevKeys.length && keys.every((key) => attrs[key] === prev[key])) {
            return prev
          }
          return attrs
        })
      }

      updateAttributes(activeAnchor)

      const unsubscribe = observeAnchorAttributes(activeAnchor, updateAttributes)

      return unsubscribe
    }, [activeAnchor, anchorSelect])

    useEffect(() => {
      /* c8 ignore start */
      if (process.env.NODE_ENV === 'production') {
        return
      }
      /* c8 ignore end */
      if (style?.border) {
        console.warn('[react-tooltip] Do not set `style.border`. Use `border` prop instead.')
      }
      if (style?.opacity) {
        console.warn('[react-tooltip] Do not set `style.opacity`. Use `opacity` prop instead.')
      }
    }, [border, opacity, style?.border, style?.opacity])

    /**
     * content priority: children < render or content < html
     * children should be lower priority so that it can be used as the "default" content
     */
    const tooltipContent = anchorDataAttributes.content ?? content
    const tooltipPlace = (anchorDataAttributes.place as PlacesType | undefined) ?? place
    const tooltipVariant = (anchorDataAttributes.variant as VariantType | undefined) ?? variant
    const tooltipOffset =
      anchorDataAttributes.offset == null ? offset : Number(anchorDataAttributes.offset)
    const tooltipWrapper = (anchorDataAttributes.wrapper as WrapperType | undefined) ?? wrapper
    const tooltipPositionStrategy =
      (anchorDataAttributes['position-strategy'] as PositionStrategy | undefined) ??
      positionStrategy
    const tooltipDelayShow =
      anchorDataAttributes['delay-show'] == null
        ? delayShow
        : Number(anchorDataAttributes['delay-show'])
    const tooltipDelayHide =
      anchorDataAttributes['delay-hide'] == null
        ? delayHide
        : Number(anchorDataAttributes['delay-hide'])
    const tooltipAutoClose =
      anchorDataAttributes['auto-close'] == null
        ? autoClose
        : Number(anchorDataAttributes['auto-close'])
    const tooltipFloat =
      anchorDataAttributes.float == null ? float : anchorDataAttributes.float === 'true'
    const tooltipHidden =
      anchorDataAttributes.hidden == null ? hidden : anchorDataAttributes.hidden === 'true'
    const tooltipClassName = anchorDataAttributes['class-name'] ?? null

    let renderedContent = children
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    if (render) {
      const actualContent = anchorDataAttributes.content ?? tooltipContent ?? null
      const rendered = render({ content: actualContent, activeAnchor }) as React.ReactNode
      renderedContent = rendered ? (
        <div ref={contentWrapperRef} className="react-tooltip-content-wrapper">
          {rendered}
        </div>
      ) : null
    } else if (tooltipContent !== null && tooltipContent !== undefined) {
      renderedContent = tooltipContent
    }

    const props: ITooltip = {
      forwardRef: ref,
      id,
      anchorSelect,
      className: clsx(className, tooltipClassName),
      classNameArrow,
      content: renderedContent,
      contentWrapperRef,
      portalRoot,
      place: tooltipPlace,
      variant: tooltipVariant,
      offset: tooltipOffset,
      wrapper: tooltipWrapper,
      openOnClick,
      positionStrategy: tooltipPositionStrategy,
      middlewares,
      delayShow: tooltipDelayShow,
      delayHide: tooltipDelayHide,
      autoClose: tooltipAutoClose,
      float: tooltipFloat,
      hidden: tooltipHidden,
      noArrow,
      clickable,
      openEvents,
      closeEvents,
      globalCloseEvents,
      imperativeModeOnly,
      style,
      position,
      isOpen,
      defaultIsOpen,
      border,
      opacity,
      arrowColor,
      arrowSize,
      setIsOpen,
      afterShow,
      afterHide,
      disableTooltip,
      activeAnchor,
      previousActiveAnchor: previousActiveAnchorRef.current,
      setActiveAnchor: handleSetActiveAnchor,
      role,
    }

    return <Tooltip {...props} />
  },
)

export default memo(TooltipController)
