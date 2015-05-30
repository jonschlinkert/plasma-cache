/*!
 * plasma-cache <https://github.com/jonschlinkert/plasma-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps: mocha */
var should = require('should');
var Plasma = require('..');
var plasma;

describe('plasma data', function() {
  beforeEach(function() {
    plasma = new Plasma();
  });

  describe('.extendData()', function() {
    it('should extend the `data` object.', function() {
      plasma
        .extendData({x: 'x', y: 'y', z: 'z'})
        .extendData({a: 'a', b: 'b', c: 'c'});

      plasma.cache.data.should.have.property('a');
      plasma.cache.data.should.have.property('b');
      plasma.cache.data.should.have.property('c');

      plasma.cache.data.should.have.property('x');
      plasma.cache.data.should.have.property('y');
      plasma.cache.data.should.have.property('z');
    });

    it('should extend the `data` object when the first param is a string.', function() {
      plasma
        .extendData('foo', {x: 'x', y: 'y', z: 'z'})
        .extendData('bar', {a: 'a', b: 'b', c: 'c'});

      plasma.cache.data.should.have.property('foo');
      plasma.cache.data.should.have.property('bar');

      plasma.cache.data.foo.should.have.property('x');
      plasma.cache.data.bar.should.have.property('a');

      plasma.cache.data.foo.should.have.property('x');
      plasma.cache.data.bar.should.have.property('a');
    });
  });
});
