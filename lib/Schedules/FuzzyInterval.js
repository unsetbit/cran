var Interval = require('./Interval.js');

// All time values are in milliseconds
module.exports = function createFuzzyInterval(interval, fuzz, startTime){
	var interval = Interval(interval, startTime),
		doubleFuzz = fuzz * 2;
	
	function getFuzz(){
		return Math.round(Math.random() * doubleFuzz - fuzz);
	}

	return function getNextTime(){
		return interval() + getFuzz();	
	};
};