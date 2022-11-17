import { useEffect, useState } from 'react'
import { Tooltip } from 'components/Tooltip'
import { dataAttributesKeys } from './constants'
import type { ITooltipController } from './TooltipControllerTypes'

const TooltipController = ({
  anchorId,
  content,
  html,
  className,
  classNameArrow,
  variant,
  place,
  offset,
  ...rest
}: ITooltipController) => {
  const [tooltipContent, setTooltipContent] = useState(content || html)
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

  const applyDataAttributesFromAnchorElement = (dataAttributes: any) => {
    const keys = Object.keys(dataAttributes)
    let formatedKey = null

    const handleDataAttributes = {
      place: 'lorem',
      content: 'lorem',
      html: () => {
        setIsHtmlContent(true)
        setTooltipContent('html content')
      },
      variant: 'lorem',
    }

    keys.forEach((key) => {
      formatedKey = key.replace('data-', '')

      if (dataAttributesKeys.includes(formatedKey)) {
        // handleDataAttributes[key]
        console.log(handleDataAttributes[formatedKey])
      }
    })
  }

  useEffect(() => {
    const elementReference = document.querySelector(`#${anchorId}`)

    if (!elementReference) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return
    }

    const dataAttrContent = elementReference?.getAttribute('data-content')

    const dataAttributes = getDataAttributesFromAnchorElement(elementReference as HTMLElement)

    applyDataAttributesFromAnchorElement(dataAttributes)

    console.log(dataAttributes, dataAttributesKeys)

    if (!content && !html && dataAttrContent) {
      setTooltipContent(dataAttrContent)
    }
  }, [anchorId])

  return <Tooltip anchorId={anchorId} content={tooltipContent} isHtmlContent={isHtmlContent} />
}

export default TooltipController
