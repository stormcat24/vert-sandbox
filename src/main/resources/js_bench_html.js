var vertx = require('vertx');
var container = require('vertx/container');

var server = vertx.createHttpServer();
var routeMatcher = new vertx.RouteMatcher();
var logger = container.logger;

routeMatcher.get('/bench_html', function(request){
  var html = 'Hello World!!<br/>';
  html += '<ul>';
  for (var i = 1; i <= 120; i++) {
    html += '<li>Vert.x（バーテックス）のベンチマークテストです。その' + i + '</li>';
  }
  html += '</ul>';
  request.response.putHeader('content-type', 'text/html;charset=UTF-8');
  request.response.end(html);
});

routeMatcher.get('/bench_img', function(request){
  request.response.putHeader('content-type', 'image/png');
  request.response.sendFile('img/img.png');
});

routeMatcher.get('/bench_call_api', function(request){
  logger.info('recieved request.');
  var client = vertx.createHttpClient();
  client.port(9000);
  client.host('127.0.0.1');

  client.getNow('/api', function(response){
    response.dataHandler(function(buffer) {
      var json = buffer.getString(0, buffer.length(), 'UTF-8');
      request.response.putHeader('content-type', 'application/json;charset=UTF-8');
      request.response.end(json);
    });
  });
});

server.requestHandler(routeMatcher).listen(3000, '127.0.0.1');
