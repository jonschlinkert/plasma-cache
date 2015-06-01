/*!
 * plasma-cache <https://github.com/jonschlinkert/plasma-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps: mocha */
var should = require('should');
var PlasmaCache = require('..');
var plasma;

describe('plasma data', function() {
  beforeEach(function() {
    plasma = new PlasmaCache({plasma: require('plasma')});
  });

  describe('.data()', function() {
    it('should read files and merge data onto `plasma.data`', function() {
      plasma.data('package.json');
      plasma.cache.data.package.name.should.equal('plasma-cache');
    });

    it('should read files and merge data onto `plasma.data`', function() {
      plasma.data({xyz: 'abc'});
      plasma.cache.data.xyz.should.equal('abc');
    });

    it('should merge an array of objects onto `plasma.data`', function() {
      plasma.data([{aaa: 'bbb', ccc: 'ddd'}]);
      plasma.cache.data.aaa.should.equal('bbb');
      plasma.cache.data.ccc.should.equal('ddd');
    });
  });
});
