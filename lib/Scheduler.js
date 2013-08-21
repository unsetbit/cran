var BinaryHeap = require('./BinaryHeap.js');

// This is the longest timeout allowed
var MAX_TIMEOUT = 2147483647; // 2^31 - 1

module.exports = function createScheduler(){
	var jobQueue, timer;

	jobQueue = new BinaryHeap(function(item){
		return item.nextRunTime;
	});

	function add(job){
		jobQueue.push(job);
		
		// If the job we pushed is next in the queue
		// then we need to reset the timer
		if(jobQueue.peek() === job){
			resetTimer();
		}
	}

	function remove(job){
		if(jobQueue.peek() === job){
			// If this job was next in line, we need
			// to reset the timer after we remove it from
			// the queue
			jobQueue.remove(job);
			resetTimer();
		} else {
			jobQueue.remove(job);	
		}
	}

	function resetTimer(){
		clearTimeout(timer);
		setTimer();
	}

	function setTimer(){
		var nextJob = jobQueue.peek(),
			timeout = nextJob.nextRunTime - Date.now();

		if(timeout > MAX_TIMEOUT){
			// If next event is too far out, then just idle
			timer = setTimeout(setTimer, MAX_TIMEOUT);
		} else if(timeout < 1) {
			// If next event was in the past, then execute now
			setImmediate(runJobs);
		} else {
			// Set timeout for the nearest future event
			timer = setTimeout(runJobs, timeout);
		}
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

	return {
		add: add,
		remove: remove
	};
};