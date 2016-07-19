var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var router = express.Router();

var s3 = new AWS.S3();
var zackbuckets;
s3.listBuckets(function (err, data) {
  if (err) { console.log("Error:", err); }
  else {
    for (var index in data.Buckets) {
      var bucket = data.Buckets[index];
      console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
    }
    zackbuckets = data.Buckets;
  }
});



app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '192.168.74.75');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

router.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.json(zackbuckets);

  // var fft = require('fft-js').fft,
  //   signal = [1, 0, 1, 0];

  // var phasors = fft(signal);

  // console.log(phasors)

});

var fs = require('fs');

router.get('/:bucket/:key*', function (req, res) {
  console.log("about page");
  res.setHeader('Content-Type', 'application/json');


 console.log(req.params.bucket);
 console.log(req.params.key);

 // res.json(req.params.key + req.param(0));

  var params = { Bucket: req.params.bucket, Key: req.params.key + req.param(0) };
  var file = require('fs').createWriteStream('./file.txt');


  var channel1Array = [];
  var channel2Array = [];

  s3.getObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      // console.log(data.Body.toString());
      var lineArray = data.Body.toString().split(/\r\n|\n|\r/);
      console.log(lineArray);

      for (i = 0; i < lineArray.length; i++) {
        var itemArray = lineArray[i].split('\t');
        channel1Array.push(itemArray[2]);
        channel2Array.push(itemArray[3]);

      }


    }

    var channelNumber = channel1Array.map(function(item) {
    return parseInt(item, 10);
    });

    var channelNumber1 = channel2Array.map(function(item) {
    return parseInt(item, 10);
    });

    console.log(channelNumber);
    var fft = require('fft-js').fft,
      fftUtil = require('fft-js').util,
      signal = channelNumber.slice(0,256);

    var phasors = fft(signal);

    var frequencies = fftUtil.fftFreq(phasors, 256), // Sample rate and coef is just used for length, and frequency step
      magnitudes = fftUtil.fftMag(phasors);


    var jsonObj = {frequency:[] , leftChannel:[]};

    var both = frequencies.map(function (f, ix) {
      return { frequency: f, magnitude: magnitudes[ix] };
    });

    jsonObj.frequency = both;
    jsonObj.leftChannel = channelNumber;

    console.log(jsonObj);

   res.json(jsonObj);
  });

  //   var readstream = s3.getObject(params).createReadStream();
  //   readstream.on('readable', function() {
  //   // stream is ready to read
  //   var data = readstream.read();
  //    console.log(data);
  // });

  // filename = './file.txt';
  // fs.readFile(filename, 'utf8', function (err, data) {
  //   if (err) throw err;
  //   console.log('OK: ' + filename);
  //   console.log("err: " + err);
  //   console.log(data);
  // });
});

module.exports = router;

app.use('/', router);
var server = app.listen(9000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})








