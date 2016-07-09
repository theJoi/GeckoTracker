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

// JSON PARSE APPLICATION  ================================================
//var express     = require('express');
//var app         = express();
//var parser  = require("body-parser");
//app.use(parser.json());
//app.use(parser.urlencoded({extended: true}));


// GECKO SCHEMA  ===========================================================
var geckoSchema = new mongoose.Schema({
    name        : String, // Name of gecko
    userId      : String, // External ID number
    stage       : String, // {egg, hatchling, or adult}
    status      : String, // Options are {normal/gravid/egg/sold/dead}
    sex         : String, // Female/ Male/ Unknown
    morph       : String, // Gecko's morph type
    purchaseDate: Date,   // Date gecko was purchased, n/a if not purchased
    birthDate   : Date,   // Birthdate of gecko
    location    : String, // Current location of gecko
    parents     :         // Reference to parents
    [{
        parent  : String, // Options mother or father
        ref     : mongoose.Schema.Types.ObjectId
    }],
    weights     :         // Weight and date weighed
    [{
        date    : Date,
        weight  : Number
    }],
    shedded     :         // Date shedded
    [{
        date    : Date
    }],
    laid        :         // Date gecko laid eggs and number of viable eggs and slugs
    [{
        date    : Date,
        viable  : Number,
        slugs   : Number
    }],
    gravid      :         // Date gecko became gravid or not gravid
    [{
        isGravid: Boolean,
        date    : Date
    }],
    copulated   :         // Date gecko copulated and with whom
    [{
        date    : Date,
        partner : mongoose.Schema.Types.ObjectId

    }],
    incubated   :        // Date egg was incubated and temp
    [{
        startDate: Date,
        endDate : Date,
        temp    : Number
    }]
});

// MONGOOSE GECKO MODEL  ========================================================
var Gecko = mongoose.model("Gecko", geckoSchema);

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


// GetGeckos FUNCTION  ===========================================================
// Returns all geckos from database
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

// GetGecko FUNCTION  ===========================================================
// Returns gecko by ID
exports.getGecko = function (id ,callback) {
    Gecko.find({_id: id}, function (err, gecko) {
        if (err) {
            //console.log("Unable to retrieve gecko from database:");
            //console.log(err);
            return callback(err);
        }
        return callback(null, gecko);
    });
};


// addGecko FUNCTION  ===========================================================
// Add new gecko to database

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

exports.dropCollection = function(callback){
    Gecko.remove({}, function(err) {
        console.log('Collection removed.');
        callback(err);
    });
};
