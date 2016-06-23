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
var g = require("./app/gecko.js");

exports.popDat = function (callback) {

    var newGeckos[] = [
        new g.Gecko({
            name:   "Britney",
            status: "normal",
            sex:    "male",
            morph:  "rainbow bright",
            weight: 69
        }),
        new g.Gecko({
            name:   "Test subject #211",
            status: "normal",
            sex:    "unknown",
            morph:  "mystery morph",
            weight: 50
        }),
        new g.Gecko({
            name:   "Wee Baby",
            status: "egg",
            sex:    "unknown",
            morph:  "unknown",
            weight: 10
        }),
        new g.Gecko({
            name: "Locke",
            sex: 'male',
            status: 'normal',
            morph: 'Lavender Jungle Bandit',
            birthdate: new Date('5/1/2015'),
            weight: 57
        }),
        new g.Gecko({
            name: "Sabetha",
            sex: 'female',
            status: 'gravid',
            morph: 'Lavender Jungle Bandit',
            birthdate: new Date('5/1/2015'),
            weight: 63
        }),
        new g.Gecko({
            name:   "Eggbert",
            sex:    'unknown',
            status: 'egg',
            morph:  'unknown',
            weight:  20
        }),
        new g.Gecko({
            name: "Locke Jr.",
            sex: 'male',
            status: 'egg',
            morph: 'Lavender Jungle Bandit',
            birthdate: 'unknown',
            weight: 21
        }),
        new g.Gecko({
            name: "Mystery Girl",
            sex: 'female',
            status: 'normal',
            morph: 'unknown',
            birthdate: new Date('6/21/2016'),
            weight: 29
        })
    ];

    newGeckos.forEach(function(gecko) {
        exports.addGecko(gecko, function () {});
    });
    console.log('Databse population done.');
};

//g.init(null, exports.popDat);
