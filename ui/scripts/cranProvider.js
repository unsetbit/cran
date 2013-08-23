module.exports = function(){
	'use strict';

	var emitter = new EventEmitter2();
	
	this.hostname = window.location.hostname;
	this.port = 80;
	
	var jobs = {};
	var ws;
	this.$get = function(){
		ws = new WebSocket('ws://' + this.hostname + ':' + this.port);
		ws.onmessage = function(event){
			var data = JSON.parse(event.data);
			eventHandler(data);
		};

		return {
			getJobs: getJobs,
			on: emitter.on.bind(emitter),
			removeListener: emitter.removeListener.bind(emitter),
			create: createJob
		};
	};

	function getJobs(){
		return Object.keys(jobs).map(function(jobId){
			return jobs[jobId];
		});
	}

	function createJob(job){
		var message = {
			type: 'create',
			job: job
		};
		console.log('sending', message);
		ws.send(JSON.stringify(message));
	}

	function eventHandler(data){
		switch(data.type){
		case 'job list':
			loadJobs(data.jobs);
			break;
		case 'job added':
			addJob(data.job);
			break;
		case 'job removed':
			removeJob(data.job.id);
			break;
		case 'job updated':
			updateJob(data.job);
			break;
		}

		emitter.emit('update', getJobs());
	}

	function loadJobs(jobsArray){
		jobsArray.forEach(function(job){
			addJob(job);
		});
	}

	function addJob(job){
		if(job.id in jobs){
			return;
		}

		jobs[job.id] = job;
		emitter.emit('job added', job);
	}

	function removeJob(jobId){
		var job = jobs[jobId];
		if(!job){
			return;
		}

		delete jobs[job.id];
		emitter.emit('job removed', job);
	}

	function updateJob(job){
		if(!(job.id in jobs)){
			return;
		}

		jobs[job.id] = job;
		emitter.emit('job updated', job);
	}
};
