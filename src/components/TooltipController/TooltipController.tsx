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
  anchorSelect,
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
  closeOnEsc = false,
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
  const [activeAnchor, setActiveAnchor] = useState<HTMLElement | null>(null)
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
          console.warn(`[react-tooltip] "${anchorSelect}" is not a valid CSS selector`)
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

  const props: ITooltip = {
    id,
    anchorId,
    anchorSelect,
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
    closeOnEsc,
    style,
    position,
    isOpen,
    setIsOpen,
    afterShow,
    afterHide,
    activeAnchor,
    setActiveAnchor: (anchor: HTMLElement | null) => setActiveAnchor(anchor),
  }

  return children ? <Tooltip {...props}>{children}</Tooltip> : <Tooltip {...props} />
}

export default TooltipController
