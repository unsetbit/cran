module.exports = function(jobs, req, res){
	var jobsMap = jobs.get();
	var jobs = Object.keys(jobsMap).map(function(jobId){
		return jobsMap[jobId];
	});
	res.send(200, jobs);
};