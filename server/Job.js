var vm = require('vm'),
	generateId = require('node-uuid').v4,
	later = require('later');

module.exports = function createJob(name, script, rawSchedule){
	var job = {};
	var compiledScript = vm.createScript(script);
	var id = generateId();
	
	var schedule = later.parse.text(rawSchedule);
	var startTime = later.schedule(schedule).next().getTime();
	var lastRunTime;
	var nextRunTime = startTime;

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
		api.rawSchedule = rawSchedule;
		api.run = run;

		Object.defineProperty(api, "nextRunTime", { 
			get: function(){ return nextRunTime; },
			enumerable: true
		});
		
		Object.defineProperty(api, "lastRunTime", { 
			get: function(){ return lastRunTime; },
			enumerable: true
		});

		Object.defineProperty(api, "lastResult", { 
			get: function(){ return lastResult; },
			enumerable: true
		});

		return api;
	};

	function run(){
		var nextTwo = later.schedule(schedule).next(2);
		lastRunTime = nextRunTime;
		nextRunTime = nextTwo[1].getTime(); // index 0 is the current one

		try{
			lastResult = compiledScript.runInNewContext(context);
		} catch(err){
			lastResult = err;
		}
	}

	return getApi();
};