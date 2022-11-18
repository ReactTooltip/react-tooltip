import { useEffect, useState } from 'react'
import { Tooltip } from 'components/Tooltip'
import type { PlacesType, VariantType } from 'components/Tooltip/TooltipTypes'
import { dataAttributesKeys } from './constants'
import type { ITooltipController } from './TooltipControllerTypes'

const TooltipController = ({
  anchorId,
  content,
  html,
  className,
  classNameArrow,
  variant,
  place = 'top',
  offset,
}: ITooltipController) => {
  const [tooltipContent, setTooltipContent] = useState(content || html)
  const [tooltipPlace, setTooltipPlace] = useState(place)
  const [tooltipVariant, setTooltipVariant] = useState(variant)
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
        if (tooltipPlace !== value) {
          setTooltipPlace(value)
        }
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
        if (tooltipVariant !== value) {
          setTooltipVariant(value)
        }
      },
    }

    keys.forEach((key) => {
      formatedKey = key.replace('data-', '')

      if (dataAttributesKeys.includes(formatedKey)) {
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

    const observerCallback = (mutationList, observer) => {
      console.log(mutationList)
      mutationList.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attributeKeyAndValue = getElementSpecificAttributeKeyAndValueParsed({
            element: elementReference as HTMLElement,
            attributeName: mutation.attributeName,
          })

          applyAllDataAttributesFromAnchorElement(attributeKeyAndValue)
        }
      })
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(observerCallback)

    // Start observing the target node for configured mutations
    observer.observe(elementReference, observerConfig)

    const dataAttributes = getDataAttributesFromAnchorElement(elementReference as HTMLElement)

    applyAllDataAttributesFromAnchorElement(dataAttributes)

    console.log(dataAttributes, dataAttributesKeys)

    return () => {
      // Later, you can stop observing
      observer.disconnect()
    }
  }, [anchorId])

  return (
    <Tooltip
      anchorId={anchorId}
      content={tooltipContent}
      isHtmlContent={isHtmlContent}
      place={tooltipPlace}
    />
  )
}

export default TooltipController
