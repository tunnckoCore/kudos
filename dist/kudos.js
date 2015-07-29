(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Kudos = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * kudos <https://github.com/tunnckoCore/kudos>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var DualEmitter = require('dual-emitter')

module.exports = Kudos

function Kudos (opts) {
  if (!(this instanceof Kudos)) {
    return new Kudos(opts)
  }

  DualEmitter.call(this)
  this.options = typeof opts === 'object' ? opts : {}
  this.defaults()
}

DualEmitter.mixin(Kudos.prototype)

Kudos.prototype.addClass = function addClass (el, name) {
  if (el.classList) {
    el.classList.add(name)
  } else {
    el.className += ' ' + name
  }
  return el
}

Kudos.prototype.removeClass = function removeClass (el, name) {
  if (el.classList) {
    el.classList.remove(name)
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
  }
  return el
}

Kudos.prototype.defaults = function () {
  var self = this
  this._element = this.options.el || this.options.element

  if (!this._isDom(this._element)) {
    throw new TypeError('expect DOM element')
  }

  this.start = function start (evt) {
    self._element = self.addClass(self._element, 'active')
    self.startTimer().emit('kudo:in', evt)
  }
  this.end = function end (evt) {
    self._element = self.removeClass(self._element, 'active')
    self.resetTimer().emit('kudo:out', evt)
  }
  this.startTouch = function startTouch (evt) {
    if (evt.touches.length === 1) {
      // prevent from propagation and preventDefault.
      // So we can use both touch events and mouse events.
      evt.stopPropagation()
      evt.preventDefault()
    }
    self.emit('kudo:in', evt)
  }

  this
    .on('mouseover', this.start, this._element)
    .on('mouseout', this.end, this._element)
    .on('touchstart', this.startTouch, this._element)
    .on('touchend', this.end, this._element)
}

Kudos.prototype.startTimer = function () {
  var self = this

  this.timeout = setInterval(function () {
    self._element = self.removeClass(self._element, 'active')
    self._element = self.addClass(self._element, 'complete')
    self
      .emit('kudo:complete', self)
      .resetTimer()
      .off('mouseover', self.start, self._element)
      .off('mouseout', self.end, self._element)
      .off('touchstart', self.startTouch, self._element)
      .off('touchend', self.end, self._element)
  }, this.options.duration || 1000)

  return this
}

Kudos.prototype.resetTimer = function () {
  clearInterval(this.timeout)
  return this
}

},{"dual-emitter":2}],2:[function(require,module,exports){
/*!
 * dual-emitter <https://github.com/tunnckoCore/dual-emitter>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

function DualEmitter (events) {
  if (!(this instanceof DualEmitter)) {
    return new DualEmitter(events)
  }

  this._events = events && typeof events === 'object' ? events : {}
}

DualEmitter.prototype.on = function on (name, fn, el) {
  this._events[name] = this._hasOwn(this._events, name) ? this._events[name] : []
  this._events[name].push(fn)

  if (el && this._isDom(el)) {
    fn.outerHTML = el.outerHTML
    this._element = el
    el.addEventListener
      ? el.addEventListener(name, fn, false)
      : el.attachEvent('on' + name, fn)
  }
  return this
}

DualEmitter.prototype.off = function off (name, fn, el) {
  if (!this._hasOwn(this._events, name) && !this._events[name]) return this
  this._events[name].splice(this._events[name].indexOf(fn), 1)

  if (el && this._isDom(el)) {
    el.removeEventListener
      ? el.removeEventListener(name, fn, false)
      : el.detachEvent('on' + name, fn)
  }
  return this
}

DualEmitter.prototype.once = function once (name, fn, el) {
  var self = this
  function handler (evt) {
    self.off(name, handler, el)
    return fn(evt)
  }
  return this.on(name, handler, el)
}

DualEmitter.prototype.emit = function emit (name) {
  if (!this._hasOwn(this._events, name) && !this._events[name]) return this
  var args = Array.prototype.slice.call(arguments, 1)
  var el = args[args.length - 1]
  var isdom = this._isDom(el)
  el = isdom ? el : this
  args = isdom ? args.slice(0, -1) : args

  for (var i = 0; i < this._events[name].length; i++) {
    var fn = this._events[name][i]
    if (isdom && fn.outerHTML !== el.outerHTML) {
      continue
    }
    fn.apply(el, args)
  }
  return this
}

DualEmitter.prototype._isDom = function isDom (obj) {
  obj = Object.prototype.toString.call(obj).slice(8, -1)
  return /(?:HTML)?(?:.*)Element/.test(obj)
}

DualEmitter.prototype._hasOwn = function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

DualEmitter.mixin = function mixin (receiver, provider) {
  provider = provider || this
  for (var key in provider) {
    receiver.constructor[key] = provider[key]
  }
  receiver.constructor.prototype = Object.create(provider.prototype)
  for (var prop in receiver) {
    receiver.constructor.prototype[prop] = receiver[prop]
  }
  receiver.constructor.__super__ = provider.prototype
  return receiver.constructor
}

module.exports = DualEmitter

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvaW8uanMvdjIuNC4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVhbC1lbWl0dGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIGt1ZG9zIDxodHRwczovL2dpdGh1Yi5jb20vdHVubmNrb0NvcmUva3Vkb3M+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IENoYXJsaWtlIE1pa2UgUmVhZ2VudCA8QHR1bm5ja29Db3JlPiAoaHR0cDovL3d3dy50dW5uY2tvY29yZS50aylcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIER1YWxFbWl0dGVyID0gcmVxdWlyZSgnZHVhbC1lbWl0dGVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBLdWRvc1xuXG5mdW5jdGlvbiBLdWRvcyAob3B0cykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgS3Vkb3MpKSB7XG4gICAgcmV0dXJuIG5ldyBLdWRvcyhvcHRzKVxuICB9XG5cbiAgRHVhbEVtaXR0ZXIuY2FsbCh0aGlzKVxuICB0aGlzLm9wdGlvbnMgPSB0eXBlb2Ygb3B0cyA9PT0gJ29iamVjdCcgPyBvcHRzIDoge31cbiAgdGhpcy5kZWZhdWx0cygpXG59XG5cbkR1YWxFbWl0dGVyLm1peGluKEt1ZG9zLnByb3RvdHlwZSlcblxuS3Vkb3MucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gYWRkQ2xhc3MgKGVsLCBuYW1lKSB7XG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKG5hbWUpXG4gIH0gZWxzZSB7XG4gICAgZWwuY2xhc3NOYW1lICs9ICcgJyArIG5hbWVcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuS3Vkb3MucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gcmVtb3ZlQ2xhc3MgKGVsLCBuYW1lKSB7XG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKG5hbWUpXG4gIH0gZWxzZSB7XG4gICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIG5hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJylcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuS3Vkb3MucHJvdG90eXBlLmRlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdGhpcy5fZWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbCB8fCB0aGlzLm9wdGlvbnMuZWxlbWVudFxuXG4gIGlmICghdGhpcy5faXNEb20odGhpcy5fZWxlbWVudCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3QgRE9NIGVsZW1lbnQnKVxuICB9XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0IChldnQpIHtcbiAgICBzZWxmLl9lbGVtZW50ID0gc2VsZi5hZGRDbGFzcyhzZWxmLl9lbGVtZW50LCAnYWN0aXZlJylcbiAgICBzZWxmLnN0YXJ0VGltZXIoKS5lbWl0KCdrdWRvOmluJywgZXZ0KVxuICB9XG4gIHRoaXMuZW5kID0gZnVuY3Rpb24gZW5kIChldnQpIHtcbiAgICBzZWxmLl9lbGVtZW50ID0gc2VsZi5yZW1vdmVDbGFzcyhzZWxmLl9lbGVtZW50LCAnYWN0aXZlJylcbiAgICBzZWxmLnJlc2V0VGltZXIoKS5lbWl0KCdrdWRvOm91dCcsIGV2dClcbiAgfVxuICB0aGlzLnN0YXJ0VG91Y2ggPSBmdW5jdGlvbiBzdGFydFRvdWNoIChldnQpIHtcbiAgICBpZiAoZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBwcmV2ZW50IGZyb20gcHJvcGFnYXRpb24gYW5kIHByZXZlbnREZWZhdWx0LlxuICAgICAgLy8gU28gd2UgY2FuIHVzZSBib3RoIHRvdWNoIGV2ZW50cyBhbmQgbW91c2UgZXZlbnRzLlxuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgICBzZWxmLmVtaXQoJ2t1ZG86aW4nLCBldnQpXG4gIH1cblxuICB0aGlzXG4gICAgLm9uKCdtb3VzZW92ZXInLCB0aGlzLnN0YXJ0LCB0aGlzLl9lbGVtZW50KVxuICAgIC5vbignbW91c2VvdXQnLCB0aGlzLmVuZCwgdGhpcy5fZWxlbWVudClcbiAgICAub24oJ3RvdWNoc3RhcnQnLCB0aGlzLnN0YXJ0VG91Y2gsIHRoaXMuX2VsZW1lbnQpXG4gICAgLm9uKCd0b3VjaGVuZCcsIHRoaXMuZW5kLCB0aGlzLl9lbGVtZW50KVxufVxuXG5LdWRvcy5wcm90b3R5cGUuc3RhcnRUaW1lciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgdGhpcy50aW1lb3V0ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX2VsZW1lbnQgPSBzZWxmLnJlbW92ZUNsYXNzKHNlbGYuX2VsZW1lbnQsICdhY3RpdmUnKVxuICAgIHNlbGYuX2VsZW1lbnQgPSBzZWxmLmFkZENsYXNzKHNlbGYuX2VsZW1lbnQsICdjb21wbGV0ZScpXG4gICAgc2VsZlxuICAgICAgLmVtaXQoJ2t1ZG86Y29tcGxldGUnLCBzZWxmKVxuICAgICAgLnJlc2V0VGltZXIoKVxuICAgICAgLm9mZignbW91c2VvdmVyJywgc2VsZi5zdGFydCwgc2VsZi5fZWxlbWVudClcbiAgICAgIC5vZmYoJ21vdXNlb3V0Jywgc2VsZi5lbmQsIHNlbGYuX2VsZW1lbnQpXG4gICAgICAub2ZmKCd0b3VjaHN0YXJ0Jywgc2VsZi5zdGFydFRvdWNoLCBzZWxmLl9lbGVtZW50KVxuICAgICAgLm9mZigndG91Y2hlbmQnLCBzZWxmLmVuZCwgc2VsZi5fZWxlbWVudClcbiAgfSwgdGhpcy5vcHRpb25zLmR1cmF0aW9uIHx8IDEwMDApXG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuS3Vkb3MucHJvdG90eXBlLnJlc2V0VGltZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lb3V0KVxuICByZXR1cm4gdGhpc1xufVxuIiwiLyohXG4gKiBkdWFsLWVtaXR0ZXIgPGh0dHBzOi8vZ2l0aHViLmNvbS90dW5uY2tvQ29yZS9kdWFsLWVtaXR0ZXI+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IENoYXJsaWtlIE1pa2UgUmVhZ2VudCA8QHR1bm5ja29Db3JlPiAoaHR0cDovL3d3dy50dW5uY2tvY29yZS50aylcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gRHVhbEVtaXR0ZXIgKGV2ZW50cykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRHVhbEVtaXR0ZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBEdWFsRW1pdHRlcihldmVudHMpXG4gIH1cblxuICB0aGlzLl9ldmVudHMgPSBldmVudHMgJiYgdHlwZW9mIGV2ZW50cyA9PT0gJ29iamVjdCcgPyBldmVudHMgOiB7fVxufVxuXG5EdWFsRW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbiAobmFtZSwgZm4sIGVsKSB7XG4gIHRoaXMuX2V2ZW50c1tuYW1lXSA9IHRoaXMuX2hhc093bih0aGlzLl9ldmVudHMsIG5hbWUpID8gdGhpcy5fZXZlbnRzW25hbWVdIDogW11cbiAgdGhpcy5fZXZlbnRzW25hbWVdLnB1c2goZm4pXG5cbiAgaWYgKGVsICYmIHRoaXMuX2lzRG9tKGVsKSkge1xuICAgIGZuLm91dGVySFRNTCA9IGVsLm91dGVySFRNTFxuICAgIHRoaXMuX2VsZW1lbnQgPSBlbFxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXJcbiAgICAgID8gZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmbiwgZmFsc2UpXG4gICAgICA6IGVsLmF0dGFjaEV2ZW50KCdvbicgKyBuYW1lLCBmbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5EdWFsRW1pdHRlci5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gb2ZmIChuYW1lLCBmbiwgZWwpIHtcbiAgaWYgKCF0aGlzLl9oYXNPd24odGhpcy5fZXZlbnRzLCBuYW1lKSAmJiAhdGhpcy5fZXZlbnRzW25hbWVdKSByZXR1cm4gdGhpc1xuICB0aGlzLl9ldmVudHNbbmFtZV0uc3BsaWNlKHRoaXMuX2V2ZW50c1tuYW1lXS5pbmRleE9mKGZuKSwgMSlcblxuICBpZiAoZWwgJiYgdGhpcy5faXNEb20oZWwpKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgICAgPyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGZuLCBmYWxzZSlcbiAgICAgIDogZWwuZGV0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGZuKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSAobmFtZSwgZm4sIGVsKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBmdW5jdGlvbiBoYW5kbGVyIChldnQpIHtcbiAgICBzZWxmLm9mZihuYW1lLCBoYW5kbGVyLCBlbClcbiAgICByZXR1cm4gZm4oZXZ0KVxuICB9XG4gIHJldHVybiB0aGlzLm9uKG5hbWUsIGhhbmRsZXIsIGVsKVxufVxuXG5EdWFsRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQgKG5hbWUpIHtcbiAgaWYgKCF0aGlzLl9oYXNPd24odGhpcy5fZXZlbnRzLCBuYW1lKSAmJiAhdGhpcy5fZXZlbnRzW25hbWVdKSByZXR1cm4gdGhpc1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgdmFyIGVsID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdXG4gIHZhciBpc2RvbSA9IHRoaXMuX2lzRG9tKGVsKVxuICBlbCA9IGlzZG9tID8gZWwgOiB0aGlzXG4gIGFyZ3MgPSBpc2RvbSA/IGFyZ3Muc2xpY2UoMCwgLTEpIDogYXJnc1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZXZlbnRzW25hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGZuID0gdGhpcy5fZXZlbnRzW25hbWVdW2ldXG4gICAgaWYgKGlzZG9tICYmIGZuLm91dGVySFRNTCAhPT0gZWwub3V0ZXJIVE1MKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBmbi5hcHBseShlbCwgYXJncylcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5EdWFsRW1pdHRlci5wcm90b3R5cGUuX2lzRG9tID0gZnVuY3Rpb24gaXNEb20gKG9iaikge1xuICBvYmogPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKS5zbGljZSg4LCAtMSlcbiAgcmV0dXJuIC8oPzpIVE1MKT8oPzouKilFbGVtZW50Ly50ZXN0KG9iailcbn1cblxuRHVhbEVtaXR0ZXIucHJvdG90eXBlLl9oYXNPd24gPSBmdW5jdGlvbiBoYXNPd24gKG9iaiwga2V5KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXG59XG5cbkR1YWxFbWl0dGVyLm1peGluID0gZnVuY3Rpb24gbWl4aW4gKHJlY2VpdmVyLCBwcm92aWRlcikge1xuICBwcm92aWRlciA9IHByb3ZpZGVyIHx8IHRoaXNcbiAgZm9yICh2YXIga2V5IGluIHByb3ZpZGVyKSB7XG4gICAgcmVjZWl2ZXIuY29uc3RydWN0b3Jba2V5XSA9IHByb3ZpZGVyW2tleV1cbiAgfVxuICByZWNlaXZlci5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHByb3ZpZGVyLnByb3RvdHlwZSlcbiAgZm9yICh2YXIgcHJvcCBpbiByZWNlaXZlcikge1xuICAgIHJlY2VpdmVyLmNvbnN0cnVjdG9yLnByb3RvdHlwZVtwcm9wXSA9IHJlY2VpdmVyW3Byb3BdXG4gIH1cbiAgcmVjZWl2ZXIuY29uc3RydWN0b3IuX19zdXBlcl9fID0gcHJvdmlkZXIucHJvdG90eXBlXG4gIHJldHVybiByZWNlaXZlci5jb25zdHJ1Y3RvclxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IER1YWxFbWl0dGVyXG4iXX0=
