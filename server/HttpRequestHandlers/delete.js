module.exports = function(jobs, req, res){
	var job = jobs.get(req.params.jobId);
	jobs.remove(job);
	res.send(200);
};