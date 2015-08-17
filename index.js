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
