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

  describe('.plasma()', function() {
    it('should read JSON files and return an object.', function() {
      var data = plasma.plasma('package.json');
      data.package.name.should.equal('plasma-cache');
    });

    it('should read YAML files and return an object.', function() {
      var data = plasma.plasma('test/fixtures/a.yml');
      data.should.have.property('a', {a: 'b'});
    });

    it('should read an array of YAML and JSON files and return an object.', function() {
      var data = plasma.plasma(['package.json', 'test/fixtures/a.yml']);
      data.package.name.should.equal('plasma-cache');
      data.should.have.property('a', {a: 'b'});
    });

    it('should expand a glob pattern, read JSON/YAML files and return an object.', function() {
      var data = plasma.plasma('p*.json');
      data.package.name.should.equal('plasma-cache');
    });

    it('should expand an array of glob patterns, read the JSON/YAML files and return an object.', function() {
      var data = plasma.plasma(['p*.json', 'test/fixtures/*.yml']);
      data.package.name.should.equal('plasma-cache');
      data.should.have.property('a', {a: 'b'});
    });

    it('should accept an object and return an object.', function() {
      var data = plasma.plasma({a: 'b'});
      data.a.should.equal('b');
    });
  });
});
