/*!
 * plasma-cache <https://github.com/jonschlinkert/plasma-cache>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Emitter = require('component-emitter');
var expander = require('expander');
var extend = require('extend-shallow');
var functions = require('filter-functions');
var Plasma = require('plasma');
var omit = require('object.omit');

/**
 * Initialize a new `PlasmaCache`.
 *
 * @api public
 */

function PlasmaCache(obj) {
  Emitter.call(this);
  this._plasma = new Plasma();
  this.cache = {data: {}};
  if (obj) mixin(obj);
}

Emitter(PlasmaCache.prototype);

/**
 * Mix PlasmaCache properties into `obj`
 *
 * @param {Object} obj
 * @return {Object}
 */

function mixin(obj) {
  for (var key in PlasmaCache.prototype) {
    obj[key] = PlasmaCache.prototype[key];
  }
  return obj;
}

/**
 * Extend the `data` object with the value returned by [plasma].
 *
 * See the [plasma][] documentation for all available options.
 *
 * @param {Object|String|Array} `data` File path(s), glob pattern, or object of data.
 * @param {Object} `options` Options to pass to plasma.
 * @api public
 */

PlasmaCache.prototype.plasma = function() {
  return this._plasma.load.apply(this._plasma, arguments);
};

/**
 * Register a `dataLoader` that will read and load data from
 * files with the given `ext`.
 *
 * ```js
 * var fs = require('fs');
 * var yaml = require('js-yaml');
 *
 * plasma.dataLoader('yml', function (fp) {
 *   var str = fs.readFileSync(fp, 'utf8');
 *   return yaml.safeLoad(str);
 * });
 * ```
 *
 * @param {String} `ext` The extension of files to read.
 * @param {String} `fn` The loader function
 * @api public
 */

PlasmaCache.prototype.dataLoader = function() {
  return this._plasma.loader.apply(this._plasma, arguments);
};

/**
 * Use [expander][] to recursively expand template strings into
 * their resolved values.
 *
 * @param {*} `lookup` Any value to process, usually strings with a cache template, like `<%= foo %>` or `${foo}`.
 * @param {*} `opts` Options to pass to Lo-Dash `_.template`.
 * @api public
 */

PlasmaCache.prototype.process = function(lookup, context) {
  context = context || lookup || this.cache.data;
  lookup = lookup || context;
  var len = arguments.length;
  if (len === 2) {
    context = extend({}, context, lookup);
  }
  var res = expander.process(context, lookup, {
    imports: functions(context)
  });
  if (!len) extend(this.cache.data, res);
  this.emit('processData');
  return res;
};

/**
 * If a `data` property is on the given `data` object
 * (e.g. `data.data`, like when files named `data.json`
 * or `data.yml` are used), `data.data` is flattened to
 * just `data`
 *
 * @param {Object} `data`
 * @return {Object} Flattened object.
 * @api public
 */

PlasmaCache.prototype.flattenData = function(data) {
  if (!data.hasOwnProperty('data')) return data;
  return extend(omit(data, ['data']), data.data);
};

/**
 * Extend the `cache.data` object with the given data. This
 * method is chainable.
 *
 * @chainable
 * @return {Object} `PlasmaCache` to enable chaining
 * @api public
 */

PlasmaCache.prototype.extendData = function() {
  var len = arguments.length;
  var args = new Array(len);
  var data = {};
  for (var i = 0; i < len; i++) {
    args[i] = arguments[i];
  }
  if (typeof args[0] === 'string') {
    data[args.shift()] = extend.apply(extend, args);
  } else {
    data = extend.apply(extend, [data].concat(args));
  }
  extend(this.cache.data, data);
  this.emit('extendData');
  return this;
};

/**
 * Extend the `cache.data` object with data from a JSON
 * or YAML file, or by passing an object directly - glob
 * patterns or file paths may be used.
 *
 * @param {Object|Array|String} `values` Values to pass to plasma.
 * @param {Boolean} `process` If `true` is passed as the last argumemnt data will
be processed by [expander] before extending `cache.data`.
 * @return {Object} `PlasmaCache` to enable chaining
 * @api public
 */

PlasmaCache.prototype.data = function() {
  var len = arguments.length;
  var args = new Array(len);

  for (var i = 0; i < len; i++) {
    args[i] = arguments[i];
  }

  if (!len) return this.cache.data;
  var o = {}, last;

  // 1) when the last arg is strictly `true`...
  if (typeof args[len - 1] === 'boolean') {
    last = args[len - 1];
    args = args.slice(1);
  }

  extend(o, this.plasma.apply(this, args));
  o = this.flattenData(o);

  // 2) process data with expander
  if (last) {
    this.extendData(this.process(o));
    return this;
  }

  this.extendData(o);
  this.emit('data');
  return this;
};

/**
 * Expose `PlasmaCache`
 */

module.exports = PlasmaCache;
