# Cran is like cron.

Cran is a JavaScript job scheduler with a friendly interface.
You can require any native node module in your job scripts along with 'request'.

1. Install: `sudo npm install -g cran`
2. Run: `cran`
3. Navigate a local browser to: [http://localhost:2726](http://localhost:2726)

Here are some neat features:
* Use plain English to define your schedule (ex. "every 2 hours on the last day of the month")
* Edit script via the web app using [Ace](http://ace.c9.io/)
* Works on mobile devices

Note that your schedule is parsed by [later](http://bunkat.github.io/later/parsers.html#text) according to UTC (for example,
if you write "2:00pm", the system understands it as "2:00pm UTC"). 

## Screenshots
### The Dashboard
<img src="http://ozan.io/cran/static/dashboard.png">
### The Edit Page
<img src="http://ozan.io/cran/static/edit-page.png"/>
