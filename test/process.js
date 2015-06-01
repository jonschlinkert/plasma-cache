/*!
 * plasma-cache <https://github.com/jonschlinkert/plasma-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
var should = require('should');
var PlasmaCache = require('..');
var plasma;


describe('plasma process', function () {
  beforeEach(function() {
    plasma = new PlasmaCache({plasma: require('plasma')});
    plasma.cache.data = {};
  });

  describe('.process()', function () {
    it('should resolve template strings in plasma values', function () {
      var store = plasma.process({a: '<%= b %>', b: 'c'});
      store.a.should.equal('c');
    });

    it('should process the cache when no arguments are passed', function () {
      plasma.data({a: '${b}', b: '${c}', c: 'DONE'});
      plasma.cache.data.a.should.equal('${b}');
      plasma.cache.data.b.should.equal('${c}');
      plasma.cache.data.c.should.equal('DONE');

      plasma.process();

      plasma.cache.data.a.should.equal('DONE');
      plasma.cache.data.b.should.equal('DONE');
      plasma.cache.data.c.should.equal('DONE');
    });

    it('should resolve es6 template strings in plasma values', function () {
      var store = plasma.process({a: '${b}', b: 'c'});
      store.a.should.equal('c');
    });

    it('should recursively resolve template strings.', function () {
      var store = plasma.process({
        a: '${b}',
        b: '${c}',
        c: '${d}',
        d: '${e.f.g}',
        e: {f:{g:'h'}}});
      store.a.should.equal('h');
    });

    describe('when functions are defined on the plasma', function() {
      it('should used them on plasma templates', function() {
        plasma.data({
          upper: function (str) {
            return str.toUpperCase();
          }
        });

        plasma.data({fez: 'bang', pop: 'boom-pow!'});
        plasma.data({whistle: '<%= upper(fez) %>-<%= upper(pop) %>'});
        plasma.cache.data.whistle.should.equal('<%= upper(fez) %>-<%= upper(pop) %>');

        var a = plasma.process(plasma.cache.data.whistle, plasma.cache.data);
        a.should.equal('BANG-BOOM-POW!');

        var b = plasma.process(plasma.cache.data, plasma.cache.data);
        b.whistle.should.equal('BANG-BOOM-POW!');
      });
    });
  });
});
