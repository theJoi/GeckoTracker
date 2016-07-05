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
var g = require("../gecko.js");

exports.propDat = function (callback) {

    var newGeckos = [{
        name: "Britney",
        status: "normal",
        sex: "female",
        morph: "rainbow bright",
        location: "bin #1"
        }, {
        name: "Test subject #211",
        status: "normal",
        sex: "unknown",
        morph: "mystery morph",
        location: "bin #2",
        dateLaid: new Date("12/15/2015")
  }, {
        name: "Wee Baby",
        status: "egg",
        sex: "unknown",
        morph: "unknown",
        location: "bin #3",
        dateLaid: new Date("12/15/2015")
  }, {
        name: "Locke",
        sex: 'male',
        status: 'normal',
        morph: 'Lavender Jungle Bandit',
        birthdate: new Date('5/1/2015'),
        location: "bin #A-1",
        dateLaid: new Date("12/15/2015")
  }, {
        name: "Sabetha",
        sex: 'female',
        status: 'gravid',
        morph: 'Lavender Jungle Bandit',
        birthdate: new Date('5/1/2015'),
        location: "bin #A-2",
        dateLaid: new Date("12/15/2015")
  }, {
        name: "Eggbert",
        sex: 'unknown',
        status: 'egg',
        morph: 'unknown',
        location: "incubator #1",
        dateLaid: new Date("12/15/2015")
  }, {
        name: "Locke Jr.",
        sex: 'male',
        status: 'egg',
        morph: 'Lavender Jungle Bandit',
        birthdate: 'unknown',
        location: "incubator #1",
        dateLaid: new Date("12/15/2015")
  }, {
        name: "Mystery Girl",
        sex: 'female',
        status: 'normal',
        morph: 'unknown',
        birthdate: new Date('6/21/2016'),
        location: "incubator #2",
        dateLaid: new Date("12/15/2015")
}];

     // Add geckos to database
     newGeckos.forEach(function (gecko) {
        g.addGecko(gecko, function () {});
    });
    console.log('Databse population done.');
};


// Empty collection first then run function to add geckos
g.init(null, function () {
     g.dropCollection(function () {
         exports.propDat(function () {});
     });
});
