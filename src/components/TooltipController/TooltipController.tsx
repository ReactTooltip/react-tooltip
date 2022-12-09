import { useEffect, useState } from 'react'
import { Tooltip } from 'components/Tooltip'
import type {
  EventsType,
  PositionStrategy,
  PlacesType,
  VariantType,
  WrapperType,
  DataAttribute,
} from 'components/Tooltip/TooltipTypes'
import { useTooltip } from 'components/TooltipProvider'
import type { ITooltipController } from './TooltipControllerTypes'

const TooltipController = ({
  id,
  anchorId,
  content,
  html,
  className,
  classNameArrow,
  variant = 'dark',
  place = 'top',
  offset = 10,
  wrapper = 'div',
  children = null,
  events = ['hover'],
  positionStrategy = 'absolute',
  delayShow = 0,
  delayHide = 0,
  style,
  isOpen,
  setIsOpen,
}: ITooltipController) => {
  const [tooltipContent, setTooltipContent] = useState(content || html)
  const [tooltipPlace, setTooltipPlace] = useState(place)
  const [tooltipVariant, setTooltipVariant] = useState(variant)
  const [tooltipOffset, setTooltipOffset] = useState(offset)
  const [tooltipDelayShow, setTooltipDelayShow] = useState(delayShow)
  const [tooltipDelayHide, setTooltipDelayHide] = useState(delayHide)
  const [tooltipWrapper, setTooltipWrapper] = useState<WrapperType>(wrapper)
  const [tooltipEvents, setTooltipEvents] = useState(events)
  const [tooltipPositionStrategy, setTooltipPositionStrategy] = useState(positionStrategy)
  const [isHtmlContent, setIsHtmlContent] = useState(Boolean(html))
  const { anchorRefs, activeAnchor } = useTooltip()

  const getDataAttributesFromAnchorElement = (elementReference: HTMLElement) => {
    const dataAttributes = elementReference?.getAttributeNames().reduce((acc, name) => {
      if (name.startsWith('data-tooltip-')) {
        acc[name] = elementReference?.getAttribute(name) ?? null
      }
      return acc
    }, {} as Record<string, string | null>)

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
        setIsHtmlContent(false)
        setTooltipContent(value ?? '')
      },
      html: (value) => {
        setIsHtmlContent(true)
        setTooltipContent(value ?? '')
      },
      variant: (value) => {
        setTooltipVariant((value as VariantType) ?? variant)
      },
      offset: (value) => {
        setTooltipOffset(Number(value) ?? offset)
      },
      wrapper: (value) => {
        setTooltipWrapper((value as WrapperType) ?? wrapper)
      },
      events: (value) => {
        const parsedEvents = value?.split(' ')
        setTooltipEvents((parsedEvents as EventsType[]) ?? events)
      },
      'position-strategy': (value) => {
        setTooltipPositionStrategy((value as PositionStrategy) ?? positionStrategy)
      },
      'delay-show': (value) => {
        setTooltipDelayShow(Number(value) ?? delayShow)
      },
      'delay-hide': (value) => {
        setTooltipDelayHide(Number(value) ?? delayHide)
      },
    }
    Object.entries(dataAttributes).forEach(([key, value]) => {
      const formattedKey = key.replace(/^data-tooltip-/, '') as DataAttribute
      handleDataAttributes[formattedKey]?.(value)
    })
  }

  const getElementSpecificAttributeKeyAndValueParsed = ({
    element,
    attributeName,
  }: {
    element: HTMLElement
    attributeName: string
  }) => {
    return { [attributeName]: element.getAttribute(attributeName) }
  }

  useEffect(() => {
    if (content) {
      setTooltipContent(content)
    }
    if (html) {
      setTooltipContent(html)
    }
  }, [content, html])

  useEffect(() => {
    const elementRefs = new Set(anchorRefs)

    const anchorById = document.querySelector(`[id='${anchorId}']`) as HTMLElement
    if (anchorById) {
      elementRefs.add({ current: anchorById })
    }

    if (!elementRefs.size) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }

    // do not check for subtree and childrens, we only want to know attribute changes
    // to stay watching `data-attributes` from anchor element
    const observerConfig = { attributes: true, childList: false, subtree: false }

    const observerCallback: MutationCallback = (mutationList) => {
      mutationList.forEach((mutation) => {
        if (!activeAnchor.current) {
          return
        }
        if (mutation.type !== 'attributes' || !mutation.attributeName) {
          return
        }
        const attributeKeyAndValue = getElementSpecificAttributeKeyAndValueParsed({
          element: activeAnchor.current,
          attributeName: mutation.attributeName,
        })
        applyAllDataAttributesFromAnchorElement(attributeKeyAndValue)
      })
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(observerCallback)

    elementRefs.forEach((ref) => {
      if (!ref.current) {
        return
      }
      // Start observing the target nodes for configured mutations
      observer.observe(ref.current, observerConfig)
    })

    if (anchorById) {
      const dataAttributes = getDataAttributesFromAnchorElement(anchorById)
      applyAllDataAttributesFromAnchorElement(dataAttributes)
    }

    return () => {
      // Remove the observer when the tooltip is destroyed
      observer.disconnect()
    }
  }, [anchorRefs, activeAnchor, anchorId])

  useEffect(() => {
    if (!activeAnchor.current) {
      return
    }
    const dataAttributes = getDataAttributesFromAnchorElement(activeAnchor.current)
    applyAllDataAttributesFromAnchorElement(dataAttributes)
  }, [activeAnchor])

  const props = {
    id,
    anchorId,
    className,
    classNameArrow,
    content: tooltipContent,
    isHtmlContent,
    place: tooltipPlace,
    variant: tooltipVariant,
    offset: tooltipOffset,
    wrapper: tooltipWrapper,
    events: tooltipEvents,
    positionStrategy: tooltipPositionStrategy,
    delayShow: tooltipDelayShow,
    delayHide: tooltipDelayHide,
    style,
    isOpen,
    setIsOpen,
  }

  return children ? <Tooltip {...props}>{children}</Tooltip> : <Tooltip {...props} />
}

export default TooltipController
