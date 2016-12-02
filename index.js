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
var multer		= require("multer");
var crypto		= require('crypto');

// CONFIGURATION  =========================================================
app.set('port', 5000);
app.use(express.static(__dirname + '/public'));
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// MULTER CONFIGURATION ===================================================
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'public/photos');
	},
	filename: function(req, file, cb) {
		var ext = ".jpg";
		if(file.mimetype == 'image/jpeg')
			ext = ".jpg";
		crypto.pseudoRandomBytes(16, function(err, raw) {
			console.log("GENERATING FILENAME", err, raw.toString('hex') + ext);
			cb(err, err ? undefined : raw.toString('hex') + ext);
		});
	}
})
var upload = multer({ storage: storage });

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
			console.log("addGecko method failed:");
            console.log(err);
            return;
        }
        response.json(result);
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
    response.json(result);
	});
});

// UPDATE - Update gecko information
app.put('/api/geckos/:id/edit', function(request, response) {
	// TODO complete gecko edit route
    var id = request.params.id;
    var data = request.body;
    console.log(request.body);
    geckos.updateGecko(id, data, function(err, result){
        if(err){
             response.json({'error': 'Problem updating gecko'});
            return;
        }
        response.json(result);
    });
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
    geckos.getAllEvents(function(err, result) {
		if(err) {
			response.json({'error': 'Problem retrieving events.'});
			return;
		}
		response.json(result);
	});
});

// NEW - Add new event
app.post('/api/events', function(request, response) {
    var gData = request.body;
    geckos.addEvent(gData, function(err, result) {
		if(err){
			console.log("addGecko method failed.");
            return;
        }
        response.json(gData);
     });
});

// SHOW - all events for particular gecko
app.get('/api/geckos/:id/events', function(request, response) {
    var id = request.params.id;
    geckos.getEvents(id, function(err, result) {
    if(err) {
        response.json({'error': 'Problem retrieving events'});
        return;
    }
    response.json(result);
	});
});

// CREATE - new event for particular gecko
app.post('/api/geckos/:id/events', function(request, response) {
    var id = request.params.id;
    var data = request.body;
    data.geckoId = id;
    geckos.addEvent(data, function(err, result) {
        if(err) {
            console.log(err);
            response.json({'error': 'Problem creating event'});
            return;
        }
        response.json(result);
	});
});

// UPDATE - Update event information
app.put('/api/events/:id/edit', function(request, response) {
	// TODO complete gecko edit route
    var id = request.params.id;
    var data = request.body;
    console.log(request.body);
    geckos.updateEvent(id, data, function(err, result){
        if(err){
             response.json({'error': 'Problem updating gecko'});
            return;
        }
        response.json(result);
    });
});

// DESTROY - delete event record
app.delete('/api/events/:id', function(request, response) {
    var id = request.params.id;
    console.log("id = " + id);
    geckos.removeEvent(id, function(err, result) {
		if(err){
			console.log("deleteEvent method failed.");
            console.log(err);
            response.json({error: err});
            return;
        }
        response.json(result);
     });
});

// PHOTO ROUTES =================================================
app.post('/api/geckos/:id/photos', upload.single('file'), function(request, response) {
	var geckoId = request.params.id;
	if(!request.file) {
		response.json("foo");
		return;
	}
	console.log("Uploaded photo for gecko " + geckoId);
	console.log(JSON.stringify(request.file));
	console.log("originalname", request.file.originalname);
	console.log("name", request.file.filename);
	console.log("encoding", request.file.encoding);
	console.log("mimetype", request.file.mimetype);
	console.log("path", request.file.path);
	console.log("size", request.file.size);
	geckos.savePhoto(geckoId, {
		name: request.file.filename,
		originalName: request.file.originalname,
		mimetype: request.file.mimetype
	}, function(err, photo) {
		response.json(photo);
	});
});

app.get('/api/geckos/:id/photos', function(request, response) {
	var geckoId = request.params.id;
	geckos.getGeckoPhotos(geckoId, function(err, photos) {
		if(err) {
            console.log(err);
            response.json({error: err});
            return;
        }
		response.json(photos);
	});
});

app.put('/api/photos/:id', function(request, response) {
	var id = request.params.id;
	var properties = request.body;
	geckos.updateGeckoPhoto(id, properties, function(err, updatedPhoto) {
		if(err) {
			response.json({error: err});
			return;
		}
		response.json(updatedPhoto);
	});
});

app.delete('/api/photos/:id', function(request, response) {
	var id = request.params.id;
	geckos.deleteGeckoPhoto(id, function(err) {
		if(err) {
			response.json({error: err});
			return;
		}
		response.json("{result: 'success'}");
	});
});

app.post('/api/photos/:id/caption', function(request, response) {
	var photoId = request.params.id;
	var caption = request.body.caption;
	geckos.setPhotoCaption(photoId, caption, function(err) {
		if(err) {
			response.json({error: err});
			return;
		}
		response.json("{result: 'success'}");
	});
});

app.put('/api/geckos/:id/setPrimaryPhoto', function(request, response) {
	var geckoId = request.params.id;
	var photoId = request.body.photoId;
	geckos.setPrimaryGeckoPhoto(geckoId, photoId, function(err, gecko) {
		if(err) {
			response.json({error: err});
			return;
		}
		response.json(gecko);
	});
});

// NOTIFICATIONS ROUTES =========================================
app.get('/api/notifications', function(request, response) {
	geckos.getNotifications(function(err, notifications) {
		if(err) {
			response.sendStatus(500);
			response.json({error: err});
		}
		response.json(notifications);
	});
});

app.post('/api/notifications', function(request, response) {
	geckos.createNotification(request.body, function(err, notification) {
		if(err) {
			response.sendStatus(500);
			response.json({error: err});
			return;
		}
		response.json(notification);
	})
});

app.delete('/api/notifications/:id', function(request, response) {
	geckos.deleteNotification(request.params.id, function(err, notification) {
		if(err) {
			response.sendStatus(500);
			response.json({error: err});
			return;
		}
		response.json(notification);
	})
});

app.put('/api/notifications/:id', function(request, response) {
	geckos.updateNotification(request.params.id, request.body, function(err, notification) {
		if(err) {
			response.sendStatus(500);
			response.json({error: err});
			return;
		}
		response.json(notification);
	})
});


// OTHER ROUTES =================================================

// TIMELINE
app.get('/timeline', function(request, response) {
    // TOTO complete timeline route
});

// METRICS
app.get('/api/metrics', function(request, response) {
    geckos.getMetrics(function(err, result) {
        if(err) {
            response.json({error: err});
            return;
        }
        response.json(result);
    });
});

// ROUTE TO NODE MODULES
app.get('/node_modules/*', function(request, response) {
    //console.log(request.path);
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
