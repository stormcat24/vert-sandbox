package example.vert;

import org.vertx.java.core.Handler;
import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.http.HttpClient;
import org.vertx.java.core.http.HttpClientResponse;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.http.RouteMatcher;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

public class JavaVerticle extends Verticle {

	@Override
	public void start() {
		HttpServer server = vertx.createHttpServer();
		RouteMatcher routeMatcher = new RouteMatcher();
		final Logger logger = container.logger();
		
		routeMatcher.get("/bench_html", new Handler<HttpServerRequest>() {
			@Override
			public void handle(HttpServerRequest request) {
				StringBuilder builder = new StringBuilder();
				builder.append("Hello World!!<br/>");
				builder.append("<ul>");
				for (int i = 1; i <= 120; i++) {
					builder.append(String.format("<li>Vert.x（バーテックス）のベンチマークテストです。その%d</li>", i));
				}
				builder.append("</ul>");
				request.response().putHeader("content-type", "text/html;charset=UTF-8");
				request.response().end(builder.toString());
			}
		});
		
		routeMatcher.get("/bench_img", new Handler<HttpServerRequest>() {
			@Override
			public void handle(HttpServerRequest request) {
				request.response().putHeader("content-type", "image/png");
				request.response().sendFile("img/img.png");
			}
		});
		
		routeMatcher.get("/bench_call_api", new Handler<HttpServerRequest>() {
			@Override
			public void handle(final HttpServerRequest request) {
				logger.info("recieved request.");
				HttpClient client = vertx.createHttpClient()
				  .setHost("127.0.0.1")
				  .setPort(9000);
				
				client.getNow("/api", new Handler<HttpClientResponse>() {
					@Override
					public void handle(HttpClientResponse response) {
						response.dataHandler(new Handler<Buffer>() {
							@Override
							public void handle(Buffer data) {
								String json = data.getString(0, data.length(), "UTF-8");
								logger.info(json);
								request.response().putHeader("content-type", "application/json;charset=UTF-8");
								request.response().end(json);								
							}
						});
					}
				});
				
			}
		});
		
		server.requestHandler(routeMatcher).listen(3000, "127.0.0.1");
	}
	
}
