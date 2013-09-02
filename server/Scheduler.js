var EventEmitter = require('events').EventEmitter,
	BinaryHeap = require('./BinaryHeap.js'),
	createLevelDB = require('level'),
	createJob = require('./Job.js'),
	generateId = require('node-uuid').v4;

// This is the longest timeout allowed
var MAX_TIMEOUT = 2147483647; // 2^31 - 1 milliseconds, about 24 days

function removeFromArray(arr, val){
	var index = arr.indexOf(val);
	arr.splice(index, 1);
}

function noop(){};

module.exports = function createScheduler(callback){
	var db = createLevelDB('./storage', {valueEncoding: 'json'}),
		timer,
		id,
		emitter = new EventEmitter(),
		jobMap = {},
		jobIds,
		upSince,
		partners,
		jobQueue = new BinaryHeap(function(item){
			return item.nextRunTime;
		});

	function get(jobId){
		if(jobId === void 0) return getJobList();
		return jobMap[jobId];
	}

	function getJobList(){
		return Object.keys(jobMap).map(function(id){ return jobMap[id]; });
	}

	function update(job, callback){
		callback = callback || noop;
		if(!job.id in jobMap) return callback(new Error("Can't find job"));

		db.put(job.id, job.config, function(err){
			if(err) return callback(err);
			
			if(jobQueue.contains(job)){
				jobQueue.remove(job);	
			}

			if(!job.error) jobQueue.push(job);
			resetTimer();

			callback(job);
		});
	}

	// Adds a new job to the storage
	function add(job, callback){
		callback = callback || noop;
		if(job.id in jobMap) return callback(new Error("Job already exists"));

		db.put(job.id, job.config, function(err){
			if(err) return callback(err);

			// Update job ids list
			jobIds.push(job.id);

			db.put('jobIds', jobIds, function(err){
				// rollback in case of error
				if(err){
					db.del(job.id);
					removeFromArray(jobIds, job.id);
					return callback(err);
				}

				load(job);

				emitter.emit('job added', job);
				callback(job);	
			});
		});
	}

	// Loads existing job to memory, used internally by add(job)
	function load(job){
		jobMap[job.id] = job;

		if(job.error) return;

		jobQueue.push(job);
		
		// If the job we pushed is next in the queue
		// then we need to reset the timer
		if(jobQueue.peek() === job){
			resetTimer();
		}
	}

	// Removes existing job from memory and storage
	function remove(job, callback){
		callback = callback || noop;
		if(!job.id in jobMap) return callback(new Error("Can't find job"));
		
		db.del(job.id, function(err){
			if(err) return callback(err);

			removeFromArray(jobIds, job.id);
			db.put('jobIds', jobIds, function(err){
				if(err) return callback(err);

				if(!job.error){
					var nextInLine = jobQueue.peek() === job;

					// If this job was next in line, we need
					// to reset the timer after we remove it from
					// the queue
					jobQueue.remove(job);

					if(nextInLine){
						resetTimer();
					}
				}

				delete jobMap[job.id];

				emitter.emit('job removed', job);
				callback(job);
			});
		});
	}

	// Refreshes the timer to the next job in queue
	function resetTimer(){
		clearTimeout(timer);
		setTimer();
	}

	// Sets the timer so that it wakes the process for the next
	// job in the queue
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

	function loadJobs(){
		db.get('jobIds', function(err, val){
			if(err){
				jobIds = [];
			} else {
				jobIds = val;
			}

			var counter = 0,
				length = jobIds.length;

			if(length === counter){
				callback(getApi());
				return;
			}

			jobIds.forEach(function(jobId){
				db.get(jobId, function(err, jobConfig){
					counter++;

					if(err){
						removeFromArray(jobIds, jobId);
					} else {
						load(createJob(jobConfig));						
					}

					if(counter === length){
						callback(getApi());
					}
				});
			});
		});
	}

	// Initializes object from persistant store
	function init(){
		db.get('id', function(err, val){
			upSince = Date.now();

			if(err){
				id = generateId();
				db.put('id', id, loadJobs);	
			} else {
				id = val;
				loadJobs();
			}
		});
	}

	function getApi(){
		var api = {
			id: id,
			jobs: jobIds,
			partners: partners,
			upSince: upSince,
			add: add,
			remove: remove,
			get: get,
			update: update,
			on: emitter.on.bind(emitter),
			removeListener: emitter.removeListener.bind(emitter)
		};

		return api;
	}

	init();
};
