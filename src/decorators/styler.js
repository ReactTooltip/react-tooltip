import { getDefaultPopupColors } from './defaultStyles';

/**
 * Generates the specific tooltip style for use on render.
 */
export function generateTooltipStyle(uuid, customColors, type, hasBorder) {
  return generateStyle(uuid, getPopupColors(customColors, type, hasBorder));
}

/**
 * Generates the tooltip style rules based on the element-specified "data-type" property.
 */
function generateStyle(uuid, colors) {
  const textColor = colors.text;
  const backgroundColor = colors.background;
  const borderColor = colors.border;
  const arrowColor = colors.arrow;

  return `
  	.${uuid} {
	    color: ${textColor};
	    background: ${backgroundColor};
	    border: 1px solid ${borderColor};
  	}

  	.${uuid}.place-top {
        margin-top: -10px;
    }
    .${uuid}.place-top::before {
        border-top: 8px solid ${borderColor};
    }
    .${uuid}.place-top::after {
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        bottom: -6px;
        left: 50%;
        margin-left: -8px;
        border-top-color: ${arrowColor};
        border-top-style: solid;
        border-top-width: 6px;
    }

    .${uuid}.place-bottom {
        margin-top: 10px;
    }
    .${uuid}.place-bottom::before {
        border-bottom: 8px solid ${borderColor};
    }
    .${uuid}.place-bottom::after {
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        top: -6px;
        left: 50%;
        margin-left: -8px;
        border-bottom-color: ${arrowColor};
        border-bottom-style: solid;
        border-bottom-width: 6px;
    }

    .${uuid}.place-left {
        margin-left: -10px;
    }
    .${uuid}.place-left::before {
        border-left: 8px solid ${borderColor};
    }
    .${uuid}.place-left::after {
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        right: -6px;
        top: 50%;
        margin-top: -4px;
        border-left-color: ${arrowColor};
        border-left-style: solid;
        border-left-width: 6px;
    }

    .${uuid}.place-right {
        margin-left: 10px;
    }
    .${uuid}.place-right::before {
        border-right: 8px solid ${borderColor};
    }
    .${uuid}.place-right::after {
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        left: -6px;
        top: 50%;
        margin-top: -4px;
        border-right-color: ${arrowColor};
        border-right-style: solid;
        border-right-width: 6px;
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
