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

exports.init = function (db, callback) {
    if (!db) {
        db = "mongodb://localhost/geckotracker";
    }
    mongoose.connect(db);
    mongoose.connection.on('error', function(err) { callback(err); });
    mongoose.connection.once('open', function() {
        console.log("Database initilized.");
        callback(null);
    });
};


// SCHEMAS  ============++++===============================================
var geckoSchema = new Schema({
    name        : {
        type    :String,  // Name of gecko
        required: true
    },
    userId      : String, // External ID number
    stage       : String, // {egg, hatchling, or adult}
    status      : String, // Options are {normal/gravid/egg/sold/dead}
    sex         : String, // Female/ Male/ Unknown
    morph       : String, // Gecko's morph type
    location    : String, // Current location of gecko
    mother      :
    {
        _id     : Schema.Types.ObjectId,
        userId  : String,
        name    : String
    },
    father      :
    {
        _id     : Schema.Types.ObjectId,
        userId  : String,
        name    : String
    },
    currWeight  : Number,
    notes       : String
    });

var eventSchema = new Schema({
    geckoId    :
    {
        type    :Schema.Types.ObjectId,
        required: true
    },
    type        :
    {
        type    :String,
        required: true
    },
    date        :
    {
        type    :Date,
        required: true
    },
    info        : Schema.Types.Mixed,
    warning     : Date,
    notes       : String
});

// MONGOOSE MODELS  =============================================================
var Gecko = mongoose.model("Gecko", geckoSchema);
var Event = mongoose.model("Event", eventSchema);


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
exports.getGecko = function (id ,callback) {
    Gecko.findById(id, function (err, gecko) {
        if (err) {
            callback(err);
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
            callback(err);
            return;
        }
        callback(err, gecko);
    });
};

// removeGecko function: Removes gecko by id from database
exports.removeGecko = function (id, callback) {
    Gecko.findByIdAndRemove(id, function(err, removedGecko) {
        if (err){
            //console.log("Error occured. Unable to delete gecko:");
            //console.log(err);
            callback(err);
            return;
        }
        //console.log("Gecko with id '" + removedGecko._id + "' was successfully removed from DB.");
        callback(null, removedGecko._id);
    });
};

exports.updateGecko = function(id, props, callback) {
    // FIXME [x]: set options for findByIdAndUpdate
    var options = {new: true, runValidators: true};
    Gecko.findByIdAndUpdate(id, props, options, function(err, updatedGecko){
        if(err){
            // FIXME [x] commented console logs, it's muddying up the test outpu
            //console.log("Error occured. Unable to update gecko:");
            //console.log(err);
            callback(err, null);
            return;
        }
        callback(null, updatedGecko);
    });
};

// dropCollection function: Removes all geckos from collection
exports.dropCollection = function(callback){
    Gecko.remove({}, function(err) {
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
exports.getEvents = function(id ,callback) {
    // FIXME [x] Changed to geckoId indead of event _id
    Event.find({geckoId: id}, function (err, events) {
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
    Event.findByIdAndRemove(id, function(err, removedEvent) {
        if (err){
            console.log("Error occured. Unable to delete event:");
            console.log(err);
            callback(err);
            return;
        }
        callback(null, removedEvent._id);
    });
};

// addEvent function: Add new event to database
exports.addEvent = function (eventData, callback) {
    // FIXME [x] If no 'date' property is defined in eventData, you should create one set to the current date ( new Date() ) and set it.
    var event;
    if(eventData.date === ""){
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
        callback(err, newEvent);
    });
};

// FIXME [x] created updateEvent
exports.updateEvent = function(id, props, callback) {
    // FIXME [x]: set options for findByIdAndUpdate
    var options = {new: true, runValidators: true};
    Event.findByIdAndUpdate(id, props, options, function(err, updatedEvent){
        if(err){
            callback(err, null);
            return;
        }
        callback(null, updatedEvent);
    });
};
