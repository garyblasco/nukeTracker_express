//var http = require('http');
var url = require('url');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://chapterthree:ChapterThree123$@ds119486.mlab.com:19486/chapterthree";

	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
 	console.log("Database created!");
 	db.close();


app.get('/', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	res.end('coming soon: chapter 3');
})

app.get('/addtarget', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	var q = url.parse(req.url, true).query;
	var txt = q.target + ' ' + q.date + ' ' + q.nukes; 
	res.write('Added! <br> zName: ' + q.target +'<br> Nukes: ' + q.nukes + '<br> Date & Time: ' + q.date + '<br>');
	res.end('<a href="http://test.com/?target=' + q.target + '&date=' + q.date + '&nukes=' + q.nukes + '">test url</a>');
})

app.get('/upcomingtargets', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	res.end('show the next 10 targets');
})

app.get('/upcomingtime', (req, res) => {
	res.writeHead(200, {'Content-type': 'text/html'});
	res.end('show all targets in next week');
})

app.listen(PORT, () => ('working!'))