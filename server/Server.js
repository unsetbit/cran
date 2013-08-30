var http = require('http'),
	express = require('express'),
	reqHandler = require('./HttpRequestHandlers'),
	createScheduler = require('./Scheduler.js');

var createJob = require('./Job.js');

module.exports = function(port, hostname, root){
	var app = express();
	var server = http.createServer(app);

	var scheduler = createScheduler();
	
	// Http middleware
	app.use(express.static(root));
	app.use(express.json());

	// Http request handlers
	app.post('/save', reqHandler.save.bind(null, scheduler));
	app.get('/get/:jobId', reqHandler.get.bind(null, scheduler));
	app.get('/get', reqHandler.get.bind(null, scheduler));
	app.get('/delete/:jobId', reqHandler.delete.bind(null, scheduler));

	server.listen(port, hostname);
	
	return server;
};
