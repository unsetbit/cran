var vm = require('vm'),
	ws = require('ws'),
	http = require('http'),
	express = require('express'),
	reqHandler = require('./HttpRequestHandlers'),
	wsHandler = require('./WebsocketHandlers'),
	createScheduler = require('./Scheduler.js');

var Schedules = require('./Schedules'),
	createJob = require('./Job.js');

module.exports = function(port, hostname, root){
	var app = express();
	var server = http.createServer(app);

	var scheduler = createScheduler();
	
	// Http request handlers
	app.use(express.static(root));
	app.param('jobId', reqHandler.jobIdMiddleware.bind(null, scheduler));
	app.post('/add', 
				reqHandler.bodyCollectorMiddleware, 
				reqHandler.add.bind(null, scheduler)
	);
	app.get('/list', reqHandler.list.bind(null, scheduler));
	app.get('/get/:jobId', reqHandler.get);
	app.get('/remove/:jobId', reqHandler.remove.bind(null, scheduler));

	server.listen(port, hostname);
	
	// Web socket handlers
	var wsServer = new ws.Server({server: server});
	var sockets = [];

	wsServer.on('connection', function(socket){
		sockets.push(socket);
		var jobsMap = scheduler.get(),
			jobsArray = Object.keys(jobsMap).map(function(jobId){return jobsMap[jobId];});


		socket.send(JSON.stringify({
			type: 'job list',
			jobs: jobsArray
		}));

		socket.on('message', function(message){
			var data = JSON.parse(message);
			switch(data.type){
				case 'create':
					// Create job
					var job = createJob(data.job.name, data.job.script, data.job.rawSchedule);

					// Add the job to the scheduler
					scheduler.add(job);

					break;
			}
		});

		socket.on('close', function(){
			var index = sockets.indexOf(socket);
			sockets.splice(index, 1);
		});
	});

	scheduler.on('job added', function(job){
		console.log('job event');
		emitToSockets({ 
			type: 'job added', 
			job: job
		});
	});

	scheduler.on('job removed', function(job){
		emitToSockets({ 
			type: 'job removed', 
			job: job
		});
	});

	scheduler.on('job updated', function(job){
		emitToSockets({ 
			type: 'job updated', 
			job: job
		});
	});

	function emitToSockets(message){
		var stringified = JSON.stringify(message);
		sockets.forEach(function(socket){
			console.log('emitting: ' + stringified);
			socket.send(stringified);
		});
	}

	return server;
};
