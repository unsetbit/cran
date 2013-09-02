# Cran is like cron.

Cran is a JavaScript job scheduler with a friendly interface.

1. Install: `sudo npm install -g cran`
2. Run: `cran`
3. Navigate a local browser to: [http://localhost:2726](http://localhost:2726)

Here are some neat features:
* Use plain English to define your schedule (ex. "every 2 hours on the last day of the month")
* Edit script via the web app using [Ace](http://ace.c9.io/)
* Works on mobile devices
* `require()` any native or global node module in your job scripts

Note that your schedule is parsed by [later](http://bunkat.github.io/later/parsers.html#text) according to UTC (for example,
if you write "2:00pm", the system understands it as "2:00pm UTC").

Keep in mind that malicious scripts could be run via this tool, so don't make it visibile on any network where
there may be malice lurking. By default the server will only serve to localhost on port 2726, you can change this
by passing in `-h [hostname]:[port]` as a command line argument.

## Screenshots
### The Dashboard
<img src="http://ozan.io/cran/static/dashboard.png">
### The Edit Page
<img src="http://ozan.io/cran/static/edit-page.png"/>
