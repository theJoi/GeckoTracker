var express = require('express')
var app = express()

var geckos = require('./geckos.js')

app.set('port', 5000);
app.use(express.static(__dirname + '/public'));


/*
|--------------------------------------------------------------------------
| ROUTES FOR GECKO TRACKER API
|--------------------------------------------------------------------------
| This includes root, CRUD functions for geckos and dated events, and
| views for timeline and other data visualations.
|__________________________________________________________________________
*/

// ROOT ROUTE =============================================================
app.get('/', function(request, response) {
	//response.send('Hello Worl!');
	response.sendFile('./public/index.htm');
});

// GECKOS ROUTES ==========================================================

// INDEX - list all geckos
app.get('/geckos', function(request, response) {
	// TODO complete gecko index route
});

// NEW - Form to add new gecko
app.get('/geckos/new', function(request, response) {
	// TODO complete gecko new route
});

// CREATE - Add new gecko to DB
app.post('/geckos', function(request, response) {
	// TODO complete gecko create route
});

// SHOW - detailed gecko information
app.get('/geckos/:id', function(request, response) {
	// TODO complete gecko show route
});

// EDIT - Form edit information for a gecko
app.get('/geckos/:id/edit', function(request, response) {
	// TODO complete gecko edit route
});

// UPDATE - Update gecko information
app.put('/geckos', function(request, response) {
	// TODO complete gecko update route
});

// DESTROY - delete gecko record
app.delete('/geckos/:id/edit', function(request, response) {
	// TODO complete gecko destroy route
});

// ROUTES FOR DATED EVENTS ============================================

// INDEX - list all events
app.get('/events', function(request, response) {
	// TODO complete event index route
});

// NEW - Form to add new event
app.get('/events/new', function(request, response) {
	// TODO complete event new route
});

// CREATE - Add new event to DB
app.post('/events', function(request, response) {
	// TODO complete event create route
});

// SHOW - detailed event information - MIGHT NOT BE NECESSARY
app.get('/events/:id', function(request, response) {
	// TODO complete event show route
});

// EDIT - Form edit information for a event
app.get('/events/:id/edit', function(request, response) {
	// TODO complete event edit route
});

// UPDATE - Update event information
app.put('/events', function(request, response) {
	// TODO complete event update route
});

// DESTROY - delete event record
app.delete('/events/:id/edit', function(request, response) {
    // TODO complete event destroy route
});

// TIMELINE
app.get('/timeline', function(request, response) {
    // TOTO complete timeline route
});


/*
|--------------------------------------------------------------------------
| REGISTER ROUTES AND START SERVER
|--------------------------------------------------------------------------
*/

app.listen(app.get('port'), '0.0.0.0', function() {
	console.log("Node app is running at:" + app.get('port'))
});

