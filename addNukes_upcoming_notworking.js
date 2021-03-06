//var http = require('http');
var url = require('url');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080
const Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://chapterthree:ChapterThree123$@ds119486.mlab.com:19486/chapterthree';
const moment = require('moment');
var finalResult;

	function getTargets(err, db) {
	  if (err) throw err;
	  db.collection("targets").find({}).toArray(saveTargets)};
	  
	function saveTargets(err, result) {
	  	if (err) throw err;
	  	console.log(result);
	  	finalResult = result};
	  
/*	function printStuff (stuff) {
		console.log('is this working?');
		console.log(stuff[1].target)
*/

app.get('/', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	res.end('coming soon: chapter 3');
}) // '/'

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

	MongoClient.connect(dbURL, function(err, db) {
	  if (err) throw err;
	  var newTarget = { target: q.target, nukes: q.nukes, blockadeStart: startDate.format(x), blockadeEnd:  endDate.format(x)};
	  db.collection("targets").insertOne(newTarget, function(err, res) {
		if (err) throw err;
		console.log("1 document inserted");
		db.close();
	  });
	});
	
// html response to confirm added target detail

	res.writeHead(200, {'Content-type': 'text/html'});
	var txt = q.target + ' ' + q.date + ' ' + q.nukes; 
	res.write('New target added! <br><br> <table cellpadding="4" border="1" style="border-collapse: collapse; border: 1px solid black"><tr><td>Target:<td>' + q.target +'<tr><td> Nukes at Start: <td>' + q.nukes + '<tr><td>Blockade Days:<td>' + blockadeDays + '<tr><td>Blockade Start UTC:<td>' + startDate.format() + '<tr><td>Blockade End UTC:<td>' + endDate.format() + '<tr><td>Blockade End Local:<td>' + endDate.toDate() + '</table>');

// URL to test ID concatenation, could be removed now 

	res.end('<br><br><a href="http://test.com/?target=' + q.target + '&date=' + q.date + '&nukes=' + q.nukes + '">test url</a>');
})

app.get('/upcomingtargets', (req, res) => {


/* original find

	MongoClient.connect(dbURL, function(err, db) {
	  if (err) throw err;
	  db.collection("targets").find({}).toArray(function(err, result) {
	  	if (err) throw err;
	  	console.log(result);
	  	});
		db.close();
	});
*/

//		MongoClient.connect(dbURL, getTargets);
//		MongoClient.connect(dbURL, getTargets);
		res.writeHead(200, {'Content-type': 'text/html'});
//		res.end(finalResult[0].name); // just to verify
		res.end(function(err, write){
			if (err) throw err;
			var pleaseWork = MongoClient.connect(dbURL, getTargets);
			console.log('yayyy');
			pleaseWork});
			
		
});


app.get('/upcomingtime', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	res.end('show all targets in next week');
});

app.listen(PORT, () => ('working!'))