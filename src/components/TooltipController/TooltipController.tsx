import { useEffect, useState } from 'react'
import { Tooltip } from 'components/Tooltip'
import type { PlacesType, VariantType, WrapperType } from 'components/Tooltip/TooltipTypes'
import { dataAttributesKeys } from './constants'
import type { ITooltipController } from './TooltipControllerTypes'

const TooltipController = ({
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
}: ITooltipController) => {
  const [tooltipContent, setTooltipContent] = useState(content || html)
  const [tooltipPlace, setTooltipPlace] = useState(place)
  const [tooltipVariant, setTooltipVariant] = useState(variant)
  const [tooltipOffset, setTooltipOffset] = useState(offset)
  const [tooltipWrapper, setTooltipWrapper] = useState<WrapperType>(wrapper)
  const [isHtmlContent, setIsHtmlContent] = useState<boolean>(Boolean(html))

  const getDataAttributesFromAnchorElement = (elementReference: HTMLElement) => {
    const dataAttributes = elementReference?.getAttributeNames().reduce((acc, name) => {
      if (name.includes('data-')) {
        ;(acc as any)[name] = elementReference?.getAttribute(name)
      }

      return acc
    }, {})

    return dataAttributes
  }

  const applyAllDataAttributesFromAnchorElement = (dataAttributes: {
    [key: string]: string | number | boolean
  }) => {
    const keys = Object.keys(dataAttributes)
    let formatedKey = null

    const handleDataAttributes = {
      place: (value: PlacesType) => {
        setTooltipPlace(value)
      },
      content: (value: string) => {
        setIsHtmlContent(true)
        setTooltipContent(value)
      },
      html: (value: string) => {
        setIsHtmlContent(true)
        setTooltipContent(value)
      },
      variant: (value: VariantType) => {
        setTooltipVariant(value)
      },
      offset: (value: number) => {
        setTooltipOffset(value)
      },
      wrapper: (value: WrapperType) => {
        setTooltipWrapper(value)
      },
    }

    keys.forEach((key) => {
      formatedKey = key.replace('data-', '')

      if (dataAttributesKeys.includes(formatedKey)) {
        // @ts-ignore
        handleDataAttributes[formatedKey](dataAttributes[key])
      }
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
    const elementReference = document.querySelector(`#${anchorId}`)

    if (!elementReference) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }

    const observerConfig = { attributes: true, childList: false, subtree: false }

    const observerCallback = (mutationList: any) => {
      mutationList.forEach((mutation: any) => {
        if (mutation.type === 'attributes') {
          const attributeKeyAndValue = getElementSpecificAttributeKeyAndValueParsed({
            element: elementReference as HTMLElement,
            attributeName: mutation.attributeName,
          })

          applyAllDataAttributesFromAnchorElement(
            attributeKeyAndValue as { [key: string]: string | number | boolean },
          )
        }
      })
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(observerCallback)

    // Start observing the target node for configured mutations
    observer.observe(elementReference, observerConfig)

    const dataAttributes = getDataAttributesFromAnchorElement(elementReference as HTMLElement)

    applyAllDataAttributesFromAnchorElement(dataAttributes)

    return () => {
      // Later, you can stop observing
      observer.disconnect()
    }
  }, [anchorId])

  return children ? (
    <Tooltip
      anchorId={anchorId}
      className={className}
      classNameArrow={classNameArrow}
      content={tooltipContent}
      isHtmlContent={isHtmlContent}
      place={tooltipPlace}
      variant={tooltipVariant}
      offset={tooltipOffset}
      wrapper={tooltipWrapper}
    >
      {children}
    </Tooltip>
  ) : (
    <Tooltip
      anchorId={anchorId}
      className={className}
      classNameArrow={classNameArrow}
      content={tooltipContent}
      isHtmlContent={isHtmlContent}
      place={tooltipPlace}
      variant={tooltipVariant}
      offset={tooltipOffset}
      wrapper={tooltipWrapper}
    />
  )
}

export default TooltipController
