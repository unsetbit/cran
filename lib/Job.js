module.exports = function createJob(func, schedule){
	function run(){
		setImmediate(func);
		api.nextRunTime = schedule();
	}

	var api = {
		run: run,
		nextRunTime: schedule()
	};

	return api;
}
