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

function addTestGeckos(callback) {
	var newGeckos = [{
		userId: '15001',
		name: "Locke",
		stage: 'adult',
		status: 'normal',
		sex: 'male',
		morph: 'Lavender Jungle Bandit',
		location: "bin #A-1",
		currentWeight: 62,
		notes: "Some sample notes.",
		mother: {},
		father: {},
		dates: {
			hatched: new Date('5/1/2015')
		}
    }, {
		userId: '15002',
		name: "Sabetha",
		stage: 'adult',
		status: 'normal',
		sex: 'female',
		morph: 'Lavender Jungle Bandit',
		location: "bin #A-2",
		currentWeight: 64,
		notes: "Some sample notes.",
		mother: {},
		father: {},
		dates: {
			hatched: new Date('5/1/2015')
		}
    }, {
		userId: '15002',
		name: 'Britney',
		stage: 'hatchling',
		status: 'normal',
		sex: 'female',
		morph: 'Lavender Jungle Bandit',
		location: "bin #A-3",
		currentWeight: 44,
		notes: "Some sample notes.",
		mother: {
			name: "Sabetha",
			userId: "15002"
		},
		father: {
			name: "Locke",
			userId: "15001"
		},
		dates: {
			hatched: new Date('6/11/2016')
		}
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
    var toLoad = newGeckos.length;
	newGeckos.forEach(function (gecko) {
		geckos.addGecko(gecko, function () {
            toLoad--;
            if(toLoad == 0) {
            	console.log('Database population done.');
                process.exit();
            }
        });
	});
};

// Empty collection first then run function to add geckos
geckos.init(null, function () {
	 geckos.dropCollection(function () {
		 addTestGeckos();
	 });
});
