import React from 'react';
import { DEFAULT_RADIUS } from '../src/decorators/defaultStyles.js';
import ReactTooltip from '../src/index.js';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
const forEach = require('mocha-each');
const jsdom = require('mocha-jsdom');

afterEach(() => {
  cleanup();
});

describe('Tooltip', () => {
  jsdom({ url: 'http://localhost/' });

  forEach([
    [
      {
        textColor: 'green',
        backgroundColor: 'red',
        arrowColor: 'blue',
        arrowRadius: '2',
        tooltipRadius: '4'
      },
      {
        popupType: 'type-custom',
        textColor: 'green',
        background: 'red',
        arrowColor: 'blue',
        arrowRadius: '2',
        tooltipRadius: '4'
      }
    ],
    [
      {
        textColor: 'green',
        backgroundColor: 'red',
        arrowColor: 'blue',
        borderColor: 'teal',
        arrowRadius: '2'
      },
      {
        popupType: 'type-custom',
        textColor: 'green',
        background: 'red',
        arrowColor: 'blue',
        borderColor: 'transparent',
        arrowRadius: '2'
      }
    ],
    [
      {
        textColor: 'green',
        backgroundColor: 'red',
        arrowColor: 'blue',
        border: true,
        borderColor: 'teal',
        arrowRadius: '2',
        tooltipRadius: '4'
      },
      {
        popupType: 'type-custom',
        textColor: 'green',
        background: 'red',
        arrowColor: 'blue',
        borderColor: 'teal',
        arrowRadius: '2',
        tooltipRadius: '4'
      }
    ],
    [
      {
        textColor: 'green',
        backgroundColor: 'red',
        arrowColor: 'blue',
        border: false,
        borderColor: 'teal',
        arrowRadius: '2',
        tooltipRadius: '4'
      },
      {
        popupType: 'type-custom',
        textColor: 'green',
        background: 'red',
        arrowColor: 'blue',
        arrowRadius: '2',
        tooltipRadius: '4'
      }
    ],
    [
      { textColor: 'teal', backgroundColor: 'orange' },
      { popupType: 'type-custom', textColor: 'teal', background: 'orange' }
    ],
    [
      { textColor: 'green', arrowColor: 'red' },
      {
        popupType: 'type-custom',
        textColor: 'green',
        background: '#222',
        arrowColor: 'red'
      }
    ],
    [
      { backgroundColor: 'green', arrowColor: 'yellow' },
      {
        popupType: 'type-custom',
        textColor: '#fff',
        background: 'green',
        arrowColor: 'yellow'
      }
    ],
    [
      { textColor: 'red' },
      { popupType: 'type-custom', textColor: 'red', background: '#222' }
    ],
    [
      { textColor: 'red', borderColor: 'pink' },
      { popupType: 'type-custom', textColor: 'red', background: '#222' }
    ],
    [
      { textColor: 'red', border: true, borderColor: 'pink' },
      {
        popupType: 'type-custom',
        textColor: 'red',
        background: '#222',
        borderColor: 'pink'
      }
    ],
    [
      { backgroundColor: 'red' },
      { popupType: 'type-custom', textColor: '#fff', background: 'red' }
    ],
    [
      { backgroundColor: 'red', borderColor: 'yellow' },
      { popupType: 'type-custom', textColor: '#fff', background: 'red' }
    ],
    [
      { backgroundColor: 'red', border: true, borderColor: 'yellow' },
      {
        popupType: 'type-custom',
        textColor: '#fff',
        background: 'red',
        borderColor: 'yellow'
      }
    ],
    [
      { arrowColor: 'red' },
      {
        popupType: 'type-custom',
        textColor: '#fff',
        background: '#222',
        arrowColor: 'red'
      }
    ],
    [
      { arrowColor: 'red', borderColor: 'green' },
      {
        popupType: 'type-custom',
        textColor: '#fff',
        background: '#222',
        arrowColor: 'red'
      }
    ],
    [
      { arrowColor: 'red', border: true, borderColor: 'green' },
      {
        popupType: 'type-custom',
        textColor: '#fff',
        background: '#222',
        arrowColor: 'red',
        borderColor: 'green'
      }
    ],
    [
      { borderColor: 'blue' },
      {
        popupType: 'type-dark',
        textColor: '#fff',
        background: '#222',
        arrowColor: '#222'
      }
    ],
    [
      {
        border: true,
        borderColor: 'blue',
        arrowRadius: '2',
        tooltipRadius: '4'
      },
      {
        popupType: 'type-custom',
        textColor: '#fff',
        background: '#222',
        arrowColor: '#222',
        arrowRadius: '2',
        tooltipRadius: '4',
        borderColor: 'blue'
      }
    ],
    [
      {
        border: true,
        borderClass: 'custom-border-class',
        borderColor: '#414141'
      },
      {
        borderColor: '#414141',
        borderClass: 'custom-border-class',
        popupType: 'type-custom',
        textColor: '#fff',
        background: '#222',
        arrowColor: '#222'
      }
    ]
  ]).it('Popup color generation - show', (props, res) => {
    render(
      <span id="colorSpecInvoker" data-tip data-for="colorSpec">
        Invoker
      </span>
    );
    render(<ReactTooltip id="colorSpec" {...props} />);
    fireEvent(
      document.getElementById('colorSpecInvoker'),
      new window.Event('mouseenter')
    );

    const tooltip = document.getElementById('colorSpec');

    const expectedBorderClass = res.borderClass || 'border';

    expect(tooltip.className).to.match(
      new RegExp(
        '__react_component_tooltip [a-zA-Z0-9-]+ show' +
          (props.border ? ` ${expectedBorderClass} ` : ' ') +
          'place-top ' +
          res.popupType,
        'i'
      )
    );

    const uuid = tooltip.className.split(' ')[1];
    const cssRules = tooltip.firstElementChild.sheet.cssRules;
    const mainCssRule = cssRules.find(
      (rule) => rule.selectorText === `.${uuid}`
    ).style;

    expect(mainCssRule.color, 'Text color').to.equal(res.textColor);
    expect(mainCssRule.background, 'Background color').to.equal(res.background);
    expect(mainCssRule.border, 'Border color').to.equal(
      '1px solid ' + (res.borderColor ? res.borderColor : 'transparent')
    );
    expect(mainCssRule['border-radius'], 'Tooltip radius').to.equal(
      `${res.tooltipRadius || DEFAULT_RADIUS.tooltip}px`
    );

    const arrowPositions = ['top', 'bottom', 'left', 'right'];
    const pseudoRule = (pos, pseudo) =>
      cssRules.find(
        (rule) => rule.selectorText === `.${uuid}.place-${pos}::${pseudo}`
      );
    arrowPositions.forEach((pos) => {
      const after = pseudoRule(pos, 'after').style;
      expect(after['background-color']).to.equal(
        res.arrowColor ? res.arrowColor : res.background
      );
      expect(after['border-top-right-radius']).to.equal(
        `${res.arrowRadius || DEFAULT_RADIUS.arrow}px`
      );

      const before = pseudoRule(pos, 'before').style;
      expect(before['background-color']).to.equal('inherit');
    });
  });
});
