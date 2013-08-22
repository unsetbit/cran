module.exports = function(jobs, req, res){
	res.send(200, Object.keys(jobs.get()));
};