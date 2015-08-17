(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * kudos <https://github.com/tunnckoCore/kudos>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

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
    self.resetTimer()
    self.emit('kudo:out', evt)
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdXNoL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBrdWRvcyA8aHR0cHM6Ly9naXRodWIuY29tL3R1bm5ja29Db3JlL2t1ZG9zPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBDaGFybGlrZSBNaWtlIFJlYWdlbnQgPEB0dW5uY2tvQ29yZT4gKGh0dHA6Ly93d3cudHVubmNrb2NvcmUudGspXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuLyoganNoaW50IGFzaTp0cnVlICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgRHVzaCA9IHJlcXVpcmUoJ2R1c2gnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEt1ZG9zXG5cbmZ1bmN0aW9uIEt1ZG9zIChvcHRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBLdWRvcykpIHtcbiAgICByZXR1cm4gbmV3IEt1ZG9zKG9wdHMpXG4gIH1cblxuICBEdXNoLmNhbGwodGhpcylcbiAgdGhpcy5vcHRpb25zID0gdHlwZW9mIG9wdHMgPT09ICdvYmplY3QnID8gb3B0cyA6IHt9XG4gIHRoaXMuX2RlZmF1bHRzKClcbn1cblxuRHVzaC5taXhpbihLdWRvcy5wcm90b3R5cGUpXG5cbkt1ZG9zLnByb3RvdHlwZS5fZGVmYXVsdHMgPSBmdW5jdGlvbiBfZGVmYXVsdHMgKCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGlzRG9tID0gdGhpcy5fZFxuICB0aGlzLl9lbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsIHx8IHRoaXMub3B0aW9ucy5lbGVtZW50XG5cbiAgaWYgKCFpc0RvbSh0aGlzLl9lbGVtZW50KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdCBET00gYG9wdHMuZWxlbWVudGAgb3IgYG9wdHMuZWxgIGluIG9wdGlvbnMnKVxuICB9XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0IChldnQpIHtcbiAgICBzZWxmLl9lbGVtZW50ID0gc2VsZi5hZGRDbGFzcyhzZWxmLl9lbGVtZW50LCAnYWN0aXZlJylcbiAgICBzZWxmLnN0YXJ0VGltZXIoKS5lbWl0KCdrdWRvOmluJywgZXZ0KVxuICB9XG4gIHRoaXMuZW5kID0gZnVuY3Rpb24gZW5kIChldnQpIHtcbiAgICBzZWxmLl9lbGVtZW50ID0gc2VsZi5yZW1vdmVDbGFzcyhzZWxmLl9lbGVtZW50LCAnYWN0aXZlJylcbiAgICBzZWxmLnJlc2V0VGltZXIoKVxuICAgIHNlbGYuZW1pdCgna3VkbzpvdXQnLCBldnQpXG4gIH1cbiAgdGhpcy5zdGFydFRvdWNoID0gZnVuY3Rpb24gc3RhcnRUb3VjaCAoZXZ0KSB7XG4gICAgaWYgKGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gcHJldmVudCBmcm9tIHByb3BhZ2F0aW9uIGFuZCBwcmV2ZW50RGVmYXVsdC5cbiAgICAgIC8vIFNvIHdlIGNhbiB1c2UgYm90aCB0b3VjaCBldmVudHMgYW5kIG1vdXNlIGV2ZW50cy5cbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdrdWRvOmluJywgZXZ0KVxuICB9XG5cbiAgdGhpc1xuICAgIC5vbignbW91c2VvdmVyJywgdGhpcy5zdGFydCwgdGhpcy5fZWxlbWVudClcbiAgICAub24oJ21vdXNlb3V0JywgdGhpcy5lbmQsIHRoaXMuX2VsZW1lbnQpXG4gICAgLm9uKCd0b3VjaHN0YXJ0JywgdGhpcy5zdGFydFRvdWNoLCB0aGlzLl9lbGVtZW50KVxuICAgIC5vbigndG91Y2hlbmQnLCB0aGlzLmVuZCwgdGhpcy5fZWxlbWVudClcbn1cblxuS3Vkb3MucHJvdG90eXBlLnN0YXJ0VGltZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgdGltZSA9IHRoaXMub3B0aW9ucy5kdXJhdGlvbiB8fCB0aGlzLm9wdGlvbnMuZGVsYXlcbiAgdmFyIGR1cmF0aW9uID0gdHlwZW9mIHRpbWUgPT09ICdudW1iZXInID8gdGltZSA6IDE1MDBcblxuICB0aGlzLnRpbWVvdXQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fZWxlbWVudCA9IHNlbGYucmVtb3ZlQ2xhc3Moc2VsZi5fZWxlbWVudCwgJ2FjdGl2ZScpXG4gICAgc2VsZi5fZWxlbWVudCA9IHNlbGYuYWRkQ2xhc3Moc2VsZi5fZWxlbWVudCwgJ2NvbXBsZXRlJylcbiAgICBzZWxmXG4gICAgICAuZW1pdCgna3Vkbzpjb21wbGV0ZScsIHNlbGYpXG4gICAgICAucmVzZXRUaW1lcigpXG4gICAgICAub2ZmKCdtb3VzZW92ZXInLCBzZWxmLnN0YXJ0LCBzZWxmLl9lbGVtZW50KVxuICAgICAgLm9mZignbW91c2VvdXQnLCBzZWxmLmVuZCwgc2VsZi5fZWxlbWVudClcbiAgICAgIC5vZmYoJ3RvdWNoc3RhcnQnLCBzZWxmLnN0YXJ0VG91Y2gsIHNlbGYuX2VsZW1lbnQpXG4gICAgICAub2ZmKCd0b3VjaGVuZCcsIHNlbGYuZW5kLCBzZWxmLl9lbGVtZW50KVxuICB9LCBkdXJhdGlvbilcblxuICByZXR1cm4gdGhpc1xufVxuXG5LdWRvcy5wcm90b3R5cGUucmVzZXRUaW1lciA9IGZ1bmN0aW9uICgpIHtcbiAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVvdXQpXG4gIHJldHVybiB0aGlzXG59XG5cbkt1ZG9zLnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uIGFkZENsYXNzIChlbCwgbmFtZSkge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChuYW1lKVxuICB9IGVsc2Uge1xuICAgIGVsLmNsYXNzTmFtZSArPSAnICcgKyBuYW1lXG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbkt1ZG9zLnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIHJlbW92ZUNsYXNzIChlbCwgbmFtZSkge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShuYW1lKVxuICB9IGVsc2Uge1xuICAgIGVsLmNsYXNzTmFtZSA9IHJlbW92ZShlbCwgbmFtZSlcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuZnVuY3Rpb24gcmVtb3ZlIChlbCwgbmFtZSkge1xuICB2YXIgcmUgPSBuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgbmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKVxuICByZXR1cm4gZWwuY2xhc3NOYW1lLnJlcGxhY2UocmUsICcgJylcbn1cbiIsIi8qIVxuICogZHVzaCA8aHR0cHM6Ly9naXRodWIuY29tL3R1bm5ja29Db3JlL2R1c2g+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IENoYXJsaWtlIE1pa2UgUmVhZ2VudCA8QHR1bm5ja29Db3JlPiAoaHR0cDovL3d3dy50dW5uY2tvY29yZS50aylcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4vKiBqc2hpbnQgYXNpOnRydWUgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBvID0gJ291dGVySFRNTCdcbnZhciBsID0gJ0V2ZW50TGlzdGVuZXInXG52YXIgcCA9ICdwcm90b3R5cGUnXG52YXIgb3AgPSBPYmplY3RbcF1cbnZhciBoYXMgPSBvcC5oYXNPd25Qcm9wZXJ0eVxuXG5tb2R1bGUuZXhwb3J0cyA9IER1c2hcblxuZnVuY3Rpb24gRHVzaCAoJCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRHVzaCkpIHtcbiAgICByZXR1cm4gbmV3IER1c2goJClcbiAgfVxuICAkID0gJCB8fCB0aGlzXG4gICQuX2UgPSAkLl9lIHx8IHt9XG4gICQuX2QgPSBmdW5jdGlvbiAodikge1xuICAgIHYgPSBvcC50b1N0cmluZy5jYWxsKHYpXG4gICAgcmV0dXJuIC8oPzpIVE1MKT8oPzouKilFbGVtZW50L2dpLnRlc3QodilcbiAgfVxuICAkLm9uID0gZnVuY3Rpb24gKG4sIGYsIGUsIGkpIHtcbiAgICAkLl9lW25dID0gJC5fZVtuXSB8fCBbXVxuICAgICQuX2Vbbl0ucHVzaChmKVxuXG4gICAgaWYgKGUgJiYgJC5fZChlKSkge1xuICAgICAgZltvXSA9IGVbb11cbiAgICAgIGkgPSBlWydhZGQnICsgbF1cbiAgICAgIGkgPyBlWydhZGQnICsgbF0obiwgZiwgMCkgOiBlLmF0dGFjaEV2ZW50KCdvbicgKyBuLCBmKVxuICAgIH1cbiAgICByZXR1cm4gJFxuICB9XG4gICQub2ZmID0gZnVuY3Rpb24gKG4sIGYsIGUsIGkpIHtcbiAgICBpZiAoIWhhcy5jYWxsKCQuX2UsIG4pKSB7cmV0dXJuICR9XG4gICAgJC5fZVtuXS5zcGxpY2UoJC5fZVtuXS5pbmRleE9mKGYpLCAxKVxuXG4gICAgaWYgKGUgJiYgJC5fZChlKSkge1xuICAgICAgaSA9IGVbJ3JlbW92ZScgKyBsXVxuICAgICAgaSA/IGVbJ3JlbW92ZScgKyBsXShuLCBmLCAwKSA6IGUuZGV0YWNoRXZlbnQoJ29uJyArIG4sIGYpXG4gICAgfVxuICAgIHJldHVybiAkXG4gIH1cbiAgJC5vbmNlID0gZnVuY3Rpb24gKG4sIGYsIGUpIHtcbiAgICBmdW5jdGlvbiBoICgpIHtcbiAgICAgICQub2ZmKG4sIGgsIGUpXG4gICAgICByZXR1cm4gZi5hcHBseShlLCBhcmd1bWVudHMpXG4gICAgfVxuICAgIHJldHVybiAkLm9uKG4sIGgsIGUpXG4gIH1cbiAgJC5lbWl0ID0gZnVuY3Rpb24gKG4sIGEsIGUsIGksIGYsIGQpIHtcbiAgICBpZiAoIWhhcy5jYWxsKCQuX2UsIG4pKSB7cmV0dXJuICR9XG4gICAgYSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIGUgPSBhW2EubGVuZ3RoIC0gMV1cbiAgICBkID0gJC5fZChlKVxuICAgIGUgPSBkID8gZSA6ICRcbiAgICBhID0gZCA/IGEuc2xpY2UoMCwgLTEpIDogYVxuXG4gICAgZm9yIChpID0gMDsgaSA8ICQuX2Vbbl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGYgPSAkLl9lW25dW2ldXG4gICAgICBpZiAoZCAmJiBmW29dICE9PSBlW29dKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBmLmFwcGx5KGUsIGEpXG4gICAgfVxuICAgIHJldHVybiAkXG4gIH1cbn1cbkR1c2gubWl4aW4gPSBmdW5jdGlvbiAociwgcywgYywgaywgaikge1xuICBzID0gcyB8fCBEdXNoXG4gIGMgPSByLmNvbnN0cnVjdG9yXG4gIGZvciAoayBpbiBzKSBjW2tdID0gc1trXVxuICBjW3BdID0gT2JqZWN0LmNyZWF0ZShzW3BdKVxuICBmb3IgKGogaW4gcikgY1twXVtqXSA9IHJbal1cbiAgYy5fX3N1cGVyX18gPSBwW3BdXG4gIHJldHVybiBjXG59XG4iXX0=
