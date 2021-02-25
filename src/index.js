/* eslint-disable no-unused-vars, dot-notation */
import React from 'react';
import PropTypes from 'prop-types';

/* Decorators */
import staticMethods from './decorators/staticMethods';
import windowListener from './decorators/windowListener';
import customEvent from './decorators/customEvent';
import isCapture from './decorators/isCapture';
import getEffect from './decorators/getEffect';
import bodyMode from './decorators/bodyMode';
import trackRemoval from './decorators/trackRemoval';

/* Utils */
import getPosition from './utils/getPosition';
import getTipContent from './utils/getTipContent';
import { parseAria } from './utils/aria';
import nodeListToArray from './utils/nodeListToArray';
import { generateUUID } from './utils/uuid';

/* CSS */
import baseCss from './index.scss';
import { generateTooltipStyle } from './decorators/styler';

@staticMethods
@windowListener
@customEvent
@isCapture
@getEffect
@bodyMode
@trackRemoval
class ReactTooltip extends React.Component {
  static get propTypes() {
    return {
      uuid: PropTypes.string,
      children: PropTypes.any,
      place: PropTypes.string,
      type: PropTypes.string,
      effect: PropTypes.string,
      offset: PropTypes.object,
      multiline: PropTypes.bool,
      border: PropTypes.bool,
      textColor: PropTypes.string,
      backgroundColor: PropTypes.string,
      borderColor: PropTypes.string,
      arrowColor: PropTypes.string,
      insecure: PropTypes.bool,
      class: PropTypes.string,
      className: PropTypes.string,
      id: PropTypes.string,
      html: PropTypes.bool,
      delayHide: PropTypes.number,
      delayUpdate: PropTypes.number,
      delayShow: PropTypes.number,
      event: PropTypes.string,
      eventOff: PropTypes.string,
      isCapture: PropTypes.bool,
      globalEventOff: PropTypes.string,
      getContent: PropTypes.any,
      afterShow: PropTypes.func,
      afterHide: PropTypes.func,
      overridePosition: PropTypes.func,
      disable: PropTypes.bool,
      scrollHide: PropTypes.bool,
      resizeHide: PropTypes.bool,
      wrapper: PropTypes.string,
      bodyMode: PropTypes.bool,
      possibleCustomEvents: PropTypes.string,
      possibleCustomEventsOff: PropTypes.string,
      clickable: PropTypes.bool
    };
  }

  static defaultProps = {
    insecure: true,
    resizeHide: true,
    wrapper: 'div',
    clickable: false
  };

  static supportedWrappers = ['div', 'span'];

  static displayName = 'ReactTooltip';

  constructor(props) {
    super(props);

    this.state = {
      uuid: props.uuid || generateUUID(),
      place: props.place || 'top', // Direction of tooltip
      desiredPlace: props.place || 'top',
      type: 'dark', // Color theme of tooltip
      effect: 'float', // float or fixed
      show: false,
      border: false,
      customColors: {},
      offset: {},
      extraClass: '',
      html: false,
      delayHide: 0,
      delayShow: 0,
      event: props.event || null,
      eventOff: props.eventOff || null,
      currentEvent: null, // Current mouse event
      currentTarget: null, // Current target of mouse event
      ariaProps: parseAria(props), // aria- and role attributes
      isEmptyTip: false,
      disable: false,
      possibleCustomEvents: props.possibleCustomEvents || '',
      possibleCustomEventsOff: props.possibleCustomEventsOff || '',
      originTooltip: null,
      isMultiline: false
    };

    this.bind([
      'showTooltip',
      'updateTooltip',
      'hideTooltip',
      'hideTooltipOnScroll',
      'getTooltipContent',
      'globalRebuild',
      'globalShow',
      'globalHide',
      'onWindowResize',
      'mouseOnToolTip'
    ]);

    this.mount = true;
    this.delayShowLoop = null;
    this.delayHideLoop = null;
    this.delayReshow = null;
    this.intervalUpdateContent = null;
  }

  /**
   * For unify the bind and unbind listener
   */
  bind(methodArray) {
    methodArray.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    const { insecure, resizeHide } = this.props;

    this.bindListener(); // Bind listener for tooltip
    this.bindWindowEvents(resizeHide); // Bind global event for static method
    this.injectStyles(); // Inject styles for each DOM root having tooltip.
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { ariaProps } = prevState;
    const newAriaProps = parseAria(nextProps);
    const isChanged = Object.keys(newAriaProps).some(props => {
      return newAriaProps[props] !== ariaProps[props];
    });
    if (!isChanged) {
      return null;
    }
    return {
      ...prevState,
      ariaProps: newAriaProps
    };
  }

  componentWillUnmount() {
    this.mount = false;

    this.clearTimer();

    this.unbindListener();
    this.removeScrollListener(this.state.currentTarget);
    this.unbindWindowEvents();
  }

  /* Look for the closest DOM root having tooltip and inject styles. */
  injectStyles() {
    const { tooltipRef } = this;
    if (!tooltipRef) {
      return;
    }

    let parentNode = tooltipRef.parentNode;
    while (parentNode.parentNode) {
      parentNode = parentNode.parentNode;
    }

    let domRoot;

    switch (parentNode.constructor.name) {
      case 'HTMLDocument':
        domRoot = parentNode.head;
        break;
      case 'ShadowRoot':
      default:
        domRoot = parentNode;
        break;
    }

    // Prevent styles duplication.
    if (!domRoot.querySelector('style[data-react-tooltip]')) {
      const style = document.createElement('style');
      style.textContent = baseCss;
      style.setAttribute('data-react-tooltip', 'true');

      domRoot.appendChild(style);
    }
  }

  /**
   * Return if the mouse is on the tooltip.
   * @returns {boolean} true - mouse is on the tooltip
   */
  mouseOnToolTip() {
    const { show } = this.state;

    if (show && this.tooltipRef) {
      /* old IE or Firefox work around */
      if (!this.tooltipRef.matches) {
        /* old IE work around */
        if (this.tooltipRef.msMatchesSelector) {
          this.tooltipRef.matches = this.tooltipRef.msMatchesSelector;
        } else {
          /* old Firefox work around */
          this.tooltipRef.matches = this.tooltipRef.mozMatchesSelector;
        }
      }
      return this.tooltipRef.matches(':hover');
    }
    return false;
  }

  /**
   * Pick out corresponded target elements
   */
  getTargetArray(id) {
    let targetArray = [];
    let selector;
    if (!id) {
      selector = '[data-tip]:not([data-for])';
    } else {
      const escaped = id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      selector = `[data-tip][data-for="${escaped}"]`;
    }

    // Scan document for shadow DOM elements
    nodeListToArray(document.getElementsByTagName('*'))
      .filter(element => element.shadowRoot)
      .forEach(element => {
        targetArray = targetArray.concat(
          nodeListToArray(element.shadowRoot.querySelectorAll(selector))
        );
      });
    return targetArray.concat(
      nodeListToArray(document.querySelectorAll(selector))
    );
  }

  /**
   * Bind listener to the target elements
   * These listeners used to trigger showing or hiding the tooltip
   */
  bindListener() {
    const { id, globalEventOff, isCapture } = this.props;
    const targetArray = this.getTargetArray(id);

    targetArray.forEach(target => {
      if (target.getAttribute('currentItem') === null) {
        target.setAttribute('currentItem', 'false');
      }
      this.unbindBasicListener(target);
      if (this.isCustomEvent(target)) {
        this.customUnbindListener(target);
      }
    });

    if (this.isBodyMode()) {
      this.bindBodyListener(targetArray);
    } else {
      targetArray.forEach(target => {
        const isCaptureMode = this.isCapture(target);
        const effect = this.getEffect(target);
        if (this.isCustomEvent(target)) {
          this.customBindListener(target);
          return;
        }

        target.addEventListener('mouseenter', this.showTooltip, isCaptureMode);
        if (effect === 'float') {
          target.addEventListener(
            'mousemove',
            this.updateTooltip,
            isCaptureMode
          );
        }
        target.addEventListener('mouseleave', this.hideTooltip, isCaptureMode);
      });
    }

    // Global event to hide tooltip
    if (globalEventOff) {
      window.removeEventListener(globalEventOff, this.hideTooltip);
      window.addEventListener(globalEventOff, this.hideTooltip, isCapture);
    }

    // Track removal of targetArray elements from DOM
    this.bindRemovalTracker();
  }

  /**
   * Unbind listeners on target elements
   */
  unbindListener() {
    const { id, globalEventOff } = this.props;
    if (this.isBodyMode()) {
      this.unbindBodyListener();
    } else {
      const targetArray = this.getTargetArray(id);
      targetArray.forEach(target => {
        this.unbindBasicListener(target);
        if (this.isCustomEvent(target)) this.customUnbindListener(target);
      });
    }

    if (globalEventOff)
      window.removeEventListener(globalEventOff, this.hideTooltip);
    this.unbindRemovalTracker();
  }

  /**
   * Invoke this before bind listener and unmount the component
   * it is necessary to invoke this even when binding custom event
   * so that the tooltip can switch between custom and default listener
   */
  unbindBasicListener(target) {
    const isCaptureMode = this.isCapture(target);
    target.removeEventListener('mouseenter', this.showTooltip, isCaptureMode);
    target.removeEventListener('mousemove', this.updateTooltip, isCaptureMode);
    target.removeEventListener('mouseleave', this.hideTooltip, isCaptureMode);
  }

  getTooltipContent() {
    const { getContent, children } = this.props;

    // Generate tooltip content
    let content;
    if (getContent) {
      if (Array.isArray(getContent)) {
        content = getContent[0] && getContent[0](this.state.originTooltip);
      } else {
        content = getContent(this.state.originTooltip);
      }
    }

    return getTipContent(
      this.state.originTooltip,
      children,
      content,
      this.state.isMultiline
    );
  }

  isEmptyTip(placeholder) {
    return (
      (typeof placeholder === 'string' && placeholder === '') ||
      placeholder === null
    );
  }

  /**
   * When mouse enter, show the tooltip
   */
  showTooltip(e, isGlobalCall) {
    if (!this.tooltipRef) {
      return;
    }

    if (isGlobalCall) {
      // Don't trigger other elements belongs to other ReactTooltip
      const targetArray = this.getTargetArray(this.props.id);
      const isMyElement = targetArray.some(ele => ele === e.currentTarget);
      if (!isMyElement) return;
    }
    // Get the tooltip content
    // calculate in this phrase so that tip width height can be detected
    const { multiline, getContent } = this.props;
    const originTooltip = e.currentTarget.getAttribute('data-tip');
    const isMultiline =
      e.currentTarget.getAttribute('data-multiline') || multiline || false;

    // If it is focus event or called by ReactTooltip.show, switch to `solid` effect
    const switchToSolid = e instanceof window.FocusEvent || isGlobalCall;

    // if it needs to skip adding hide listener to scroll
    let scrollHide = true;
    if (e.currentTarget.getAttribute('data-scroll-hide')) {
      scrollHide = e.currentTarget.getAttribute('data-scroll-hide') === 'true';
    } else if (this.props.scrollHide != null) {
      scrollHide = this.props.scrollHide;
    }

    // Make sure the correct place is set
    const desiredPlace =
      e.currentTarget.getAttribute('data-place') || this.props.place || 'top';
    const effect =
      (switchToSolid && 'solid') || this.getEffect(e.currentTarget);
    const offset =
      e.currentTarget.getAttribute('data-offset') || this.props.offset || {};
    const result = getPosition(
      e,
      e.currentTarget,
      this.tooltipRef,
      desiredPlace,
      desiredPlace,
      effect,
      offset
    );
    if (result.position && this.props.overridePosition) {
      result.position = this.props.overridePosition(
        result.position,
        e,
        e.currentTarget,
        this.tooltipRef,
        desiredPlace,
        desiredPlace,
        effect,
        offset
      );
    }

    const place = result.isNewState ? result.newState.place : desiredPlace;

    // To prevent previously created timers from triggering
    this.clearTimer();

    const target = e.currentTarget;

    const reshowDelay = this.state.show
      ? target.getAttribute('data-delay-update') || this.props.delayUpdate
      : 0;

    const self = this;

    const updateState = function updateState() {
      self.setState(
        {
          originTooltip: originTooltip,
          isMultiline: isMultiline,
          desiredPlace: desiredPlace,
          place: place,
          type: target.getAttribute('data-type') || self.props.type || 'dark',
          customColors: {
            text:
              target.getAttribute('data-text-color') ||
              self.props.textColor ||
              null,
            background:
              target.getAttribute('data-background-color') ||
              self.props.backgroundColor ||
              null,
            border:
              target.getAttribute('data-border-color') ||
              self.props.borderColor ||
              null,
            arrow:
              target.getAttribute('data-arrow-color') ||
              self.props.arrowColor ||
              null
          },
          effect: effect,
          offset: offset,
          html:
            (target.getAttribute('data-html')
              ? target.getAttribute('data-html') === 'true'
              : self.props.html) || false,
          delayShow:
            target.getAttribute('data-delay-show') || self.props.delayShow || 0,
          delayHide:
            target.getAttribute('data-delay-hide') || self.props.delayHide || 0,
          delayUpdate:
            target.getAttribute('data-delay-update') ||
            self.props.delayUpdate ||
            0,
          border:
            (target.getAttribute('data-border')
              ? target.getAttribute('data-border') === 'true'
              : self.props.border) || false,
          extraClass:
            target.getAttribute('data-class') ||
            self.props.class ||
            self.props.className ||
            '',
          disable:
            (target.getAttribute('data-tip-disable')
              ? target.getAttribute('data-tip-disable') === 'true'
              : self.props.disable) || false,
          currentTarget: target
        },
        () => {
          if (scrollHide) {
            self.addScrollListener(self.state.currentTarget);
          }

          self.updateTooltip(e);

          if (getContent && Array.isArray(getContent)) {
            self.intervalUpdateContent = setInterval(() => {
              if (self.mount) {
                const { getContent } = self.props;
                const placeholder = getTipContent(
                  originTooltip,
                  '',
                  getContent[0](),
                  isMultiline
                );
                const isEmptyTip = self.isEmptyTip(placeholder);
                self.setState({ isEmptyTip });
                self.updatePosition();
              }
            }, getContent[1]);
          }
        }
      );
    };

    // If there is no delay call immediately, don't allow events to get in first.
    if (reshowDelay) {
      this.delayReshow = setTimeout(updateState, reshowDelay);
    } else {
      updateState();
    }
  }

  /**
   * When mouse hover, update tool tip
   */
  updateTooltip(e) {
    const { delayShow, disable } = this.state;
    const { afterShow } = this.props;
    const placeholder = this.getTooltipContent();
    const eventTarget = e.currentTarget || e.target;

    // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
    if (this.mouseOnToolTip()) {
      return;
    }

    // if the tooltip is empty, disable the tooltip
    if (this.isEmptyTip(placeholder) || disable) {
      return;
    }

    const delayTime = !this.state.show ? parseInt(delayShow, 10) : 0;

    const updateState = () => {
      if (
        (Array.isArray(placeholder) && placeholder.length > 0) ||
        placeholder
      ) {
        const isInvisible = !this.state.show;
        this.setState(
          {
            currentEvent: e,
            currentTarget: eventTarget,
            show: true
          },
          () => {
            this.updatePosition();
            if (isInvisible && afterShow) {
              afterShow(e);
            }
          }
        );
      }
    };

    clearTimeout(this.delayShowLoop);
    if (delayTime) {
      this.delayShowLoop = setTimeout(updateState, delayTime);
    } else {
      updateState();
    }
  }

  /*
   * If we're mousing over the tooltip remove it when we leave.
   */
  listenForTooltipExit() {
    const { show } = this.state;

    if (show && this.tooltipRef) {
      this.tooltipRef.addEventListener('mouseleave', this.hideTooltip);
    }
  }

  removeListenerForTooltipExit() {
    const { show } = this.state;

    if (show && this.tooltipRef) {
      this.tooltipRef.removeEventListener('mouseleave', this.hideTooltip);
    }
  }

  /**
   * When mouse leave, hide tooltip
   */
  hideTooltip(e, hasTarget, options = { isScroll: false }) {
    const { disable } = this.state;
    const { isScroll } = options;
    const delayHide = isScroll ? 0 : this.state.delayHide;
    const { afterHide } = this.props;
    const placeholder = this.getTooltipContent();
    if (!this.mount) return;
    if (this.isEmptyTip(placeholder) || disable) return; // if the tooltip is empty, disable the tooltip
    if (hasTarget) {
      // Don't trigger other elements belongs to other ReactTooltip
      const targetArray = this.getTargetArray(this.props.id);
      const isMyElement = targetArray.some(ele => ele === e.currentTarget);
      if (!isMyElement || !this.state.show) return;
    }

    const resetState = () => {
      const isVisible = this.state.show;
      // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
      if (this.mouseOnToolTip()) {
        this.listenForTooltipExit();
        return;
      }

      this.removeListenerForTooltipExit();

      this.setState({ show: false }, () => {
        this.removeScrollListener(this.state.currentTarget);
        if (isVisible && afterHide) {
          afterHide(e);
        }
      });
    };

    this.clearTimer();
    if (delayHide) {
      this.delayHideLoop = setTimeout(resetState, parseInt(delayHide, 10));
    } else {
      resetState();
    }
  }

  /**
   * When scroll, hide tooltip
   */
  hideTooltipOnScroll(event, hasTarget) {
    this.hideTooltip(event, hasTarget, { isScroll: true });
  }

  /**
   * Add scroll event listener when tooltip show
   * automatically hide the tooltip when scrolling
   */
  addScrollListener(currentTarget) {
    const isCaptureMode = this.isCapture(currentTarget);
    window.addEventListener('scroll', this.hideTooltipOnScroll, isCaptureMode);
  }

  removeScrollListener(currentTarget) {
    const isCaptureMode = this.isCapture(currentTarget);
    window.removeEventListener(
      'scroll',
      this.hideTooltipOnScroll,
      isCaptureMode
    );
  }

  // Calculation the position
  updatePosition() {
    const {
      currentEvent,
      currentTarget,
      place,
      desiredPlace,
      effect,
      offset
    } = this.state;
    const node = this.tooltipRef;
    const result = getPosition(
      currentEvent,
      currentTarget,
      node,
      place,
      desiredPlace,
      effect,
      offset
    );
    if (result.position && this.props.overridePosition) {
      result.position = this.props.overridePosition(
        result.position,
        currentEvent,
        currentTarget,
        node,
        place,
        desiredPlace,
        effect,
        offset
      );
    }

    if (result.isNewState) {
      // Switch to reverse placement
      return this.setState(result.newState, () => {
        this.updatePosition();
      });
    }

    // Set tooltip position
    node.style.left = result.position.left + 'px';
    node.style.top = result.position.top + 'px';
  }

  /**
   * CLear all kinds of timeout of interval
   */
  clearTimer() {
    clearTimeout(this.delayShowLoop);
    clearTimeout(this.delayHideLoop);
    clearTimeout(this.delayReshow);
    clearInterval(this.intervalUpdateContent);
  }

  hasCustomColors() {
    return Boolean(
      Object.keys(this.state.customColors).find(
        color => color !== 'border' && this.state.customColors[color]
      ) ||
        (this.state.border && this.state.customColors['border'])
    );
  }

  render() {
    const { extraClass, html, ariaProps, disable } = this.state;
    const content = this.getTooltipContent();
    const isEmptyTip = this.isEmptyTip(content);
    const style = generateTooltipStyle(
      this.state.uuid,
      this.state.customColors,
      this.state.type,
      this.state.border
    );

    const tooltipClass =
      '__react_component_tooltip' +
      ` ${this.state.uuid}` +
      (this.state.show && !disable && !isEmptyTip ? ' show' : '') +
      (this.state.border ? ' border' : '') +
      ` place-${this.state.place}` + // top, bottom, left, right
      ` type-${this.hasCustomColors() ? 'custom' : this.state.type}` + // dark, success, warning, error, info, light, custom
      (this.props.delayUpdate ? ' allow_hover' : '') +
      (this.props.clickable ? ' allow_click' : '');

    let Wrapper = this.props.wrapper;

    if (ReactTooltip.supportedWrappers.indexOf(Wrapper) < 0) {
      Wrapper = ReactTooltip.defaultProps.wrapper;
    }

    const wrapperClassName = [tooltipClass, extraClass]
      .filter(Boolean)
      .join(' ');

    if (html) {
      const htmlContent = `${content}\n<style>${style}</style>`;

      return (
        <Wrapper
          className={`${wrapperClassName}`}
          id={this.props.id}
          ref={ref => (this.tooltipRef = ref)}
          {...ariaProps}
          data-id="tooltip"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    } else {
      return (
        <Wrapper
          className={`${wrapperClassName}`}
          id={this.props.id}
          {...ariaProps}
          ref={ref => (this.tooltipRef = ref)}
          data-id="tooltip"
        >
          <style dangerouslySetInnerHTML={{ __html: style }} />
          {content}
        </Wrapper>
      );
    }
  }
}

export default ReactTooltip;
