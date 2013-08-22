module.exports = function(jobs, req, res){
	var job = req.job;
	jobs.remove(job);
	res.send(200);
};