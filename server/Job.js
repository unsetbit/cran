var vm = require('vm'),
	generateId = require('node-uuid').v4,
	later = require('later');

module.exports = function createJob(){
	var id = generateId(),
		creationTime = Date.now(),
		name,
		script,
		compiledScript,
		schedule,
		rawSchedule,
		lastResult,
		hasError = false,
		lastRunTime,
		nextRunTime;

	function run(){
		var nextTwo = later.schedule(schedule).next(2);
		lastRunTime = nextRunTime;
		nextRunTime = nextTwo[1].getTime(); // index 0 is the current one

		// If an error occurred last time we tried to run the job, break early
		if(hasError) return;

		try{
			lastResult = compiledScript.runInNewContext({
				require: require,
				console: console
			});
		} catch(err){
			hasError = true;
			lastResult = err.stack;
		}
	}

	function setSchedule(val){
		if(val === rawSchedule) return;
		rawSchedule = val;
		schedule = later.parse.text(rawSchedule);
		nextRunTime = later.schedule(schedule).next().getTime();		
	}

	function setScript(val){
		if(val === script) return;
		script = val;
		compiledScript = vm.createScript(val, name);
		hasError = false;
	}

	return (function(){
		var api = {};
		
		api.id = id;
		api.creationTime = creationTime;
		api.run = run;

		Object.defineProperty(api, "schedule", {
			get: function(){ return schedule; }
		});

		Object.defineProperty(api, "nextRunTime", { 
			get: function(){ return nextRunTime; },
			enumerable: true
		});
		
		Object.defineProperty(api, "hasError", { 
			get: function(){ return hasError; },
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

		Object.defineProperty(api, "name", {
			get: function(){ return name; },
			set: function(val){
				name = val;
			},
			enumerable: true
		});

		Object.defineProperty(api, "rawSchedule", {
			get: function(){ return rawSchedule; },
			set: setSchedule,
			enumerable: true	
		});
		
		Object.defineProperty(api, "script", {
			get: function(){ return script; },
			set: setScript,
			enumerable: true
		});

		return api;		
	}());
};