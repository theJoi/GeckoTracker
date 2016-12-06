/*jshint browser: false, node: true*/
/*
|--------------------------------------------------------------------------
| app/gecko.js
|--------------------------------------------------------------------------
| Define Mongoose model and handles creating, reading, updating,
| and deleteing geckos from the database.
|
| Created June 2016 by Joi W.
|__________________________________________________________________________
*/


// CONNECTION EVENTS  =====================================================
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var exif = require('exif');

exports.init = function (db, callback) {
    if (!db) {
        db = "mongodb://localhost/geckotracker";
    }
    mongoose.connect(db);
    mongoose.connection.on('error', function (err) {
        callback(err);
    });
    mongoose.connection.once('open', function () {
        console.log("Database initilized.");
        callback(null);
    });
};


// SCHEMAS  ============++++===============================================
var geckoSchema = new Schema({
    name: {
        type: String, // Name of gecko
        required: true
    },
    userId: String, // External ID number
    stage: String, // {egg, hatchling, or adult}
    status: String, // Options are {normal/gravid/egg/sold/dead}
    sex: String, // Female/ Male/ Unknown
    morph: String, // Gecko's morph type
    location: String, // Current location of gecko
    purchaseDate: Date,
    hatchDate: Date,
	laidDate: Date,
    mother: {
        _id: Schema.Types.ObjectId,
        userId: String,
        name: String
    },
    father: {
        _id: Schema.Types.ObjectId,
        userId: String,
        name: String
    },
    currWeight: Number,
    notes: String,
	primaryPhoto: Schema.Types.Mixed
});

var eventSchema = new Schema({
    geckoId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    info: Schema.Types.Mixed,
    warning: Date,
    notes: String
});

var photoSchema = new Schema({
	geckoId: {
        type: Schema.Types.ObjectId,
        required: true
	},
	path: String,
	name: String,
	mimetype: String,
	uploaded: Date,
	taken: Date,
	caption: String
});

var notificationSchema = new Schema({
	gecko: { type: Schema.Types.ObjectId },
	created: Date,
	trigger: String,
	date: Date,
	message: String,
	enabled: Boolean,
	lastTriggered: Date,
	days: Number,
	event: String
});

// MONGOOSE MODELS  =============================================================
var Gecko = mongoose.model("Gecko", geckoSchema);
var Event = mongoose.model("Event", eventSchema);
var Photo = mongoose.model("Photo", photoSchema);
var Notification = mongoose.model("Notification", notificationSchema);

// GECKO FUNCTIONS  =============================================================

// GetGeckos FUNCTION: Returns all geckos from database
exports.getGeckos = function (callback) {
    Gecko.find({}, function (err, geckos) {
        if (err) {
            //console.log("Unable to retrieve list of geckos from database:");
            //console.log(err);
            return callback(err);
        }
        return callback(null, geckos);
    });
};

// GetGecko function: Returns gecko by ID
exports.getGecko = function (id, callback) {
    Gecko.findById(id, function (err, gecko) {
        if (err) {
            callback(err, null);
        }
        callback(null, gecko);
    });
};

// addGecko function: Add new gecko to database
exports.addGecko = function (gData, callback) {
    var gecko;
    try {
        gecko = new Gecko(gData);
    } catch (e) {
        callback("Invalid gecko properties");
        return;
    }
    gecko.save(function (err, gecko) {
        if (err) {
            //console.log("Error occured. Unable to add new gecko to DB:");
            //console.log(err);
            callback(err, null);
            return;
        }
        callback(err, gecko);
    });
};

// removeGecko function: Removes gecko by id from database
exports.removeGecko = function (id, callback) {
    Gecko.findByIdAndRemove(id, function (err, removedGecko) {
        if (err) {
            //console.log("Error occured. Unable to delete gecko:");
            //console.log(err);
            callback(err);
            return;
        }
        console.log("Gecko with id '" + removedGecko._id + "' was successfully removed from DB.");
        callback(null, removedGecko._id);
    });
};

exports.updateGecko = function (id, props, callback) {
    // FIXME [x]: set options for findByIdAndUpdate
    var options = {
        new: true,
        runValidators: true
    };
    Gecko.findByIdAndUpdate(id, props, options, function (err, updatedGecko) {
        if (err) {
            // FIXME [x] commented console logs, it's muddying up the test outpu
            console.log("Error occured. Unable to update gecko:");
            console.log(err);
            callback(err, null);
            return;
        }
        callback(null, updatedGecko);
    });
};

// dropCollection function: Removes all geckos from collection
exports.dropCollection = function (callback) {
    Gecko.remove({}, function (err) {
        console.log('Collection removed.');
        callback(err);
    });
};

// EVENT FUNCTIONS  =============================================================

// TODO: You can combine the next two functions as one, and I think it would be
// good to do so. You can change the prototype to
//   function(options, callback)
// with options optionally containing a 'geckoId' property. If the options argument
// is defined and the 'geckoId' property is provided, then only return events for
// that gecko. Otherwise, return all events for all geckos.
//
// We can expand this in the future to support filtering by adding more supported
// properties to the options argument.

// getAllEvents FUNCTION: Returns all events from database
exports.getAllEvents = function (callback) {
    Event.find({}, function (err, events) {
        if (err) {
            console.log("Unable to retrieve list of events from database:");
            console.log(err);
            return callback(err);
        }
        return callback(null, events);
    });
};

// getEvents function: Return events for particular gecko by ID
exports.getEvents = function (id, callback) {
    // FIXME [x] Changed to geckoId indead of event _id
    Event.find({
        geckoId: id
    }, function (err, events) {
        if (err) {
            console.log("Unable to retrieve events from database:");
            console.log(err);
            return callback(err);
        }
        return callback(null, events);
    });
};

// removeEvent function: Delete event by its id
exports.removeEvent = function (id, callback) {
    Event.findByIdAndRemove(id, function (err, removedEvent) {
        if (err) {
            // FIXME
            // Please remove/comment these out
            console.log("Error occured. Unable to delete event:");
            console.log(err);
            callback(err);
            return;
        }
        if (removedEvent.type === 'weight' || removedEvent.type == 'laid') {
            updateCachedGeckoFields(removedEvent.geckoId, null);
        }
        callback(null, removedEvent);
    });
};

// addEvent function: Add new event to database
exports.addEvent = function (eventData, callback) {
    // FIXME [x] If no 'date' property is defined in eventData, you should create one set to the current date ( new Date() ) and set it.
    var event;
    if (eventData.date === "") {
        eventData.date = new Date();
    }
    try {
        event = new Event(eventData);
    } catch (e) {
        callback("Invalid event properties");
        return;
    }
    event.save(function (err, newEvent) {
        if (err) {
            console.log("Error occured. Unable to add event o to DB:");
            console.log(err);
            callback(err);
            return;
        }
//        if (newEvent.type == 'weight' || newEvent.type == 'laid') {
            updateCachedGeckoFields(newEvent.geckoId, null);
//        }
		console.log("Hrmm...",JSON.stringify(newEvent));
        callback(err, newEvent);
    });
};

// FIXME [x] created updateEvent
exports.updateEvent = function (id, props, callback) {
    // FIXME [x]: set options for findByIdAndUpdate
    var options = {
        new: true,
        runValidators: true
    };
    Event.findByIdAndUpdate(id, props, options, function (err, updatedEvent) {
        if (err) {
            callback(err, null);
            return;
        }
//        if (updatedEvent.type === 'weight' || updatedEvent.type == 'laid' || updatedEvent.type == 'hatch') {
            updateCachedGeckoFields(updatedEvent.geckoId, null);
//        }
        callback(null, updatedEvent);
    });
};

// Update Current Weight: gets most recent weight from event table
function updateCachedGeckoFields(id, callback) {
	updateCurrentWeight(id, null);
	updateLaidDate(id, null);
	updateHatchedDate(id, null);
}

function updateCurrentWeight(id, callback) {
    console.log("updateCurrentWeight called (id=" + id + ")");
    // models.user.findOne({}).sort({date_register: -1}).exec(callback);

	Event.findOne({
        geckoId: id,
        type: 'weight'
    }).sort({
        date: -1
    }).exec(function (err, event) {
        if (err) {
            console.log(err);
            if(callback) callback(err, null);
            return;
        }
		if(!event) {
			console.log("updateLaidDate:no weight event found");
			if(callback) callback(null);
			return;
		}
        console.log("Event from getCurrWeight " + event);
        Gecko.findByIdAndUpdate(id, {
            $set: {
                currWeight: event.info.weight
            }
        }, function (err) {});
    });
};

function updateLaidDate(id, callback) {
	console.log("updateLaidDate", id, callback);
	Event.findOne({
        geckoId: id,
        type: 'laid'
    }).sort({
        date: -1
    }).exec(function (err, event) {
		console.log("updateLaidDate exec", err, event);
        if (err) {
            console.log(err);
            if(callback) callback(err, null);
            return;
        }
		if(!event) {
			console.log("updateLaidDate:no laiddate found");
			if(callback) callback(null);
			return;
		}
        Gecko.findByIdAndUpdate(id, {
            $set: {
                laidDate: event.date
            }
        }, function (err) {
			console.log("updateLaidDate gecko update", err);
		});
    });
}

function updateHatchedDate(id, callback) {
	console.log("updateHatchedDate", id, callback);
	Event.findOne({
        geckoId: id,
        type: 'hatch'
    }).sort({
        date: -1
    }).exec(function (err, event) {
		console.log("updateHatchedDate exec", err, event);
        if (err) {
            console.log(err);
            if(callback) callback(err, null);
            return;
        }
		if(!event) {
			console.log("updateHatchedDate:no laiddate found");
			if(callback) callback(null);
			return;
		}
        Gecko.findByIdAndUpdate(id, {
            $set: {
                hatchDate: event.date
            }
        }, function (err) {
			console.log("updateHatchedDate gecko update", err);
		});
    });
}

// PHOTO FUNCTIONS  =============================================================
exports.savePhoto = function(geckoId, properties, cb) {
	var photo = new Photo({
		geckoId: geckoId,
		name: properties.name,
		path: 'photos/' + properties.name,
		mimetype: properties.mimetype,
		uploaded: new Date(),
		taken: new Date(),
		caption: null
	});

	console.log("savePhoto", "name", properties.name, "mimetype", properties.mimetype);
	
	new exif.ExifImage({image: __dirname + '/../public/photos/' + properties.name}, function(err, exifData) {
		if(err) {
			// This will get hit any time the uploaded photo isn't a JPG or doesn't have EXIF data.
			//console.log(err);
			//cb(err, null);
			//return;
		} else if(exifData.image && exifData.image.ModifyDate) {
			var d = exifData.image.ModifyDate.replace(' ', ':').split(':');
			d = d[1] + "-" + d[2] + "-" + d[0] + " " + d[3] + ':' + d[4] + ':' + d[5];
			photo.taken = new Date(d);
		}
		
		var query = Photo.where({geckoId: geckoId}).count(function(err, count) {
			Photo.find({
				geckoId: geckoId
			}, function (err, photos) {
				photo.save(function (err, newPhoto) {
					if (err) {
						console.log(err);
						cb(err, null);
						return;
					}

					if(count == 0) {
						exports.setPrimaryGeckoPhoto(geckoId, newPhoto.id, function(err) {
							if(err)
								console.log(err);
							cb(null, newPhoto);
						});
					} else {
						cb(null, newPhoto);
					}
				});
			});
		});
	});
};

exports.getGeckoPhotos = function(id, cb) {
	Photo.find({
		geckoId: id
	}, function (err, photos) {
		if (err) {
			console.log("Unable to retrieve photos from database:");
			console.log(err);
			return callback(err);
		}
		return cb(null, photos);
	});
};

//exports.getGeckoPrimaryPhoto = function(id, cb) {
//	Photo.findOne({geckoId: id, primary: true}, function(err, photo) {
//		// TODO If there are no photos, or none are marked primary, we need to return the "empty" photo
//		if(err) {
//			console.log(err);
//			cb(err);
//			return;
//		}
//		cb(null, photo);
//	});
//};

exports.setPrimaryGeckoPhoto = function(geckoId, photoId, cb) {
	console.log("photoId", photoId);
	// Find the photo to verify it "belongs" to the gecko for the given ID
	Photo.findById(photoId, function(err, photo) {
		if(err) {
			console.log(err);
			cb(err);
			return;
		}
		// The provided gecko's id must match the photo's geckoId
		if(photo.geckoId != geckoId) {
			console.log("Tried to set primary photo for wrong gecko");
			cb("Bad gecko");
			return;
		}
		// Update the gecko document to reference this photo
		var options = {
			new: true,
			runValidators: true
		};
		Gecko.findByIdAndUpdate(geckoId, {
			primaryPhoto: {
				id: photoId,
				path: photo.path
			}
		}, function(err, gecko) {
			if(err) {
				console.log(err);
				cb(err);
				return;
			}
			cb(null, gecko);
		})
	});
}

exports.updateGeckoPhoto = function(id, properties, cb) {
    var options = {
        new: true,
        runValidators: true
    };
	console.log("TEEEEEEEEEEEEEEEEEST", cb);
	// TODO If 'primary' property is updated to true, we need to remove it from the current primary photo, if any
    Photo.findByIdAndUpdate(id, properties, options, function (err, updatedPhoto) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, updatedPhoto); 
    });
};

exports.deleteGeckoPhoto = function(photoId, cb) {
	console.log("deleteGeckoPhoto", photoId);
	try {
	Photo.findByIdAndRemove(photoId, function(err, removedPhoto) {
		if(err) {
			if(cb)
				cb(err);
			return;
		}
		if(cb)
			cb(null);
	});
	} catch(e) {
		console.log("ERROR deleting gecko photo");
	}
}


// NOTIFICATION FUNCTIONS =======================================================

exports.getNotifications = function(cb) {
	Notification.find({}, function(err, notifications) {
		if(err) console.error("Error fetching notifications", err);
		cb(err, notifications);
	});
}

exports.createNotification = function(props, cb) {
	var notification;
	try {
		notification = Notification(props);
	} catch(err) {
		console.error("Error creating notification", err);
	}
	notification.save(function(err, notification) {
		if(err) console.error("Error creating notification", err);
		cb(err, notification);
	});
}

exports.deleteNotification = function(id, cb) {
	Notification.findByIdAndRemove(id, function(err, notification) {
		if(err) console.error("Error deleting notification", err);
		cb(err, notification);
	});
}

exports.updateNotification = function(id, props, cb) {
    var options = {
        new: true,
        runValidators: true
    };
	
	if(props._id) delete props._id;
	
    Notification.findByIdAndUpdate(id, props, options, function (err, notification) {
		if(err) console.error("Error updating notification", err);
		cb(err, notification);
	});
}

// OTHER FUNCTIONS  =============================================================

// Get Metrics Function: retrieves gecko statistics
exports.getMetrics = function (callback) {
    var metrics = {};
    Gecko.count({
        sex: 'male'
    }, function (err, males) {
        Gecko.count({
            sex: 'female'
        }, function (err, females) {
            Gecko.count({
                stage: 'egg'
            }, function (err, eggs) {
                var metrics = {
                    males: males,
                    females: females,
                    eggs: eggs
                };
                console.log(metrics);
                callback(null, metrics);
            });
        });
    });
};
