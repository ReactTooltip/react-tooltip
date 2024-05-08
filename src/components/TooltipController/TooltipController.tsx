import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Tooltip } from 'components/Tooltip'
import type {
  PositionStrategy,
  PlacesType,
  VariantType,
  WrapperType,
  DataAttribute,
  ITooltip,
  TooltipRefProps,
} from 'components/Tooltip/TooltipTypes'
import { cssSupports } from 'utils'
import clsx from 'clsx'
import type { ITooltipController } from './TooltipControllerTypes'

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
      place = 'top',
      offset = 10,
      wrapper = 'div',
      children = null,
      openOnClick = false,
      positionStrategy = 'absolute',
      middlewares,
      delayShow = 0,
      delayHide = 0,
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
      setIsOpen,
      afterShow,
      afterHide,
      role = 'tooltip',
    }: ITooltipController,
    ref,
  ) => {
    const [tooltipContent, setTooltipContent] = useState(content)
    const [tooltipPlace, setTooltipPlace] = useState(place)
    const [tooltipVariant, setTooltipVariant] = useState(variant)
    const [tooltipOffset, setTooltipOffset] = useState(offset)
    const [tooltipDelayShow, setTooltipDelayShow] = useState(delayShow)
    const [tooltipDelayHide, setTooltipDelayHide] = useState(delayHide)
    const [tooltipFloat, setTooltipFloat] = useState(float)
    const [tooltipHidden, setTooltipHidden] = useState(hidden)
    const [tooltipWrapper, setTooltipWrapper] = useState<WrapperType>(wrapper)
    const [tooltipPositionStrategy, setTooltipPositionStrategy] = useState(positionStrategy)
    const [tooltipClassName, setTooltipClassName] = useState<string | null>(null)
    const [activeAnchor, setActiveAnchor] = useState<HTMLElement | null>(null)
    const styleInjectionRef = useRef(disableStyleInjection)

    const getDataAttributesFromAnchorElement = (elementReference: HTMLElement) => {
      const dataAttributes = elementReference?.getAttributeNames().reduce((acc, name) => {
        if (name.startsWith('data-tooltip-')) {
          const parsedAttribute = name.replace(/^data-tooltip-/, '') as DataAttribute
          acc[parsedAttribute] = elementReference?.getAttribute(name) ?? null
        }
        return acc
      }, {} as Record<DataAttribute, string | null>)

      return dataAttributes
    }

    const applyAllDataAttributesFromAnchorElement = useCallback(
      (dataAttributes: Record<string, string | null>) => {
        const handleDataAttributes: Record<DataAttribute, (value: string | null) => void> = {
          place: (value) => {
            setTooltipPlace((value as PlacesType) ?? place)
          },
          content: (value) => {
            setTooltipContent(value ?? content)
          },
          variant: (value) => {
            setTooltipVariant((value as VariantType) ?? variant)
          },
          offset: (value) => {
            setTooltipOffset(value === null ? offset : Number(value))
          },
          wrapper: (value) => {
            setTooltipWrapper((value as WrapperType) ?? wrapper)
          },
          'position-strategy': (value) => {
            setTooltipPositionStrategy((value as PositionStrategy) ?? positionStrategy)
          },
          'delay-show': (value) => {
            setTooltipDelayShow(value === null ? delayShow : Number(value))
          },
          'delay-hide': (value) => {
            setTooltipDelayHide(value === null ? delayHide : Number(value))
          },
          float: (value) => {
            setTooltipFloat(value === null ? float : value === 'true')
          },
          hidden: (value) => {
            setTooltipHidden(value === null ? hidden : value === 'true')
          },
          'class-name': (value) => {
            setTooltipClassName(value)
          },
        }
        // reset unset data attributes to default values
        // without this, data attributes from the last active anchor will still be used
        Object.values(handleDataAttributes).forEach((handler) => handler(null))
        Object.entries(dataAttributes).forEach(([key, value]) => {
          handleDataAttributes[key as DataAttribute]?.(value)
        })
      },
      [
        content,
        delayHide,
        delayShow,
        float,
        hidden,
        offset,
        place,
        positionStrategy,
        variant,
        wrapper,
      ],
    )

    useEffect(() => {
      setTooltipContent(content)
    }, [content])

    useEffect(() => {
      setTooltipPlace(place)
    }, [place])

    useEffect(() => {
      setTooltipVariant(variant)
    }, [variant])

    useEffect(() => {
      setTooltipOffset(offset)
    }, [offset])

    useEffect(() => {
      setTooltipDelayShow(delayShow)
    }, [delayShow])

    useEffect(() => {
      setTooltipDelayHide(delayHide)
    }, [delayHide])

    useEffect(() => {
      setTooltipFloat(float)
    }, [float])

    useEffect(() => {
      setTooltipHidden(hidden)
    }, [hidden])

    useEffect(() => {
      setTooltipPositionStrategy(positionStrategy)
    }, [positionStrategy])

    useEffect(() => {
      if (styleInjectionRef.current === disableStyleInjection) {
        return
      }
      /* c8 ignore start */
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
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
      const observerCallback: MutationCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
          if (
            !activeAnchor ||
            mutation.type !== 'attributes' ||
            !mutation.attributeName?.startsWith('data-tooltip-')
          ) {
            return
          }
          // make sure to get all set attributes, since all unset attributes are reset
          const dataAttributes = getDataAttributesFromAnchorElement(activeAnchor)
          applyAllDataAttributesFromAnchorElement(dataAttributes)
        })
      }

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(observerCallback)

      // do not check for subtree and childrens, we only want to know attribute changes
      // to stay watching `data-attributes-*` from anchor element
      const observerConfig = { attributes: true, childList: false, subtree: false }

      if (activeAnchor) {
        const dataAttributes = getDataAttributesFromAnchorElement(activeAnchor)
        applyAllDataAttributesFromAnchorElement(dataAttributes)
        // Start observing the target node for configured mutations
        observer.observe(activeAnchor, observerConfig)
      }

      return () => {
        // Remove the observer when the tooltip is destroyed
        observer.disconnect()
      }
    }, [activeAnchor, anchorSelect, applyAllDataAttributesFromAnchorElement])

    useEffect(() => {
      /* c8 ignore start */
      if (process.env.NODE_ENV === 'production') {
        return
      }
      /* c8 ignore end */
      if (style?.border) {
        // eslint-disable-next-line no-console
        console.warn('[react-tooltip] Do not set `style.border`. Use `border` prop instead.')
      }
      if (border && !cssSupports('border', `${border}`)) {
        // eslint-disable-next-line no-console
        console.warn(`[react-tooltip] "${border}" is not a valid \`border\`.`)
      }
      if (style?.opacity) {
        // eslint-disable-next-line no-console
        console.warn('[react-tooltip] Do not set `style.opacity`. Use `opacity` prop instead.')
      }
      if (opacity && !cssSupports('opacity', `${opacity}`)) {
        // eslint-disable-next-line no-console
        console.warn(`[react-tooltip] "${opacity}" is not a valid \`opacity\`.`)
      }
    }, [border, opacity, style?.border, style?.opacity])

    /**
     * content priority: children < render or content < html
     * children should be lower priority so that it can be used as the "default" content
     */
    let renderedContent = children
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    if (render) {
      const actualContent =
        activeAnchor?.getAttribute('data-tooltip-content') || tooltipContent || null
      const rendered = render({ content: actualContent, activeAnchor }) as React.ReactNode
      renderedContent = rendered ? (
        <div ref={contentWrapperRef} className="react-tooltip-content-wrapper">
          {rendered}
        </div>
      ) : null
    } else if (tooltipContent) {
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
      place: tooltipPlace,
      variant: tooltipVariant,
      offset: tooltipOffset,
      wrapper: tooltipWrapper,
      openOnClick,
      positionStrategy: tooltipPositionStrategy,
      middlewares,
      delayShow: tooltipDelayShow,
      delayHide: tooltipDelayHide,
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
      setIsOpen,
      afterShow,
      afterHide,
      activeAnchor,
      setActiveAnchor,
      role,
    }

    return <Tooltip {...props} />
  },
)

export default TooltipController
