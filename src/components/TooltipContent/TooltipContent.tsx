/* eslint-disable react/no-danger */
import type { ITooltipContent } from './TooltipContentTypes'

const TooltipContent = ({ content }: ITooltipContent) => {
  return <span dangerouslySetInnerHTML={{ __html: content }} />
}

export default TooltipContent
