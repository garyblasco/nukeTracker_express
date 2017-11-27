//var http = require('http');
const url = require('url');
const express = require('express');
const PORT = process.env.PORT || 8080
const Promise = require('promise');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://chapterthree:ChapterThree123$@ds119486.mlab.com:19486/chapterthree';
const moment = require('moment');
var db
	
MongoClient.connect(dbURL, (err, database) => {
	if (err) return console.log('Error!');
	db = database;
	return console.log('Connected!')
});

app.set('view engine', 'ejs');

// ROOT
app.get('/', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	res.end('coming soon: chapter 3');
})

// ADD TARGET
app.get('/addtarget', (req, res) => {

	var q = url.parse(req.url, true).query;
	var nukesInt = Number(q.nukes);
	console.log('Nuke Integer is now: ' + nukesInt);

// convert nuke string to integer, and define blockade length based on # of nukes

	var blockadeDays = nukesInt;
	if (blockadeDays >= 6) {
		blockadeDays = 6;};
	console.log('blockade days: ' + blockadeDays);

// convert time input to UTC moment
	
	var startDate = moment.utc(q.date); // 	
	console.log(startDate);
	
// define blockade end time UTC based on time input + blockade length

	var endDate = moment.utc(q.date);
	endDate = moment.utc(endDate).add(blockadeDays, 'days');
	console.log(endDate);

// create locale blockade end time

	var endDateLocal = new Date(endDate);

// write target name, nukes, start time, end time to DB

	  var newTarget = { target: q.target, nukes: q.nukes, blockadeStart: startDate.format(), blockadeEnd:  endDate.format()};

	  db.collection("targets").insertOne(newTarget, function(err, res) {
		if (err) throw err;
		console.log("1 document inserted");
		});
		
	res.writeHead(200, {'Content-type': 'text/html'});
	var txt = q.target + ' ' + q.date + ' ' + q.nukes; 
	res.write('New target added! <br><br> <table cellpadding="4" border="1" style="border-collapse: collapse; border: 1px solid black"><tr><td>Target:<td>' + q.target +'<tr><td> Nukes at Start: <td>' + q.nukes + '<tr><td>Blockade Days:<td>' + blockadeDays + '<tr><td>Blockade Start UTC:<td>' + startDate.format() + '<tr><td>Blockade End UTC:<td>' + endDate.format() + '<tr><td>Blockade End Local:<td>' + endDate.toDate() + '</table>');
	res.end('<br><br><a href="http://test.com/?target=' + q.target + '&date=' + q.date + '&nukes=' + q.nukes + '">test url</a>');

});



	
// html response to confirm added target detail



// URL to test ID concatenation, could be removed now 



app.get('/upcomingtargets', (req, res) => {

	db.collection('targets').find().limit(3).sort({blockadeEnd: 1}).toArray((err, result) => {
	if (err) return console.log(err);
	console.log(result);
	res.render('index.ejs', {targets: result})
	});
});

app.get('/upcomingtime', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	res.end('show all targets in next week');
});

app.listen(PORT, () => ('working!'));