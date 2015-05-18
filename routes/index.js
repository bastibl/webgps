var express = require('express');
var router = express.Router();
var gpsd = require('node-gpsd');


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

  gps_listener.on('TPV', function(tpv) {
    console.log(tpv);
    _sse("update", tpv);
  });
});

module.exports = router;
