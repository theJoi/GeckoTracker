var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/geckotracker");

var geckoSchema = new mongoose.Schema({
    name		: String,         // Name of gecko
    uniqueID 	: Number,         // External ID number
    status		: String,         // options are {normal/gravid/egg/sold/dead}
    sex         : String,         // Female/ Male/ Unknown
    /*morph		: String,         // Gecko's morph type
    purchaseDate: Date,           // Date gecko was purchased, n/a if not purchased
    birthDate	: Date,           // Birthdate of gecko
    parents 	: [               // Reference to parents
        type    : mongoose.Schema.Type.objectId,
        ref     : gecko
    ],
    weights		: {                // Weight and date weighed
        date    : Date,
        weight	: Number
    },
    shedded : {                     // Date shedded
         date   : Date
    },
    laid        : {                 // Date gecko laid eggs and number of viable eggs and slugs
        date	: Date,
        viable	: Number,
        slugs	: Number
    },
    gravid      : {                 // Date gecko became gravid or not gravid
        isGravid: Boolean,
        date	: Date
    },
    copulated	: {                  // Date gecko copulated and with whom
        date    : Date,
        partner : {
            type: mongoose.Schema.Type.objectId,
            ref : gecko
        }
    },
    incubated	: {                   // Date egg was incubated and temp
        startDate: Date,
        endDate	: Date,
        temp    : Number
    }*/
});

var Gecko = mongoose.model("Gecko", geckoSchema);

//add new gecko to DB for testing purposes
Gecko.create({
    name		: "Test Gecko #1",
    uniqueID 	: 2,
    status		: "normal",
    sex         : "male"
}, function(err, newGecko){
    if(err){
        console.log("Error occured. Unable to add new gecko to DB:");
        console.log(err);
    } else {
        console.log("Successfully added the following gecko to DB:");
        console.log(cat);
    }
});

// Returns all geckos in DB
exports.getGeckos = function() {
    Gecko.find({}, function(err, geckos){
        if(err){
            console.log("Unable to retrieve list of geckos from database:");
            console.log(err);
        } else {
            console.log("Successfully retrieved list of geckos");
            console.log(geckos.name);
            return geckos.name;
        }
    });
    return -1;
}

exports.addGecko = function(props) {

}
