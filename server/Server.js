var vm = require('vm'),
	ws = require('ws'),
	express = require('express'),
	reqHandler = require('./HttpRequestHandlers'),
	wsHandler = require('./WebsocketHandlers'),
	createScheduler = require('./Scheduler.js');

module.exports = function(port, hostname){
	var scheduler = createScheduler();
	
	// Http request handlers
	var server = express();
	server.listen(port, hostname);

	server.param('jobId', reqHandler.jobIdMiddleware.bind(null, scheduler));
	server.post('/add', 
				reqHandler.bodyCollectorMiddleware, 
				reqHandler.add.bind(null, scheduler)
	);
	server.get('/list', reqHandler.list.bind(null, scheduler));
	server.get('/get/:jobId', reqHandler.get);
	server.get('/remove/:jobId', reqHandler.remove.bind(null, scheduler));

	// Web socket handlers
	var wsServer = new ws.Server({server: server});
	wsServer.on('connection', wsHandler.connection.bind(null, scheduler));

	return server;
};
