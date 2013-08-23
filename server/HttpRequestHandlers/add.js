var Schedules = require('../Schedules'),
	createJob = require('../Job.js');

module.exports = function(jobs, req, res){
	// Create job schedule
	var type = req.query.type;
	if(!(type in Schedules)){
		res.send(400, "Unknown schedule type");
		return;
	}

	var schedule = Schedules[type](req.query);

	// Create job
	var job = createJob(req.query.name, req.rawBody, schedule);

	// Add the job to the scheduler
	jobs.add(job);

	res.send(200, job.id);
};