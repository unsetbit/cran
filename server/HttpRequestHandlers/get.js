module.exports = function(jobs, req, res){
	// If job id is not defined, the job list is returned
	var jobId = req.params.jobId;
	res.send(200, jobs.get(jobId));
};