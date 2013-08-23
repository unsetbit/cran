var vm = require('vm'),
	generateId = require('node-uuid').v4;

module.exports = function createJob(name, script, schedule){
	var job = {};
	var compiledScript = vm.createScript(script);
	var id = generateId();
	var nextRunTime = schedule.nextTime();
	var startTime = nextRunTime;
	var lastResult;
	var context = {
		require: require,
		console: console
	};

	function getApi(){
		var api = {};
		
		api.name = name;
		api.id = id;
		api.script = script;
		api.startTime = startTime;
		api.schedule = schedule;
		api.run = run;

		Object.defineProperty(api, "nextRunTime", { 
			get: function(){ return nextRunTime; },
			enumerable: true
		});
		
		Object.defineProperty(api, "lastResult", { 
			get: function(){ return lastResult; },
			enumerable: true
		});

		return api;
	};

	function run(){
		try{
			lastResult = compiledScript.runInNewContext(context);
		} catch(err){
			lastResult = err;
		}
		 
		nextRunTime = schedule.nextTime();
	}

	return getApi();
};