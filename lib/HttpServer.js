var http = require('http'),
	url = require('url'),
	vm = require('vm'),
	createJob = require('./Job.js'),
	createFuzzyInterval = require('./Schedules/FuzzyInterval.js'),
	createInterval = require('./Schedules/Interval.js'),
	createScheduler = require('./Scheduler.js');

module.exports = function createHttpServer(port, hostname){
	var jobId = 0,
		jobs = {},
		scheduler = createScheduler(), 
		server = http.createServer(requestHandler);

	function requestHandler(request, response){
		var body = '';
		request.setEncoding('utf8');
		request.on('data', function(data){ body += data});
		request.on('end', function(){
			var script = body,
				params = url.parse(request.url, true).query;

			var job = addJob(script, params);

			jobs[jobId] = job;
			scheduler.add(job);
			response.end('' + jobId);
			jobId++;
		});
	}

	function addJob(script, scheduleParams){
		var schedule;
		switch(scheduleParams.type){
			case "FuzzyInterval":
				schedule = createFuzzyInterval(	parseInt(scheduleParams.interval, 10), 
												parseInt(scheduleParams.fuzz, 10),
												parseInt(scheduleParams.startTime, 10));
				break;
			case "Interval":
				schedule = createInterval(	parseInt(scheduleParams.interval, 10), 
											parseInt(scheduleParams.startTime, 10));
				break;
			default:
				return null;
		}

		script = vm.createScript(script);
		var context = {
			require: require,
			console: console
		};

		return createJob(script.runInNewContext.bind(script, context), schedule);
	}

	server.listen(port, hostname);
	return server;
};