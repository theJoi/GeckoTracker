/*jshint browser: false, node: true*/
/*
|--------------------------------------------------------------------------
| app/tools/populate-databse.js
|--------------------------------------------------------------------------
| Populates database with sample gecko information for testing purposes.
|
| Created June 2016 by Joi W.
|__________________________________________________________________________
*/
var geckos = require("../gecko.js");
var async = require("async");

var fs = require("fs");
var entries = JSON.parse(fs.readFileSync("export.json"));

// Create a list of all the geckos
var geckoList = {};
for(var x in entries) {
	var entry = entries[x];
	if(entry.name) {
		var gecko = {
			userId: '' + entry.id,
			name: entry.name,
			sex: entry.sex == 'Male' ? 'male' : 'female',
			morph: entry.morphGenetics,
			stage: 'adult',
			birthdate: new Date(entry.born),
			status: 'normal'
		};
		//geckoList.append(currentGecko);
		geckoList[gecko.userId] = gecko;
		console.log(gecko);
	}
}

// Create a list of events
var eventList = [];
var geckoId = "";
for(var x in entries) {
	var entry = entries[x];
	var date = entry.date;
	var type = entry.event;
	var weight = entry.weightG ? entry.weightG : 0;
	var notes = entry.notes ? entry.notes : null;

	if(entry.name) geckoId = entry.id + "";
	var event = {
		date: new Date(date),
		geckoId: geckoId
	};
	if(notes)
		event.notes = notes;
	
	switch(type) {
		case 'Weighed':
			event.type = 'weight';
			event.info = { weight: weight };
			geckoList[geckoId].currWeight = weight;
			break;
		case 'Shed':
			event.type = 'shed';
			break;
		case 'Laid':
			event.type = 'clutch';
			break;
		case 'Bred':
			event.type = 'copulate';
			break;
		case 'Acquired':
			event.type = 'purchase';
			geckoList[geckoId].purchaseDate = new Date(date);
			break;
		case 'Hatched':
			event.type = 'hatch';
			break;
		case 'Note':
			event.type = 'note';
			break;
		case 'Cleaned':
			continue;
		default:
			console.log("Unknown event '" + type + "'");
			break;
	}
	
  	console.log(event);
	eventList.push(event);
}

geckos.init(null, function() {
	geckos.dropCollection(function() {
		console.log("DROPPED");
		async.each(geckoList, function(gecko, callback) {
			console.log("Adding " + gecko.name);
			geckos.addGecko(gecko, function(err, newGecko) {
				console.log("Added " + newGecko.name + " " + newGecko._id);
				if(err) {
					console.log(err);
					callback();
					return;
				}
				geckoList[gecko.userId] = newGecko;
				callback();
			});
		}, function(err) {
			console.log("Done adding geckos", err);
			
			async.each(eventList, function(event, callback) {
				event.geckoId = geckoList[event.geckoId]._id;
				console.log("Adding event for " + event.geckoId);
				geckos.addEvent(event, function(err, newEvent) {
					if(err) {
						console.log("Error adding " + JSON.stringify(event));
						console.log(err);
						callback();
						return;
					}
					console.log("Added event " + newEvent._id);
					callback();
				});
			}, function(err) {
				console.log("DONE");
				process.exit();
			});
		});
	});
});

// Empty collection first then run function to add geckos
//geckos.init(null, function () {
//	 geckos.dropCollection(function () {
//		 addTestGeckos();
//	 });
//});

