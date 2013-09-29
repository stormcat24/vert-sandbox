var express = require('express');
var server = express();
var http = require('http');

server.get('/bench_html', function(request, response) {
  var html = 'Hello World!!<br/>';
  html += '<ul>';
  for (var i = 1; i <= 120; i++) {
    html += '<li>Vert.x（バーテックス）のベンチマークテストです。その' + i + '</li>';
  }
  html += '</ul>';
  response.send(html);
});

server.get('/bench_img', function(request, response) {
  response.sendfile('src/main/resources/img/img.png');
});

server.get('/bench_call_api', function(request, response) {
  var options = {
    host: '127.0.0.1',
    port: 9000,
    path: '/api'
  };

  console.log('start');
  http.get(options, function(apiRes) {
    console.log('receive!');
    var body = '';
    apiRes.on('data', function(data){
      body += data;
    });
    apiRes.on('end', function(){
      console.log(body);
      response.send(body);
    });
  });
});

server.listen(3001);
