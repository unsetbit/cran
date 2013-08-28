var Schedules = require('../Schedules'),
	createJob = require('../Job.js');

module.exports = function(jobs, req, res){
	// Create job schedule
	var rawSchedule = req.query.schedule;
	
	// Create job
	var job = createJob(req.query.name, req.rawBody, rawSchedule);

	// Add the job to the scheduler
	jobs.add(job);

	res.send(200, job.id);
};