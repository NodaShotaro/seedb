(function() {
  "use strict";

  var java = require("java");
  var io = require("socket.io");
  var express = require("express");
  var hbs = require("express-hbs");
  var connectAssets = require("connect-assets");

  java.classpath.push("../SeeDB-java-backend/lib/postgresql-9.2-1000.jdbc4.jar");
  java.classpath.push("../SeeDB-java-backend/lib/py4j0.8.jar");
  java.classpath.push("../SeeDB-java-backend/lib/jackson-annotations-2.3.0.jar");
  java.classpath.push("../SeeDB-java-backend/lib/jackson-core-2.3.0.jar");
  java.classpath.push("../SeeDB-java-backend/lib/jackson-databind-2.3.0.jar");
  java.classpath.push("../SeeDB-java-backend/bin/");

  java.options.push("-Xdebug");
  java.options.push("-agentlib:jdwp=transport=dt_socket,address=8888,server=y,suspend=n");

  var app = express();
  app.engine("html", hbs.express3({
    partialsDir: __dirname + "/views/partials",
    contentHelperName: "content"
  }));
  app.set("view engine", "html");
  app.set("views", __dirname + "/views");

  app.use(connectAssets());

  app.get("/", function (req, res) {
    res.render("index");
  });

  hbs.registerHelper("js", function(path) {
    return js(path);
  });

  hbs.registerHelper("css", function(path) {
    return css(path);
  });

  var server = require("http").createServer(app);

  io = io.listen(server);

  io.sockets.on("connection", function(socket) {
    var query_processor = java.newInstanceSync("core.QueryProcessor");

    // set up runtime settings
    var runtime_settings = java.newInstanceSync("utils.RuntimeSettings");
    query_processor.setRuntimeSettingsSync(runtime_settings);

    socket.on("call", function(options, callback) {
      var response = query_processor[options.methodName + "Sync"].apply(query_processor, options.args);
      var objectMapper = java.newInstanceSync("com.fasterxml.jackson.databind.ObjectMapper");
      var jsonObject = JSON.parse(objectMapper.writeValueAsStringSync(response));

      callback(jsonObject);
    });
  });

  server.listen(8000);
}());
