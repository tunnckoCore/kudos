(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.kudos = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * kudos <https://github.com/tunnckoCore/kudos>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var Dush = require('dush')

module.exports = Kudos

function Kudos (opts) {
  if (!(this instanceof Kudos)) {
    return new Kudos(opts)
  }

  Dush.call(this)
  this.options = typeof opts === 'object' ? opts : {}
  this._defaults()
}

Dush.mixin(Kudos.prototype)

Kudos.prototype._defaults = function _defaults () {
  var self = this
  var isDom = this._d
  this._element = this.options.el || this.options.element

  if (!isDom(this._element)) {
    throw new TypeError('expect DOM `opts.element` or `opts.el` in options')
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
  var time = this.options.duration || this.options.delay
  var duration = typeof time === 'number' ? time : 1500

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
  }, duration)

  return this
}

Kudos.prototype.resetTimer = function () {
  clearInterval(this.timeout)
  return this
}

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
    el.className = remove(el, name)
  }
  return el
}

function remove (el, name) {
  var re = new RegExp('(^|\\b)' + name.split(' ').join('|') + '(\\b|$)', 'gi')
  return el.className.replace(re, ' ')
}

},{"dush":2}],2:[function(require,module,exports){
/*!
 * dush <https://github.com/tunnckoCore/dush>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var o = 'outerHTML'
var l = 'EventListener'
var p = 'prototype'
var op = Object[p]
var has = op.hasOwnProperty

module.exports = Dush

function Dush ($) {
  if (!(this instanceof Dush)) {
    return new Dush($)
  }
  $ = $ || this
  $._e = $._e || {}
  $._d = function (v) {
    v = op.toString.call(v)
    return /(?:HTML)?(?:.*)Element/gi.test(v)
  }
  $.on = function (n, f, e, i) {
    $._e[n] = $._e[n] || []
    $._e[n].push(f)

    if (e && $._d(e)) {
      f[o] = e[o]
      i = e['add' + l]
      i ? e['add' + l](n, f, 0) : e.attachEvent('on' + n, f)
    }
    return $
  }
  $.off = function (n, f, e, i) {
    if (!has.call($._e, n)) {return $}
    $._e[n].splice($._e[n].indexOf(f), 1)

    if (e && $._d(e)) {
      i = e['remove' + l]
      i ? e['remove' + l](n, f, 0) : e.detachEvent('on' + n, f)
    }
    return $
  }
  $.once = function (n, f, e) {
    function h () {
      $.off(n, h, e)
      return f.apply(e, arguments)
    }
    return $.on(n, h, e)
  }
  $.emit = function (n, a, e, i, f, d) {
    if (!has.call($._e, n)) {return $}
    a = [].slice.call(arguments, 1)
    e = a[a.length - 1]
    d = $._d(e)
    e = d ? e : $
    a = d ? a.slice(0, -1) : a

    for (i = 0; i < $._e[n].length; i++) {
      f = $._e[n][i]
      if (d && f[o] !== e[o]) {
        continue
      }
      f.apply(e, a)
    }
    return $
  }
}
Dush.mixin = function (r, s, c, k, j) {
  s = s || Dush
  c = r.constructor
  for (k in s) c[k] = s[k]
  c[p] = Object.create(s[p])
  for (j in r) c[p][j] = r[j]
  c.__super__ = p[p]
  return c
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdXNoL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBrdWRvcyA8aHR0cHM6Ly9naXRodWIuY29tL3R1bm5ja29Db3JlL2t1ZG9zPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBDaGFybGlrZSBNaWtlIFJlYWdlbnQgPEB0dW5uY2tvQ29yZT4gKGh0dHA6Ly93d3cudHVubmNrb2NvcmUudGspXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBEdXNoID0gcmVxdWlyZSgnZHVzaCcpXG5cbm1vZHVsZS5leHBvcnRzID0gS3Vkb3NcblxuZnVuY3Rpb24gS3Vkb3MgKG9wdHMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEt1ZG9zKSkge1xuICAgIHJldHVybiBuZXcgS3Vkb3Mob3B0cylcbiAgfVxuXG4gIER1c2guY2FsbCh0aGlzKVxuICB0aGlzLm9wdGlvbnMgPSB0eXBlb2Ygb3B0cyA9PT0gJ29iamVjdCcgPyBvcHRzIDoge31cbiAgdGhpcy5fZGVmYXVsdHMoKVxufVxuXG5EdXNoLm1peGluKEt1ZG9zLnByb3RvdHlwZSlcblxuS3Vkb3MucHJvdG90eXBlLl9kZWZhdWx0cyA9IGZ1bmN0aW9uIF9kZWZhdWx0cyAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgaXNEb20gPSB0aGlzLl9kXG4gIHRoaXMuX2VsZW1lbnQgPSB0aGlzLm9wdGlvbnMuZWwgfHwgdGhpcy5vcHRpb25zLmVsZW1lbnRcblxuICBpZiAoIWlzRG9tKHRoaXMuX2VsZW1lbnQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0IERPTSBgb3B0cy5lbGVtZW50YCBvciBgb3B0cy5lbGAgaW4gb3B0aW9ucycpXG4gIH1cblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQgKGV2dCkge1xuICAgIHNlbGYuX2VsZW1lbnQgPSBzZWxmLmFkZENsYXNzKHNlbGYuX2VsZW1lbnQsICdhY3RpdmUnKVxuICAgIHNlbGYuc3RhcnRUaW1lcigpLmVtaXQoJ2t1ZG86aW4nLCBldnQpXG4gIH1cbiAgdGhpcy5lbmQgPSBmdW5jdGlvbiBlbmQgKGV2dCkge1xuICAgIHNlbGYuX2VsZW1lbnQgPSBzZWxmLnJlbW92ZUNsYXNzKHNlbGYuX2VsZW1lbnQsICdhY3RpdmUnKVxuICAgIHNlbGYucmVzZXRUaW1lcigpLmVtaXQoJ2t1ZG86b3V0JywgZXZ0KVxuICB9XG4gIHRoaXMuc3RhcnRUb3VjaCA9IGZ1bmN0aW9uIHN0YXJ0VG91Y2ggKGV2dCkge1xuICAgIGlmIChldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIHByZXZlbnQgZnJvbSBwcm9wYWdhdGlvbiBhbmQgcHJldmVudERlZmF1bHQuXG4gICAgICAvLyBTbyB3ZSBjYW4gdXNlIGJvdGggdG91Y2ggZXZlbnRzIGFuZCBtb3VzZSBldmVudHMuXG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICAgIHNlbGYuZW1pdCgna3VkbzppbicsIGV2dClcbiAgfVxuXG4gIHRoaXNcbiAgICAub24oJ21vdXNlb3ZlcicsIHRoaXMuc3RhcnQsIHRoaXMuX2VsZW1lbnQpXG4gICAgLm9uKCdtb3VzZW91dCcsIHRoaXMuZW5kLCB0aGlzLl9lbGVtZW50KVxuICAgIC5vbigndG91Y2hzdGFydCcsIHRoaXMuc3RhcnRUb3VjaCwgdGhpcy5fZWxlbWVudClcbiAgICAub24oJ3RvdWNoZW5kJywgdGhpcy5lbmQsIHRoaXMuX2VsZW1lbnQpXG59XG5cbkt1ZG9zLnByb3RvdHlwZS5zdGFydFRpbWVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIHRpbWUgPSB0aGlzLm9wdGlvbnMuZHVyYXRpb24gfHwgdGhpcy5vcHRpb25zLmRlbGF5XG4gIHZhciBkdXJhdGlvbiA9IHR5cGVvZiB0aW1lID09PSAnbnVtYmVyJyA/IHRpbWUgOiAxNTAwXG5cbiAgdGhpcy50aW1lb3V0ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX2VsZW1lbnQgPSBzZWxmLnJlbW92ZUNsYXNzKHNlbGYuX2VsZW1lbnQsICdhY3RpdmUnKVxuICAgIHNlbGYuX2VsZW1lbnQgPSBzZWxmLmFkZENsYXNzKHNlbGYuX2VsZW1lbnQsICdjb21wbGV0ZScpXG4gICAgc2VsZlxuICAgICAgLmVtaXQoJ2t1ZG86Y29tcGxldGUnLCBzZWxmKVxuICAgICAgLnJlc2V0VGltZXIoKVxuICAgICAgLm9mZignbW91c2VvdmVyJywgc2VsZi5zdGFydCwgc2VsZi5fZWxlbWVudClcbiAgICAgIC5vZmYoJ21vdXNlb3V0Jywgc2VsZi5lbmQsIHNlbGYuX2VsZW1lbnQpXG4gICAgICAub2ZmKCd0b3VjaHN0YXJ0Jywgc2VsZi5zdGFydFRvdWNoLCBzZWxmLl9lbGVtZW50KVxuICAgICAgLm9mZigndG91Y2hlbmQnLCBzZWxmLmVuZCwgc2VsZi5fZWxlbWVudClcbiAgfSwgZHVyYXRpb24pXG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuS3Vkb3MucHJvdG90eXBlLnJlc2V0VGltZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lb3V0KVxuICByZXR1cm4gdGhpc1xufVxuXG5LdWRvcy5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiBhZGRDbGFzcyAoZWwsIG5hbWUpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQobmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgbmFtZVxuICB9XG4gIHJldHVybiBlbFxufVxuXG5LdWRvcy5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyAoZWwsIG5hbWUpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUobmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSByZW1vdmUoZWwsIG5hbWUpXG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbmZ1bmN0aW9uIHJlbW92ZSAoZWwsIG5hbWUpIHtcbiAgdmFyIHJlID0gbmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIG5hbWUuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJylcbiAgcmV0dXJuIGVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlLCAnICcpXG59XG4iLCIvKiFcbiAqIGR1c2ggPGh0dHBzOi8vZ2l0aHViLmNvbS90dW5uY2tvQ29yZS9kdXNoPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBDaGFybGlrZSBNaWtlIFJlYWdlbnQgPEB0dW5uY2tvQ29yZT4gKGh0dHA6Ly93d3cudHVubmNrb2NvcmUudGspXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuLyoganNoaW50IGFzaTp0cnVlICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgbyA9ICdvdXRlckhUTUwnXG52YXIgbCA9ICdFdmVudExpc3RlbmVyJ1xudmFyIHAgPSAncHJvdG90eXBlJ1xudmFyIG9wID0gT2JqZWN0W3BdXG52YXIgaGFzID0gb3AuaGFzT3duUHJvcGVydHlcblxubW9kdWxlLmV4cG9ydHMgPSBEdXNoXG5cbmZ1bmN0aW9uIER1c2ggKCQpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIER1c2gpKSB7XG4gICAgcmV0dXJuIG5ldyBEdXNoKCQpXG4gIH1cbiAgJCA9ICQgfHwgdGhpc1xuICAkLl9lID0gJC5fZSB8fCB7fVxuICAkLl9kID0gZnVuY3Rpb24gKHYpIHtcbiAgICB2ID0gb3AudG9TdHJpbmcuY2FsbCh2KVxuICAgIHJldHVybiAvKD86SFRNTCk/KD86LiopRWxlbWVudC9naS50ZXN0KHYpXG4gIH1cbiAgJC5vbiA9IGZ1bmN0aW9uIChuLCBmLCBlLCBpKSB7XG4gICAgJC5fZVtuXSA9ICQuX2Vbbl0gfHwgW11cbiAgICAkLl9lW25dLnB1c2goZilcblxuICAgIGlmIChlICYmICQuX2QoZSkpIHtcbiAgICAgIGZbb10gPSBlW29dXG4gICAgICBpID0gZVsnYWRkJyArIGxdXG4gICAgICBpID8gZVsnYWRkJyArIGxdKG4sIGYsIDApIDogZS5hdHRhY2hFdmVudCgnb24nICsgbiwgZilcbiAgICB9XG4gICAgcmV0dXJuICRcbiAgfVxuICAkLm9mZiA9IGZ1bmN0aW9uIChuLCBmLCBlLCBpKSB7XG4gICAgaWYgKCFoYXMuY2FsbCgkLl9lLCBuKSkge3JldHVybiAkfVxuICAgICQuX2Vbbl0uc3BsaWNlKCQuX2Vbbl0uaW5kZXhPZihmKSwgMSlcblxuICAgIGlmIChlICYmICQuX2QoZSkpIHtcbiAgICAgIGkgPSBlWydyZW1vdmUnICsgbF1cbiAgICAgIGkgPyBlWydyZW1vdmUnICsgbF0obiwgZiwgMCkgOiBlLmRldGFjaEV2ZW50KCdvbicgKyBuLCBmKVxuICAgIH1cbiAgICByZXR1cm4gJFxuICB9XG4gICQub25jZSA9IGZ1bmN0aW9uIChuLCBmLCBlKSB7XG4gICAgZnVuY3Rpb24gaCAoKSB7XG4gICAgICAkLm9mZihuLCBoLCBlKVxuICAgICAgcmV0dXJuIGYuYXBwbHkoZSwgYXJndW1lbnRzKVxuICAgIH1cbiAgICByZXR1cm4gJC5vbihuLCBoLCBlKVxuICB9XG4gICQuZW1pdCA9IGZ1bmN0aW9uIChuLCBhLCBlLCBpLCBmLCBkKSB7XG4gICAgaWYgKCFoYXMuY2FsbCgkLl9lLCBuKSkge3JldHVybiAkfVxuICAgIGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICBlID0gYVthLmxlbmd0aCAtIDFdXG4gICAgZCA9ICQuX2QoZSlcbiAgICBlID0gZCA/IGUgOiAkXG4gICAgYSA9IGQgPyBhLnNsaWNlKDAsIC0xKSA6IGFcblxuICAgIGZvciAoaSA9IDA7IGkgPCAkLl9lW25dLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmID0gJC5fZVtuXVtpXVxuICAgICAgaWYgKGQgJiYgZltvXSAhPT0gZVtvXSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgZi5hcHBseShlLCBhKVxuICAgIH1cbiAgICByZXR1cm4gJFxuICB9XG59XG5EdXNoLm1peGluID0gZnVuY3Rpb24gKHIsIHMsIGMsIGssIGopIHtcbiAgcyA9IHMgfHwgRHVzaFxuICBjID0gci5jb25zdHJ1Y3RvclxuICBmb3IgKGsgaW4gcykgY1trXSA9IHNba11cbiAgY1twXSA9IE9iamVjdC5jcmVhdGUoc1twXSlcbiAgZm9yIChqIGluIHIpIGNbcF1bal0gPSByW2pdXG4gIGMuX19zdXBlcl9fID0gcFtwXVxuICByZXR1cm4gY1xufVxuIl19
