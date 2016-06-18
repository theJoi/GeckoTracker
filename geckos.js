var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/geckotracker");

var geckoSchema = new mongoose.Schema({
    name		: String,
    uniqueID 	: Number,
    status		: String,
    sex         : String,
    morph		: String,
    purchaseDate: Date,
    birthDate	: Date,
    parents 	: [String],
    weights		: {
        date    : Date,
        weight	: Number
    },
    shedded : {
         date   : Date
    },
    laid        : {
        date	: Date,
        viable	: Number,
        slugs	: Number
    },
    gravid      : {
        isGravid: Boolean,
        date	: Date
    },
    copulated	: {
        date    : Date,
        partner : UniqueID
    },
    incubated	: {
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
