var EventEmitter = require('events').EventEmitter,
	BinaryHeap = require('./BinaryHeap.js');

// This is the longest timeout allowed
var MAX_TIMEOUT = 2147483647; // 2^31 - 1

module.exports = function createScheduler(){
	var timer;
	var emitter = new EventEmitter();
	var jobMap = {};

	var jobQueue = new BinaryHeap(function(item){
		return item.nextRunTime;
	});

	function getApi(){
		return {
			add: add,
			remove: remove,
			get: get,
			on: emitter.on.bind(emitter),
			removeListener: emitter.removeListener.bind(emitter)
		};
	}

	function get(jobId){
		if(jobId === void 0) return jobMap;
		return jobMap[jobId];
	}

	function add(job){
		if(job.id in jobMap) return;

		jobQueue.push(job);
		jobMap[job.id] = job;

		// If the job we pushed is next in the queue
		// then we need to reset the timer
		if(jobQueue.peek() === job){
			resetTimer();
		}

		emitter.emit('job added', job);
	}

	function remove(job){
		if(!(job.id in jobMap)) return;
		
		if(jobQueue.peek() === job){
			// If this job was next in line, we need
			// to reset the timer after we remove it from
			// the queue
			jobQueue.remove(job);
			resetTimer();
		} else {
			jobQueue.remove(job);	
		}

		delete jobMap[job.id];

		emitter.emit('job removed', job);
	}

	function resetTimer(){
		clearTimeout(timer);
		setTimer();
	}

	function setTimer(){
		var nextJob = jobQueue.peek();

		if(nextJob){
			var timeout = nextJob.nextRunTime - Date.now();
			if(timeout < MAX_TIMEOUT){
				if(timeout < 1){
					// If next event was in the past, then execute now
					setImmediate(runJobs);
				} else {
					// Set timeout for the nearest future event
					timer = setTimeout(runJobs, timeout);
				}

				return;
			}
		}

		// If we can't do anything within MAX_TIMEOUT, then idle
		timer = setTimeout(setTimer, MAX_TIMEOUT);
	}

	function runJobs(){
		var now = Date.now(),
			job = jobQueue.peek();

		while(job.nextRunTime < now){
			jobQueue.pop();
			job.run();
			jobQueue.push(job);

			job = jobQueue.peek();
		}

		setTimer();
	}

	return getApi();
};
