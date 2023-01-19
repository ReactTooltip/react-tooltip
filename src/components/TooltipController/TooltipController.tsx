import { useEffect, useState } from 'react'
import { Tooltip } from 'components/Tooltip'
import type {
  EventsType,
  PositionStrategy,
  PlacesType,
  VariantType,
  WrapperType,
  DataAttribute,
  ITooltip,
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
  middlewares,
  delayShow = 0,
  delayHide = 0,
  float = false,
  noArrow = false,
  clickable = false,
  style,
  position,
  isOpen,
  setIsOpen,
  afterShow,
  afterHide,
}: ITooltipController) => {
  const [tooltipContent, setTooltipContent] = useState(content)
  const [tooltipHtml, setTooltipHtml] = useState(html)
  const [tooltipPlace, setTooltipPlace] = useState(place)
  const [tooltipVariant, setTooltipVariant] = useState(variant)
  const [tooltipOffset, setTooltipOffset] = useState(offset)
  const [tooltipDelayShow, setTooltipDelayShow] = useState(delayShow)
  const [tooltipDelayHide, setTooltipDelayHide] = useState(delayHide)
  const [tooltipFloat, setTooltipFloat] = useState(float)
  const [tooltipWrapper, setTooltipWrapper] = useState<WrapperType>(wrapper)
  const [tooltipEvents, setTooltipEvents] = useState(events)
  const [tooltipPositionStrategy, setTooltipPositionStrategy] = useState(positionStrategy)
  const { anchorRefs, activeAnchor } = useTooltip(id)

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
        setTooltipWrapper((value as WrapperType) ?? 'div')
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
        setTooltipFloat(value === null ? float : Boolean(value))
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
    const elementRefs = new Set(anchorRefs)

    const anchorById = document.querySelector(`[id='${anchorId}']`) as HTMLElement
    if (anchorById) {
      elementRefs.add({ current: anchorById })
    }

    if (!elementRefs.size) {
      return () => null
    }

    const anchorElement = activeAnchor.current ?? anchorById

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
  }, [anchorRefs, activeAnchor, anchorId])

  const props: ITooltip = {
    id,
    anchorId,
    className,
    classNameArrow,
    content: tooltipContent,
    html: tooltipHtml,
    place: tooltipPlace,
    variant: tooltipVariant,
    offset: tooltipOffset,
    wrapper: tooltipWrapper,
    events: tooltipEvents,
    positionStrategy: tooltipPositionStrategy,
    middlewares,
    delayShow: tooltipDelayShow,
    delayHide: tooltipDelayHide,
    float: tooltipFloat,
    noArrow,
    clickable,
    style,
    position,
    isOpen,
    setIsOpen,
    afterShow,
    afterHide,
  }

  return children ? <Tooltip {...props}>{children}</Tooltip> : <Tooltip {...props} />
}

export default TooltipController
