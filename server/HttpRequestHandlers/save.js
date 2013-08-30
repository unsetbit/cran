var createJob = require('../Job.js');

module.exports = function(jobs, req, res){
	var job;
	if('id' in req.body) job = jobs.get(req.body.id);

	if(!job) job = createJob();
	
	job.name = req.body.name;
	job.script = req.body.script;
	job.rawSchedule = req.body.rawSchedule;

	jobs.add(job);

	res.send(200, job.id);
};