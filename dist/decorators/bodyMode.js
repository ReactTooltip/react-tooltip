'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.isBodyMode = function () {
    return !!this.props.bodyMode;
  };

  target.prototype.bindBodyListener = function (targetArray) {
    var _this = this;

    var _state = this.state,
        event = _state.event,
        eventOff = _state.eventOff,
        possibleCustomEvents = _state.possibleCustomEvents,
        possibleCustomEventsOff = _state.possibleCustomEventsOff;

    var body = getBody();

    var customEvents = findCustomEvents(targetArray, 'data-event');
    var customEventsOff = findCustomEvents(targetArray, 'data-event-off');

    if (event != null) customEvents[event] = true;
    if (eventOff != null) customEventsOff[eventOff] = true;
    possibleCustomEvents.split(' ').forEach(function (event) {
      return customEvents[event] = true;
    });
    possibleCustomEventsOff.split(' ').forEach(function (event) {
      return customEventsOff[event] = true;
    });

    this.unbindBodyListener(body);

    var listeners = this.bodyModeListeners = {};
    if (event == null) {
      listeners.mouseover = bodyListener.bind(this, this.showTooltip, {});
      listeners.mousemove = bodyListener.bind(this, this.updateTooltip, { respectEffect: true });
      listeners.mouseout = bodyListener.bind(this, this.hideTooltip, {});
    }

    for (var _event in customEvents) {
      listeners[_event] = bodyListener.bind(this, function (e) {
        var targetEventOff = e.currentTarget.getAttribute('data-event-off') || eventOff;
        _customEvent.checkStatus.call(_this, targetEventOff, e);
      }, { customEvent: true });
    }
    for (var _event2 in customEventsOff) {
      listeners[_event2] = bodyListener.bind(this, this.hideTooltip, { customEvent: true });
    }
    for (var _event3 in listeners) {
      body.addEventListener(_event3, listeners[_event3]);
    }
  };

  target.prototype.unbindBodyListener = function (body) {
    body = body || getBody();

    var listeners = this.bodyModeListeners;
    for (var event in listeners) {
      body.removeEventListener(event, listeners[event]);
    }
  };
};

var _customEvent = require('./customEvent');

var makeProxy = function makeProxy(e) {
  var proxy = {};
  for (var key in e) {
    if (typeof e[key] === 'function') {
      proxy[key] = e[key].bind(e);
    } else {
      proxy[key] = e[key];
    }
  }
  return proxy;
}; /**
    * Util method to get effect
    */


var bodyListener = function bodyListener(callback, options, e) {
  var _options$respectEffec = options.respectEffect,
      respectEffect = _options$respectEffec === undefined ? false : _options$respectEffec,
      _options$customEvent = options.customEvent,
      customEvent = _options$customEvent === undefined ? false : _options$customEvent;
  var id = this.props.id;

  var tip = null;
  var forId = void 0;
  var target = e.target;
  var lastTarget = void 0;
  // walk up parent chain until tip is found
  // there is no match if parent visible area is matched by mouse position, so some corner cases might not work as expected
  while (tip === null && target !== null) {
    lastTarget = target;
    tip = target.getAttribute('data-tip') || null;
    forId = target.getAttribute('data-for') || null;
    target = target.parentElement;
  }
  target = lastTarget || e.target;
  if (this.isCustomEvent(target) && !customEvent) {
    return;
  }

  var isTargetBelongsToTooltip = id == null && forId == null || forId === id;

  if (tip != null && (!respectEffect || this.getEffect(target) === 'float') && isTargetBelongsToTooltip) {
    var proxy = makeProxy(e);
    proxy.currentTarget = target;
    callback(proxy);
  }
};

var findCustomEvents = function findCustomEvents(targetArray, dataAttribute) {
  var events = {};
  targetArray.forEach(function (target) {
    var event = target.getAttribute(dataAttribute);
    if (event) event.split(' ').forEach(function (event) {
      return events[event] = true;
    });
  });

  return events;
};

var getBody = function getBody() {
  return document.getElementsByTagName('body')[0];
};