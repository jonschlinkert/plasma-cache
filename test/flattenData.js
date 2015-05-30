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

  describe('.flattenData()', function() {
    it('should merge the value of a nested `data` property onto the root of the given object.', function() {
      var root = plasma.flattenData({data: {x: 'x'}, y: 'y', z: 'z'});
      root.should.have.property('x');
      root.should.have.property('y');
      root.should.have.property('z');
      root.should.not.have.property('data');
    });

    it('should merge the value of a nested `data` property onto the root of the given object.', function() {
      var root = plasma.flattenData({a: 'b', data: {x: 'x'}, y: 'y', z: 'z'});
      root.should.have.property('a');
      root.should.have.property('x');
      root.should.have.property('y');
      root.should.have.property('z');
      root.should.not.have.property('data');
    });
  });
});
