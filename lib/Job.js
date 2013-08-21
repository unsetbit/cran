module.exports = function createJob(func, schedule){
	function run(){
		api.error = void 0;
		
		try{
			func();
		} catch(err){
			api.error = err;
		}
		 
		api.nextRunTime = schedule();
	}

	var api = {
		error: false,
		run: run,
		nextRunTime: schedule()
	};

	return api;
}
