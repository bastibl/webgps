var express = require('express');
var router = express.Router();
var gpsd = require('../node_modules/node-gpsd/lib/gpsd.js');


initSSE = function(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write("\n");

  return function(name, data, id) {
    res.write("event: " + name + "\n");
    if(id) {
      res.write("id: " + id + "\n");
    }
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}


var gps_listener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    logger:  {
        info: function() {},
        warn: console.warn,
        error: console.error
    },
    parse: true
});

gps_listener.connect(function() {
    gps_listener.watch();
});


router.get('/', function(req, res, next) {
  res.sendFile('/views/index.html', {root: __dirname + '/../'});
});

router.get('/updates', function(req, res) {
  var _sse = initSSE(res);

  req.once("end", function() {
    console.log('removing sendPost from event listeners');
    _timeline.removeListener("post", sendPost);
  });

  //function sendUpdate(string) {
  //  console.log('timeline sse: send post');
  //  console.log(string)
  //  vals = string.toString('ascii').split(" ");
  //  _sse("update", {x: parseInt(vals[0]), y: parseInt(vals[1])});
  //}

  gps_listener.on('TPV', function(tpv) {
    console.log(tpv);
    _sse("update", tpv);
  });
});

module.exports = router;
