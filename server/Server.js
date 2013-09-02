var http = require('http'),
	express = require('express'),
	createScheduler = require('./Scheduler.js'),
	createJob = require('./Job.js');

module.exports = function(port, hostname, root){
	createScheduler(function(scheduler){
		var app = express();
		var server = http.createServer(app);
		
		// Http middleware
		app.use(express.static(root));
		app.use(express.json());

		app.get('/info', function getInfo(req, res){
			var info = {
				id: scheduler.id,
				upSince: scheduler.upSince,
				partners: scheduler.partners
			};

			info.jobs = scheduler.get().map(function(job){
				return {
					id: job.id,
					name: job.name,
					creationTime: job.creationTime,
					lastRunTime: job.lastRunTime,
					nextRunTime: job.nextRunTime,
					schedule: job.schedule,
					error: job.error
				};
			});

			res.send(200, info);
		});

		// Http request handlers
		app.post('/save', function saveJob(req, res){
			var job,
				isUpdate = 'id' in req.body;

			if(isUpdate) job = scheduler.get(req.body.id);
			else job = createJob();

			if(!job){
				res.send(400, "Could not find the job.");
				return;
			}
			
			job.name = req.body.name;
			job.script = req.body.script;
			job.schedule = req.body.schedule;

			if(isUpdate) scheduler.update(job);
			else scheduler.add(job);

			res.send(200, job.id);
		});
		
		app.get('/get/:jobId', function getJob(req, res){
			var jobId = req.params.jobId;

			res.send(200, scheduler.get(jobId));
		});

		app.get('/get', function getJobs(req, res){
			res.send(200, scheduler.get());
		});
		
		app.get('/delete/:jobId', function deleteJob(req, res){
			var job = scheduler.get(req.params.jobId);
			scheduler.remove(job);
			res.send(200);
		});

		server.listen(port, hostname);
	});
};
