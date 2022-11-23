import {
  getDefaultPopupColors,
  DEFAULT_PADDING,
  DEFAULT_RADIUS
} from './defaultStyles';

/**
 * Generates the specific tooltip style for use on render.
 */
export function generateTooltipStyle(
  uuid,
  customColors,
  type,
  hasBorder,
  padding,
  radius
) {
  return generateStyle(
    uuid,
    getPopupColors(customColors, type, hasBorder),
    padding,
    radius
  );
}

/**
 * Generates the tooltip style rules based on the element-specified "data-type" property.
 */
function generateStyle(
  uuid,
  colors,
  padding = DEFAULT_PADDING,
  radius = DEFAULT_RADIUS
) {
  const textColor = colors.text;
  const backgroundColor = colors.background;
  const borderColor = colors.border;
  const arrowColor = colors.arrow;
  const arrowRadius = radius.arrow;
  const tooltipRadius = radius.tooltip;

  return `
  	.${uuid} {
	    color: ${textColor};
	    background: ${backgroundColor};
	    border: 1px solid ${borderColor};
	    border-radius: ${tooltipRadius}px;
	    padding: ${padding};
  	}

  	.${uuid}.place-top {
        margin-top: -10px;
    }
    .${uuid}.place-top::before {
        content: "";
        background-color: inherit;
        position: absolute;
        z-index: 2;
        width: 20px;
        height: 12px;
    }
    .${uuid}.place-top::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        border-top-right-radius: ${arrowRadius}px;
        border: 1px solid ${borderColor};
        background-color: ${arrowColor};
        z-index: -2;
        bottom: -6px;
        left: 50%;
        margin-left: -6px;
        transform: rotate(135deg);
    }

    .${uuid}.place-bottom {
        margin-top: 10px;
    }
    .${uuid}.place-bottom::before {
        content: "";
        background-color: inherit;
        position: absolute;
        z-index: -1;
        width: 18px;
        height: 10px;
    }
    .${uuid}.place-bottom::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        border-top-right-radius: ${arrowRadius}px;
        border: 1px solid ${borderColor};
        background-color: ${arrowColor};
        z-index: -2;
        top: -6px;
        left: 50%;
        margin-left: -6px;
        transform: rotate(45deg);
    }

    .${uuid}.place-left {
        margin-left: -10px;
    }
    .${uuid}.place-left::before {
        content: "";
        background-color: inherit;
        position: absolute;
        z-index: -1;
        width: 10px;
        height: 18px;
    }
    .${uuid}.place-left::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        border-top-right-radius: ${arrowRadius}px;
        border: 1px solid ${borderColor};
        background-color: ${arrowColor};
        z-index: -2;
        right: -6px;
        top: 50%;
        margin-top: -6px;
        transform: rotate(45deg);
    }

    .${uuid}.place-right {
        margin-left: 10px;
    }
    .${uuid}.place-right::before {
        content: "";
        background-color: inherit;
        position: absolute;
        z-index: -1;
        width: 10px;
        height: 18px;
    }
    .${uuid}.place-right::after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        border-top-right-radius: ${arrowRadius}px;
        border: 1px solid ${borderColor};
        background-color: ${arrowColor};
        z-index: -2;
        left: -6px;
        top: 50%;
        margin-top: -6px;
        transform: rotate(-135deg);
    }
  `;
}

function getPopupColors(customColors, type, hasBorder) {
  const textColor = customColors.text;
  const backgroundColor = customColors.background;
  const borderColor = customColors.border;
  const arrowColor = customColors.arrow
    ? customColors.arrow
    : customColors.background;

  const colors = getDefaultPopupColors(type);

  if (textColor) {
    colors.text = textColor;
  }

  if (backgroundColor) {
    colors.background = backgroundColor;
  }

  if (hasBorder) {
    if (borderColor) {
      colors.border = borderColor;
    } else {
      colors.border = type === 'light' ? 'black' : 'white';
    }
  }

  if (arrowColor) {
    colors.arrow = arrowColor;
  }

  return colors;
}
