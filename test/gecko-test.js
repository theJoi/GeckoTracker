var assert = require('chai').assert;
var geckos = require('../app/gecko.js');
var mongoose = require('mongoose');

// Change the database
geckos.init('mongodb://localhost/geckotracker_test', function(err) {

	var testGeckoProperties = {
		'id': '16M0001',
		'name': 'Roger',
		'sex': 'Male',
		'birthday': Date('6/22/2016'),
		'status': 'normal'
	};

	describe('geckos', function() {
		beforeEach(function() {
			mongoose.connection.db.dropDatabase();
		});
		afterEach(function() {
			mongoose.connection.db.dropDatabase();
		});

		describe('getGeckos()', function() {
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
				var gecko = {
					'id': '16M0001',
					'name': 'Roger',
					'sex': 'Male',
					'birthday': Date('6/22/2016'),
					'status': 'normal'
				};
				geckos.addGecko(gecko, function(err) {
					assert.isNull(err);
					geckos.getGeckos(function(err, result) {
						assert.isArray(result);
						assert.lengthOf(result, 1);
						assert.isObject(result[0]);
						assert.propertyVal(result[0], 'name', 'Roger');
						done();
					});
				});
			});
		});
		
		describe('getGecko()', function() {
			it('should exist', function() {
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
						/*
						assert.isNull(err);
						assert.isObject(gecko);
						console.log("!!!!!!!!!!!!", gecko);
						assert.isEqual(newGecko._id, gecko._id);
						*/
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
			it('should accept an _id and delete that document', function(done) {
				// Add a gecko
				var gecko = {
					'id': '16M0001',
					'name': 'Roger',
					'sex': 'Male',
					'birthday': Date('6/22/2016'),
					'status': 'normal'
				};
				geckos.addGecko(gecko, function(err) {
					assert.isNull(err);
					geckos.getGeckos(function(err, result) {
						assert.isArray(result);
						assert.lengthOf(result, 1);
						assert.propertyVal(result[0], 'name', 'Roger');
						geckos.removeGecko(result[0]._id, function(err) {
							assert.isNull(err);
							geckos.getGeckos(function(err, result) {
								assert.isArray(result);
								assert.lengthOf(result, 0);
								done();
							});
						});
					});
				});
			});
			it('should return an error if the _id doesn\'t exist', function(done) {
				geckos.removeGecko("1234", function(err) {
					assert.isNotNull(err);
					done();
				})
			});
		});
		
		describe('updateGecko()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.updateGecko);
			});
			it("should properly update a gecko\'s properties", function(done) {
				geckos.addGecko(jQuery.extend({}, roger), function(err, gecko) {
					geckos.updateGecko(gecko._id, {status: 'dead'}, function(err, updatedGecko) {
						assert.isNull(err);
						assert.propertyVal(updatedGecko, '_id', gecko._id)
						assert.property(updatedGecko, 'status');
						assert.propertyVal(updatedGecko, 'status', 'dead');
						done();
					});
				});
			});
			it("should give an error if the gecko can't be found (and the return gecko should be null)", function(done) {
				geckos.updateGecko(gecko._id, {status: 'dead'}, function(err, gecko) {
					assert.isNotNull(err);
					assert.isNull(gecko);
				});
			});
			it("should give an error if trying to update a property not defined the gecko data model", function(done) {
				geckos.addGecko(jQuery.extend({}, roger), function(err, gecko) {
					geckos.updateGecko(gecko._id, {foo: 'bar'}, function(err, updatedGecko) {
						assert.isNotNull(err);
						assert.isNull(updatedGecko);
						done();
					});
				});
			});
		});

		describe('getGeckoEvents()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.addGeckoEvent);
			});
			it("should return an empty array if no events have been added", function(done) {
				// Add Roger
				geckos.addGecko(jQuery.extend({}, roger), function(err, gecko) {
					geckos.getGeckoEvents(gecko._id, function(err, events) {
						assert.isArray(events);
						assert.lengthOf(events, 0);
						done();
					});
				});
			});
			it("should return all events for the given gecko", function(done) {
				// Add Roger
				geckos.addGecko(jQuery.extend({}, roger), function(err, gecko) {
					geckos.addGeckoEvent({type: 'weighed', value: 42}, function(err) {
						geckos.getGeckoEvents(gecko._id, function(err, events) {
							assert.isArray(events);
							assert.lengthOf(events, 1);
							assert.isObject(events[0]);
							assert.propertyVal(events[0], 'type', 'weighed');
							assert.propertyVal(events[0], 'value', 64);
							done();
						});
					});
				});
			});
		});

		describe('addGeckoEvent()', function() {
			it('should exist', function() {
				assert.isDefined(geckos.addGeckoEvent);
			});
			it('should set the event date property to the current date if none is given', function(done) {
				geckos.addGecko(jQuery.extend({}, roger), function(err, gecko) {
					geckos.addGeckoEvent({type: 'weighed', value: 42}, function(err, event) {
						assert.isObject(event);
						assert.property(events, 'date');
						done();
					});
				});
			});
			it("shouldn't set the event date property to the current date if one is given", function(done) {
				geckos.addGecko(jQuery.extend({}, roger), function(err, gecko) {
					geckos.addGeckoEvent({date: new Date('3/5/2014'), type: 'weighed', value: 42}, function(err, event) {
						assert.isObject(event);
						assert.property(events, 'date');
						assert.equal(events.date.month, 3);
						assert.equal(events.date.year, 2014);
						assert.equal(events.date.day, 5);
						done();
					});
				});
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
