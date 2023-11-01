import React, { useEffect, useRef, useState } from 'react'
import { Tooltip } from 'components/Tooltip'
import type {
  EventsType,
  PositionStrategy,
  PlacesType,
  VariantType,
  WrapperType,
  DataAttribute,
  ITooltip,
  ChildrenType,
  TooltipImperativeProps,
} from 'components/Tooltip/TooltipTypes'
import { useTooltip } from 'components/TooltipProvider'
import { TooltipContent } from 'components/TooltipContent'
import type { ITooltipController } from './TooltipControllerTypes'

const TooltipController = React.forwardRef<TooltipImperativeProps, ITooltipController>(
  (
    {
      id,
      anchorId,
      anchorSelect,
      content,
      html,
      render,
      className,
      classNameArrow,
      variant = 'dark',
      place = 'top',
      offset = 10,
      wrapper = 'div',
      children = null,
      events = ['hover'],
      openOnClick = false,
      positionStrategy = 'absolute',
      middlewares,
      delayShow = 0,
      delayHide = 0,
      float = false,
      hidden = false,
      noArrow = false,
      clickable = false,
      closeOnEsc = false,
      closeOnScroll = false,
      closeOnResize = false,
      openEvents,
      closeEvents,
      globalCloseEvents,
      imperativeModeOnly = false,
      style,
      position,
      isOpen,
      disableStyleInjection = false,
      border,
      opacity,
      arrowColor,
      setIsOpen,
      afterShow,
      afterHide,
    }: ITooltipController,
    ref,
  ) => {
    const [tooltipContent, setTooltipContent] = useState(content)
    const [tooltipHtml, setTooltipHtml] = useState(html)
    const [tooltipPlace, setTooltipPlace] = useState(place)
    const [tooltipVariant, setTooltipVariant] = useState(variant)
    const [tooltipOffset, setTooltipOffset] = useState(offset)
    const [tooltipDelayShow, setTooltipDelayShow] = useState(delayShow)
    const [tooltipDelayHide, setTooltipDelayHide] = useState(delayHide)
    const [tooltipFloat, setTooltipFloat] = useState(float)
    const [tooltipHidden, setTooltipHidden] = useState(hidden)
    const [tooltipWrapper, setTooltipWrapper] = useState<WrapperType>(wrapper)
    const [tooltipEvents, setTooltipEvents] = useState(events)
    const [tooltipPositionStrategy, setTooltipPositionStrategy] = useState(positionStrategy)
    const [activeAnchor, setActiveAnchor] = useState<HTMLElement | null>(null)
    const styleInjectionRef = useRef(disableStyleInjection)
    /**
     * @todo Remove this in a future version (provider/wrapper method is deprecated)
     */
    const { anchorRefs, activeAnchor: providerActiveAnchor } = useTooltip(id)

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

    const applyAllDataAttributesFromAnchorElement = (
      dataAttributes: Record<string, string | null>,
    ) => {
      const handleDataAttributes: Record<DataAttribute, (value: string | null) => void> = {
        place: (value) => {
          setTooltipPlace((value as PlacesType) ?? place)
        },
        content: (value) => {
          setTooltipContent(value ?? content)
        },
        html: (value) => {
          setTooltipHtml(value ?? html)
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
        events: (value) => {
          const parsed = value?.split(' ') as EventsType[]
          setTooltipEvents(parsed ?? events)
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
      }
      // reset unset data attributes to default values
      // without this, data attributes from the last active anchor will still be used
      Object.values(handleDataAttributes).forEach((handler) => handler(null))
      Object.entries(dataAttributes).forEach(([key, value]) => {
        handleDataAttributes[key as DataAttribute]?.(value)
      })
    }

    useEffect(() => {
      setTooltipContent(content)
    }, [content])

    useEffect(() => {
      setTooltipHtml(html)
    }, [html])

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
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[react-tooltip] Do not change `disableStyleInjection` dynamically.')
      }
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
    }, [])

    useEffect(() => {
      const elementRefs = new Set(anchorRefs)

      let selector = anchorSelect
      if (!selector && id) {
        selector = `[data-tooltip-id='${id}']`
      }
      if (selector) {
        try {
          const anchorsBySelect = document.querySelectorAll<HTMLElement>(selector)
          anchorsBySelect.forEach((anchor) => {
            elementRefs.add({ current: anchor })
          })
        } catch {
          if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`[react-tooltip] "${selector}" is not a valid CSS selector`)
          }
        }
      }

      const anchorById = document.querySelector<HTMLElement>(`[id='${anchorId}']`)
      if (anchorById) {
        elementRefs.add({ current: anchorById })
      }

      if (!elementRefs.size) {
        return () => null
      }

      const anchorElement = activeAnchor ?? anchorById ?? providerActiveAnchor.current

      const observerCallback: MutationCallback = (mutationList) => {
        mutationList.forEach((mutation) => {
          if (
            !anchorElement ||
            mutation.type !== 'attributes' ||
            !mutation.attributeName?.startsWith('data-tooltip-')
          ) {
            return
          }
          // make sure to get all set attributes, since all unset attributes are reset
          const dataAttributes = getDataAttributesFromAnchorElement(anchorElement)
          applyAllDataAttributesFromAnchorElement(dataAttributes)
        })
      }

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(observerCallback)

      // do not check for subtree and childrens, we only want to know attribute changes
      // to stay watching `data-attributes-*` from anchor element
      const observerConfig = { attributes: true, childList: false, subtree: false }

      if (anchorElement) {
        const dataAttributes = getDataAttributesFromAnchorElement(anchorElement)
        applyAllDataAttributesFromAnchorElement(dataAttributes)
        // Start observing the target node for configured mutations
        observer.observe(anchorElement, observerConfig)
      }

      return () => {
        // Remove the observer when the tooltip is destroyed
        observer.disconnect()
      }
    }, [anchorRefs, providerActiveAnchor, activeAnchor, anchorId, anchorSelect])

    useEffect(() => {
      if (process.env.NODE_ENV === 'production') {
        return
      }
      if (style?.border) {
        // eslint-disable-next-line no-console
        console.warn('[react-tooltip] Do not set `style.border`. Use `border` prop instead.')
      }
      if (border && !CSS.supports('border', `${border}`)) {
        // eslint-disable-next-line no-console
        console.warn(`[react-tooltip] "${border}" is not a valid \`border\`.`)
      }
      if (style?.opacity) {
        // eslint-disable-next-line no-console
        console.warn('[react-tooltip] Do not set `style.opacity`. Use `opacity` prop instead.')
      }
      if (opacity && !CSS.supports('opacity', `${opacity}`)) {
        // eslint-disable-next-line no-console
        console.warn(`[react-tooltip] "${opacity}" is not a valid \`opacity\`.`)
      }
    }, [])

    /**
     * content priority: children < render or content < html
     * children should be lower priority so that it can be used as the "default" content
     */
    let renderedContent: ChildrenType = children
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    if (render) {
      const rendered = render({ content: tooltipContent ?? null, activeAnchor }) as React.ReactNode
      renderedContent = rendered ? (
        <div ref={contentWrapperRef} className="react-tooltip-content-wrapper">
          {rendered}
        </div>
      ) : null
    } else if (tooltipContent) {
      renderedContent = tooltipContent
    }
    if (tooltipHtml) {
      renderedContent = <TooltipContent content={tooltipHtml} />
    }

    const props: ITooltip = {
      forwardRef: ref,
      id,
      anchorId,
      anchorSelect,
      className,
      classNameArrow,
      content: renderedContent,
      contentWrapperRef,
      place: tooltipPlace,
      variant: tooltipVariant,
      offset: tooltipOffset,
      wrapper: tooltipWrapper,
      events: tooltipEvents,
      openOnClick,
      positionStrategy: tooltipPositionStrategy,
      middlewares,
      delayShow: tooltipDelayShow,
      delayHide: tooltipDelayHide,
      float: tooltipFloat,
      hidden: tooltipHidden,
      noArrow,
      clickable,
      closeOnEsc,
      closeOnScroll,
      closeOnResize,
      openEvents,
      closeEvents,
      globalCloseEvents,
      imperativeModeOnly,
      style,
      position,
      isOpen,
      border,
      opacity,
      arrowColor,
      setIsOpen,
      afterShow,
      afterHide,
      activeAnchor,
      setActiveAnchor: (anchor: HTMLElement | null) => setActiveAnchor(anchor),
    }

    return <Tooltip {...props} />
  },
)

export default TooltipController
