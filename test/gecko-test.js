var assert = require('chai').assert;
var geckos = require('../app/gecko.js');
var mongoose = require('mongoose');

// Change the database
geckos.init('mongodb://localhost/geckotracker_test', function(err) {

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
		
		describe('getGecko()', function() {
			it('should exit', function() {
				assert.isDefined(geckos.getGecko);
			});
			it('should accept an _id and return the proper gecko document as json', function(done) {
				// Add a test gecko
				geckos.addGecko({
					'id': '16M0001',
					'name': 'Roger',
					'sex': 'Male',
					'birthday': Date('6/22/2016'),
					'status': 'normal'
				}, function(err, newGecko) {
					assert.isNull(err);
					geckos.getGecko(newGecko._id, function(err, gecko) {
						assert.isNull(err);
						assert.isObject(gecko);
						assert.isEqual(newGecko._id, gecko._id);
						done();
					});
				});
			});
			it('should accept an _id and return an error if the gecko record is missing', function(done) {
				geckos.getGecko('1234', function(err, gecko) {
					assert.isNotNull(err);
					done();
				});
			});
		});

		describe('removeGecko()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.removeGecko);
			});
			it('should accept an _id and delete that document', function() {
			});
		});
		
		describe('updateGecko()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.updateGecko);
			});
		});

		describe('addGeckoEvent()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.addGeckoEvent);
			});
		});

		describe('updateGeckoEvent()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.updateGeckoEvent);
			});
		});

		describe('removeGeckoEvent()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.removeGeckoEvent);
			});
		});
	});

});
