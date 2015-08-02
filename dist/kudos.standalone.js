(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Kudos = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  this.defaults()
}

Dush.mixin(Kudos.prototype)

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
  var isDom = this._d
  this._element = this.options.el || this.options.element

  if (!isDom(this._element)) {
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
  var time = this.options.duration
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
      i ? i(n, f, 0) : e.attachEvent('on' + n, f)
    }
    return $
  }
  $.off = function (n, f, e, i) {
    if (!has.call($._e, n)) {return $}
    $._e[n].splice($._e[n].indexOf(f), 1)

    if (e && $._d(e)) {
      i = e['remove' + l]
      i ? i(n, f, 0) : e.detachEvent('on' + n, f)
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
  $.mixin = function (r, s, c, k, j) {
    s = s || $
    c = r.constructor
    for (k in s) c[k] = s[k]
    c[p] = Object.create(s[p])
    for (j in r) c[p][j] = r[j]
    c.__super__ = p[p]
    return c
  }
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvaW8uanMvdjIuNC4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvZHVzaC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBrdWRvcyA8aHR0cHM6Ly9naXRodWIuY29tL3R1bm5ja29Db3JlL2t1ZG9zPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBDaGFybGlrZSBNaWtlIFJlYWdlbnQgPEB0dW5uY2tvQ29yZT4gKGh0dHA6Ly93d3cudHVubmNrb2NvcmUudGspXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBEdXNoID0gcmVxdWlyZSgnZHVzaCcpXG5cbm1vZHVsZS5leHBvcnRzID0gS3Vkb3NcblxuZnVuY3Rpb24gS3Vkb3MgKG9wdHMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEt1ZG9zKSkge1xuICAgIHJldHVybiBuZXcgS3Vkb3Mob3B0cylcbiAgfVxuXG4gIER1c2guY2FsbCh0aGlzKVxuICB0aGlzLm9wdGlvbnMgPSB0eXBlb2Ygb3B0cyA9PT0gJ29iamVjdCcgPyBvcHRzIDoge31cbiAgdGhpcy5kZWZhdWx0cygpXG59XG5cbkR1c2gubWl4aW4oS3Vkb3MucHJvdG90eXBlKVxuXG5LdWRvcy5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiBhZGRDbGFzcyAoZWwsIG5hbWUpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQobmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgbmFtZVxuICB9XG4gIHJldHVybiBlbFxufVxuXG5LdWRvcy5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyAoZWwsIG5hbWUpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUobmFtZSlcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgbmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKVxuICB9XG4gIHJldHVybiBlbFxufVxuXG5LdWRvcy5wcm90b3R5cGUuZGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgaXNEb20gPSB0aGlzLl9kXG4gIHRoaXMuX2VsZW1lbnQgPSB0aGlzLm9wdGlvbnMuZWwgfHwgdGhpcy5vcHRpb25zLmVsZW1lbnRcblxuICBpZiAoIWlzRG9tKHRoaXMuX2VsZW1lbnQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhwZWN0IERPTSBlbGVtZW50JylcbiAgfVxuXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiBzdGFydCAoZXZ0KSB7XG4gICAgc2VsZi5fZWxlbWVudCA9IHNlbGYuYWRkQ2xhc3Moc2VsZi5fZWxlbWVudCwgJ2FjdGl2ZScpXG4gICAgc2VsZi5zdGFydFRpbWVyKCkuZW1pdCgna3VkbzppbicsIGV2dClcbiAgfVxuICB0aGlzLmVuZCA9IGZ1bmN0aW9uIGVuZCAoZXZ0KSB7XG4gICAgc2VsZi5fZWxlbWVudCA9IHNlbGYucmVtb3ZlQ2xhc3Moc2VsZi5fZWxlbWVudCwgJ2FjdGl2ZScpXG4gICAgc2VsZi5yZXNldFRpbWVyKCkuZW1pdCgna3VkbzpvdXQnLCBldnQpXG4gIH1cbiAgdGhpcy5zdGFydFRvdWNoID0gZnVuY3Rpb24gc3RhcnRUb3VjaCAoZXZ0KSB7XG4gICAgaWYgKGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gcHJldmVudCBmcm9tIHByb3BhZ2F0aW9uIGFuZCBwcmV2ZW50RGVmYXVsdC5cbiAgICAgIC8vIFNvIHdlIGNhbiB1c2UgYm90aCB0b3VjaCBldmVudHMgYW5kIG1vdXNlIGV2ZW50cy5cbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdrdWRvOmluJywgZXZ0KVxuICB9XG5cbiAgdGhpc1xuICAgIC5vbignbW91c2VvdmVyJywgdGhpcy5zdGFydCwgdGhpcy5fZWxlbWVudClcbiAgICAub24oJ21vdXNlb3V0JywgdGhpcy5lbmQsIHRoaXMuX2VsZW1lbnQpXG4gICAgLm9uKCd0b3VjaHN0YXJ0JywgdGhpcy5zdGFydFRvdWNoLCB0aGlzLl9lbGVtZW50KVxuICAgIC5vbigndG91Y2hlbmQnLCB0aGlzLmVuZCwgdGhpcy5fZWxlbWVudClcbn1cblxuS3Vkb3MucHJvdG90eXBlLnN0YXJ0VGltZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgdGltZSA9IHRoaXMub3B0aW9ucy5kdXJhdGlvblxuICB2YXIgZHVyYXRpb24gPSB0eXBlb2YgdGltZSA9PT0gJ251bWJlcicgPyB0aW1lIDogMTUwMFxuXG4gIHRoaXMudGltZW91dCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9lbGVtZW50ID0gc2VsZi5yZW1vdmVDbGFzcyhzZWxmLl9lbGVtZW50LCAnYWN0aXZlJylcbiAgICBzZWxmLl9lbGVtZW50ID0gc2VsZi5hZGRDbGFzcyhzZWxmLl9lbGVtZW50LCAnY29tcGxldGUnKVxuICAgIHNlbGZcbiAgICAgIC5lbWl0KCdrdWRvOmNvbXBsZXRlJywgc2VsZilcbiAgICAgIC5yZXNldFRpbWVyKClcbiAgICAgIC5vZmYoJ21vdXNlb3ZlcicsIHNlbGYuc3RhcnQsIHNlbGYuX2VsZW1lbnQpXG4gICAgICAub2ZmKCdtb3VzZW91dCcsIHNlbGYuZW5kLCBzZWxmLl9lbGVtZW50KVxuICAgICAgLm9mZigndG91Y2hzdGFydCcsIHNlbGYuc3RhcnRUb3VjaCwgc2VsZi5fZWxlbWVudClcbiAgICAgIC5vZmYoJ3RvdWNoZW5kJywgc2VsZi5lbmQsIHNlbGYuX2VsZW1lbnQpXG4gIH0sIGR1cmF0aW9uKVxuXG4gIHJldHVybiB0aGlzXG59XG5cbkt1ZG9zLnByb3RvdHlwZS5yZXNldFRpbWVyID0gZnVuY3Rpb24gKCkge1xuICBjbGVhckludGVydmFsKHRoaXMudGltZW91dClcbiAgcmV0dXJuIHRoaXNcbn1cbiIsIi8qIVxuICogZHVzaCA8aHR0cHM6Ly9naXRodWIuY29tL3R1bm5ja29Db3JlL2R1c2g+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IENoYXJsaWtlIE1pa2UgUmVhZ2VudCA8QHR1bm5ja29Db3JlPiAoaHR0cDovL3d3dy50dW5uY2tvY29yZS50aylcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4vKiBqc2hpbnQgYXNpOnRydWUgKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBvID0gJ291dGVySFRNTCdcbnZhciBsID0gJ0V2ZW50TGlzdGVuZXInXG52YXIgcCA9ICdwcm90b3R5cGUnXG52YXIgb3AgPSBPYmplY3RbcF1cbnZhciBoYXMgPSBvcC5oYXNPd25Qcm9wZXJ0eVxuXG5tb2R1bGUuZXhwb3J0cyA9IER1c2hcblxuZnVuY3Rpb24gRHVzaCAoJCkge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRHVzaCkpIHtcbiAgICByZXR1cm4gbmV3IER1c2goJClcbiAgfVxuICAkID0gJCB8fCB0aGlzXG4gICQuX2UgPSAkLl9lIHx8IHt9XG4gICQuX2QgPSBmdW5jdGlvbiAodikge1xuICAgIHYgPSBvcC50b1N0cmluZy5jYWxsKHYpXG4gICAgcmV0dXJuIC8oPzpIVE1MKT8oPzouKilFbGVtZW50L2dpLnRlc3QodilcbiAgfVxuICAkLm9uID0gZnVuY3Rpb24gKG4sIGYsIGUsIGkpIHtcbiAgICAkLl9lW25dID0gJC5fZVtuXSB8fCBbXVxuICAgICQuX2Vbbl0ucHVzaChmKVxuXG4gICAgaWYgKGUgJiYgJC5fZChlKSkge1xuICAgICAgZltvXSA9IGVbb11cbiAgICAgIGkgPSBlWydhZGQnICsgbF1cbiAgICAgIGkgPyBpKG4sIGYsIDApIDogZS5hdHRhY2hFdmVudCgnb24nICsgbiwgZilcbiAgICB9XG4gICAgcmV0dXJuICRcbiAgfVxuICAkLm9mZiA9IGZ1bmN0aW9uIChuLCBmLCBlLCBpKSB7XG4gICAgaWYgKCFoYXMuY2FsbCgkLl9lLCBuKSkge3JldHVybiAkfVxuICAgICQuX2Vbbl0uc3BsaWNlKCQuX2Vbbl0uaW5kZXhPZihmKSwgMSlcblxuICAgIGlmIChlICYmICQuX2QoZSkpIHtcbiAgICAgIGkgPSBlWydyZW1vdmUnICsgbF1cbiAgICAgIGkgPyBpKG4sIGYsIDApIDogZS5kZXRhY2hFdmVudCgnb24nICsgbiwgZilcbiAgICB9XG4gICAgcmV0dXJuICRcbiAgfVxuICAkLm9uY2UgPSBmdW5jdGlvbiAobiwgZiwgZSkge1xuICAgIGZ1bmN0aW9uIGggKCkge1xuICAgICAgJC5vZmYobiwgaCwgZSlcbiAgICAgIHJldHVybiBmLmFwcGx5KGUsIGFyZ3VtZW50cylcbiAgICB9XG4gICAgcmV0dXJuICQub24obiwgaCwgZSlcbiAgfVxuICAkLmVtaXQgPSBmdW5jdGlvbiAobiwgYSwgZSwgaSwgZiwgZCkge1xuICAgIGlmICghaGFzLmNhbGwoJC5fZSwgbikpIHtyZXR1cm4gJH1cbiAgICBhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgZSA9IGFbYS5sZW5ndGggLSAxXVxuICAgIGQgPSAkLl9kKGUpXG4gICAgZSA9IGQgPyBlIDogJFxuICAgIGEgPSBkID8gYS5zbGljZSgwLCAtMSkgOiBhXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgJC5fZVtuXS5sZW5ndGg7IGkrKykge1xuICAgICAgZiA9ICQuX2Vbbl1baV1cbiAgICAgIGlmIChkICYmIGZbb10gIT09IGVbb10pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGYuYXBwbHkoZSwgYSlcbiAgICB9XG4gICAgcmV0dXJuICRcbiAgfVxuICAkLm1peGluID0gZnVuY3Rpb24gKHIsIHMsIGMsIGssIGopIHtcbiAgICBzID0gcyB8fCAkXG4gICAgYyA9IHIuY29uc3RydWN0b3JcbiAgICBmb3IgKGsgaW4gcykgY1trXSA9IHNba11cbiAgICBjW3BdID0gT2JqZWN0LmNyZWF0ZShzW3BdKVxuICAgIGZvciAoaiBpbiByKSBjW3BdW2pdID0gcltqXVxuICAgIGMuX19zdXBlcl9fID0gcFtwXVxuICAgIHJldHVybiBjXG4gIH1cbn1cbiJdfQ==
