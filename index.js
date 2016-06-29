/*jshint browser: false, node: true*/
/*
|--------------------------------------------------------------------------
| index.js
|--------------------------------------------------------------------------
| Main file, setup, node routes for node application Gecko Tracker.
|
| Created June 2016 by Joi W.
|__________________________________________________________________________
*/

// MODULES  ===============================================================
var express     = require("express");
var geckos      = require("./app/gecko.js");
var bodyParser  = require("body-parser");
var app         = express();


// CONFIGURATION  =========================================================
app.set('port', 5000);
app.use(express.static(__dirname + '/public'));
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




// GECKOS ROUTES ==========================================================

// INDEX - list all geckos
app.get('/api/geckos', function(request, response) {
    geckos.getGeckos(function(err, result) {
		if(err) {
			response.json({'error': 'Problem retrieving geckos'});
			return;
		}
		response.json(result);
	});
});


// CREATE - Add new gecko to DB
app.post('/api/geckos', function(request, response) {
    var gData = request.body;
    geckos.addGecko(gData, function(err, result) {
		if(err){
			console.log("addGecko method failed.");
            return;
        }
        response.json(gData);
     });
});

// SHOW - detailed gecko information
app.get('/api/geckos/:id', function(request, response) {
    var id = request.params.id;
    geckos.getGecko(id, function(err, result) {
    if(err) {
        response.json({'error': 'Problem retrieving gecko'});
        return;
    }
    response.json({'geckoDetail':result});
	});
});

// EDIT - Form edit information for a gecko
app.get('/api/geckos/:id/edit', function(request, response) {
	// TODO complete gecko edit route
});

// UPDATE - Update gecko information
app.put('/api/geckos', function(request, response) {
	// TODO complete gecko update route
});

// DESTROY - delete gecko record
app.delete('/api/geckos/:id', function(request, response) {
    var id = request.params.id;
    console.log("id = " + id);
    geckos.removeGecko(id, function(err, result) {
		if(err){
			console.log("deleteGecko method failed.");
            console.log(err);
            response.json({error: err});
            return;
        }
        response.json({_id: result});
     });
});

// ROUTES FOR DATED EVENTS ============================================

// INDEX - list all events
app.get('/api/events', function(request, response) {
	// TODO complete event index route
});

// NEW - Form to add new event
app.get('/api/events/new', function(request, response) {
	// TODO complete event new route
});

// CREATE - Add new event to DB
app.post('/api/events', function(request, response) {
	// TODO complete event create route
});

// SHOW - detailed event information - MIGHT NOT BE NECESSARY
app.get('/api/events/:id', function(request, response) {
	// TODO complete event show route
});

// EDIT - Form edit information for a event
app.get('/api/events/:id/edit', function(request, response) {
	// TODO complete event edit route
});

// UPDATE - Update event information
app.put('/api/events', function(request, response) {
	// TODO complete event update route
});

// DESTROY - delete event record
app.delete('/api/events/:id/edit', function(request, response) {
    // TODO complete event destroy route
});

// TIMELINE
app.get('/timeline', function(request, response) {
    // TOTO complete timeline route
});

app.get('/node_modules/*', function(request, response) {
    console.log(request.path);
    response.sendFile(__dirname + request.path);
});

// ROOT ROUTE & CATCH-ALL ==================================================
app.get('*', function(request, response) {
	response.sendFile(__dirname + '/public/index.htm');
});

//  REGISTER ROUTES AND START SERVER  =====================================
geckos.init(null, function() {
	console.log("Gecko data source initialized");
	app.listen(app.get('port'), '0.0.0.0', function() {
		console.log("Node app is running at:" + app.get('port'));
	});
});
