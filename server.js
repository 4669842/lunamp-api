// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const util = require('util')
var request = require('request');
var fs = require('fs');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.get('/update', function(req, res){ 
  request.get('https://ci.appveyor.com/api/projects/gavazquez/lunamultiplayer/', function (error, response, body) {
    var jsonContent = JSON.parse(body);
    res.send("Luna Endpoint is using version:"+jsonContent.build.version)
      if (!error == null){
      console.log('error:', error); // Print the error if one occurred and handle it
      }console.log(jsonContent.build.jobs)// Print the response status code if a response was received
  }).pipe(fs.createWriteStream('data.json'));
})

app.get('/', function(req, res){ 

   res.sendFile(__dirname + '/views/index.html');
})

app.get('/latest', function(req, res){ 
 var contents = fs.readFileSync("data.json");
// Define to JSON type
 var jsonContent = JSON.parse(contents);
  
 var lunaJobId = JSON.stringify(jsonContent.build.jobs[0].jobId, null, 0);
  lunaJobId = lunaJobId.split('"').join("");
  console.log(lunaJobId)
  res.redirect('https://ci.appveyor.com/api/buildjobs/'+lunaJobId+'/artifacts/LunaMultiplayer-Debug.zip')
})

app.get('/version', function(req, res){ 
 var contents = fs.readFileSync("data.json");
// Define to JSON type
 var jsonContent = JSON.parse(contents);
  
 var lunaVersion = JSON.stringify(jsonContent.build.version, null, 0);
  lunaVersion = lunaVersion.split('"').join("");
  res.send(lunaVersion);
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
