var assert = require('chai').assert;

var geckos = require('../geckos.js');

describe('geckos', function() {
	describe('getGeckos()', function() {
		it('should exist', function() {
			assert.isDefined(geckos.getGeckos);
		});
		it('should return an empty array initially', function() {
			var result = geckos.getGeckos();
			assert.isArray(result);
			assert.equal(result.length, 0);
		});
	});
	describe('addGecko()', function() {
		it('should exist', function() {
			assert.isDefined(geckos.addGecko);
		});
		it('should return true when successfully adding a gecko', function() {
			var gecko = {
				'id': '16M0001',
				'name': 'Roger',
				'sex': 'Male',
				'birthday': Date('6/22/2016')
			};
			assert.equal(geckos.addGecko(gecko), true);
			assert.equal(geckos.getGeckos().length, 1);
		});
		it('should return false when the argument isn\'t an object', function() {
			assert.equal(geckos.addGecko(42), false);
		});
		it('should return false when the required fields are missing', function() {
			var gecko = {
				'foo': 'bar'
			};
			assert.equal(geckos.addGecko(gecko), false);
		});
		it('should add a gecko (persistently)', function() {
			var result = geckos.getGeckos();
			assert.isArray(result);
			assert.equal(result.length, 0);
			assert.isObject(result[0]);
			assert.equal(result[0].id, '16M0001');
		});
	});
	describe('removeGecko()', function() {
		it('should exist', function() {
			assert.isDefined(geckos.removeGecko);
		});
	});
});
