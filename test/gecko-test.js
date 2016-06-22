<<<<<<< HEAD:test/test.js
var assert = require('chai').assert;
var geckos = require('../geckos.js');
var mongoose = require('mongoose');

// Change the database
//geckos.init('mongodb://localhost/geckotracker_test', function(err) {
geckos.init(null, function(err) {
	describe('geckos', function() {
		describe('getGeckos()', function() {
			before(function() {
				mongoose.connection.db.dropDatabase();
			});
			after(function() {
				mongoose.connection.db.dropDatabase();
			});

			it('should exist', function() {
				assert.isDefined(geckos.getGeckos);
			});
			it('should return an empty array initially', function(done) {
				geckos.getGeckos(function(err, result) {
					assert.isArray(result);
					assert.equal(result.length, 0);
					done(err);
				});
			});
		});
	
		describe('addGecko()', function() {
			before(function() {
				mongoose.connection.db.dropDatabase();
			});
			after(function() {
				mongoose.connection.db.dropDatabase();
			});

			it('should exist', function() {
				assert.isDefined(geckos.addGecko);
			});
			it('should give no error when successfully adding a gecko', function(done) {
				var gecko = {
					'id': '16M0001',
					'name': 'Roger',
					'sex': 'Male',
					'birthday': Date('6/22/2016'),
					'status': 'normal'
				};
				geckos.addGecko(gecko, function(err) {
					assert.isNotOk(err);
					done();
				});
			});
			it('should give an error when the argument isn\'t an object', function(done) {
				geckos.addGecko(42, function(err) {
					assert.isOk(err);
					done();
				})
			});
			it('should give an error when required properties are missing', function(done) {
				var gecko = {
					'foo': 'bar'
				};
				geckos.addGecko(gecko, function(err) {
					assert.isOk(err);
					done();
				});
			});
			it('should make added geckos persistent', function(done) {
				geckos.getGeckos(function(err, result) {
					assert.isArray(result);
					assert.equal(result.length, 1);
					assert.isObject(result[0]);
					assert.equal(result[0].name, 'Roger');
					done();
				});
			});
		});

		describe('removeGecko()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.removeGecko);
			});
		});
	});

});
=======
var assert = require('chai').assert;
var geckos = require('../app/gecko.js');
var mongoose = require('mongoose');

// Change the database
//geckos.init('mongodb://localhost/geckotracker_test', function(err) {
geckos.init(null, function(err) {

	describe('geckos', function() {
		describe('getGeckos()', function() {
			before(function() {
				mongoose.connection.db.dropDatabase();
			});
			after(function() {
				mongoose.connection.db.dropDatabase();
			});

			it('should exist', function() {
				assert.isDefined(geckos.getGeckos);
			});
			it('should return an empty array initially', function(done) {
				geckos.getGeckos(function(err, result) {
					assert.isArray(result);
					assert.equal(result.length, 0);
					done(err);
				});
			});
		});

		describe('addGecko()', function() {
			before(function() {
				mongoose.connection.db.dropDatabase();
			});
			after(function() {
				mongoose.connection.db.dropDatabase();
			});

			it('should exist', function() {
				assert.isDefined(geckos.addGecko);
			});
			it('should give no error when successfully adding a gecko', function(done) {
				var gecko = {
					'id': '16M0001',
					'name': 'Roger',
					'sex': 'Male',
					'birthday': Date('6/22/2016'),
					'status': 'normal'
				};
				geckos.addGecko(gecko, function(err) {
					assert.isNotOk(err);
					done();
				});
			});
			it('should give an error when the argument isn\'t an object', function(done) {
				geckos.addGecko(42, function(err) {
					assert.isOk(err);
					done();
				})
			});
			it('should give an error when required properties are missing', function(done) {
				var gecko = {
					'foo': 'bar'
				};
				geckos.addGecko(gecko, function(err) {
					assert.isOk(err);
					done();
				});
			});
			it('should make added geckos persistent', function(done) {
				geckos.getGeckos(function(err, result) {
					assert.isArray(result);
					assert.equal(result.length, 1);
					assert.isObject(result[0]);
					assert.equal(result[0].name, 'Roger');
					done();
				});
			});
		});

		describe('removeGecko()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.removeGecko);
			});
		});
	});

});
>>>>>>> f0eed731c6bf7d15742b6668f6e0b862a80cb74b:test/gecko-test.js
