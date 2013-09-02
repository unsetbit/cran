var vm = require('vm'),
	generateId = require('node-uuid').v4,
	later = require('later');

module.exports = function createJob(config){
	if(!config) config = {};

	var scheduleError = '',
		scriptError = '',
		compiledSchedule,
		compiledScript,
		lastResult,
		lastRunTime,
		nextRunTime;

	if(!('id' in config)) config.id = generateId();
	if(!('creationTime' in config)) config.creationTime = Date.now();
	if('script' in config) compileScript(config.script);
	if('schedule' in config) compileSchedule(config.schedule);

	function compileSchedule(val){
		compiledSchedule = later.parse.text(val);
		if(~compiledSchedule.error){
			scheduleError = "Error in schedule near: " + val.substr(compiledSchedule.error);
			nextRunTime = undefined;
		} else {
			scheduleError = undefined;
			nextRunTime = later.schedule(compiledSchedule).next().getTime();
		}
	}

	function compileScript(val){
		try{
			compiledScript = vm.createScript(val, config.name);
			scriptError = undefined;
		} catch(err){
			scriptError = err.stack;
		}
	}

	function setSchedule(val){
		if(config.schedule === val) return;

		config.schedule = val;
		compileSchedule(val);
	}

	function setScript(val){
		if(config.script === val) return;

		config.script = val;
		compileScript(val);
	}

	function run(){
		if(scriptError || scheduleError) return;

		var nextTwo = later.schedule(compiledSchedule).next(2);
		lastRunTime = nextRunTime;
		nextRunTime = nextTwo[1].getTime(); // index 0 is the current one

		try{
			lastResult = compiledScript.runInNewContext({
				require: require,
				console: console
			});
		} catch(err){
			scriptError = err.stack;
		}
	}

	function getApi(){
		var api = {};
		
		api.config = config;
		api.run = run;
		
		Object.defineProperty(api, "nextRunTime", { 
			get: function(){ return nextRunTime; },
			enumerable: true
		});

		Object.defineProperty(api, "lastRunTime", { 
			get: function(){ return lastRunTime; },
			enumerable: true
		});
		
		Object.defineProperty(api, "error", { 
			get: function(){
				if(scheduleError && scriptError){
					return scheduleError + '\n' + scriptError;
				} 

				return scheduleError || scriptError; 
			},
			enumerable: true
		});
		
		Object.defineProperty(api, "id", { 
			get: function(){ return config.id; },
			enumerable: true
		});

		Object.defineProperty(api, "name", {
			get: function(){ return config.name; },
			set: function(val){ config.name = val; },
			enumerable: true	
		});

		Object.defineProperty(api, "schedule", {
			get: function(){ return config.schedule; },
			set: setSchedule,
			enumerable: true	
		});
		
		Object.defineProperty(api, "script", {
			get: function(){ return config.script; },
			set: setScript,
			enumerable: true
		});

		return api;		
	}

	return getApi();
};