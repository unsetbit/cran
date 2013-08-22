module.exports = function(jobs, req, res, next, id){
	var job = jobs.get(id);
	if(job === void 0){
		res.send(400, "Unknown job id");
		return;
	}

	req.job = job;
	next();
};