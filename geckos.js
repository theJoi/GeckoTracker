var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/geckotracker");

var geckoSchema = new mongoose.Schema({
    name		: String,         // Name of gecko
    uniqueID 	: Number,         // External ID number
    status		: String,         // options are {normal/gravid/egg/sold/dead}
    sex         : String,         // Female/ Male/ Other
    morph		: String,         // Gecko's morph type
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
    }
});

var Gecko = mongoose.model("Gecko", geckoSchema);

//add new gecko to DB for testing purposes



exports.getGeckos = function() {
    return [];
}

exports.addGecko = function(props) {

}
