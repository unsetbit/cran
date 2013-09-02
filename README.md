# Cran is like cron.

Cran is a JavaScript job scheduler with a friendly interface.
You can require any native node module in your job scripts along with 'request'.

1. Install: `sudo npm install -g cran`
2. Run: `cran`
3. Navigate a local browser to: [http://localhost:2726](http://localhost:2726)

Your schedule is parsed by [later](http://bunkat.github.io/later/parsers.html#text). 
Write it in plain English, like "every 2 seconds" or "on Tuesday at 2:00pm" or "every 2 hours on the last day of the month except at 2:00 pm" and so on...
