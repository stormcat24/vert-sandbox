var express = require('express');
var server = express();

server.get('/api', function(request, response) {
  console.log('request received.');
  setTimeout(function(){
    response.json({id: 10000, name: "vert.x response"});
    console.log('response end');
  }, 100);
  console.log('end');
});

server.listen(9000);
