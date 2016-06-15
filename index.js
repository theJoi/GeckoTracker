var express = require('express')
var app = express()

app.set('port', 5000)
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
	response.send('Hello Worl!');
})

app.listen(app.get('port'), '0.0.0.0', function() {
	console.log("Node app is running at:" + app.get('port'))
})

