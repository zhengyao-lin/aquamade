"use strict";

var express = require("express");

var app = express();

app.use("/", express.static("front"));
app.use("/main", express.static("front/main.html"));

var server = app.listen(3139, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("listening at " + host + ":" + port);
});
