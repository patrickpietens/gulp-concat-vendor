"use strict";

var gulp = require("gulp"),
	gutil = require("gulp-util"),
	through2 = require("through2"),
	util = require("util"),
	fs = require("fs"),	
	toposort = require("toposort-class"),	
	concat = require("gulp-concat");

module.exports = function(filename, sources) {
	if (!filename) {
		throw new gutil.PluginError("gulp-concat-vendor", "Required parameter filename is missing");
	}

	var mySources = {},
		myFiles = [],
		myInfo = [];			

	var bufferContents = function(file, enc, callback) {
		if(file.isStream()) {
			this.emit("error", new gutil.PluginError("gulp-concat-vendor", "Streaming not supported"));
			return callback();
		}

		if(!file.isNull()) {
			myFiles.push(file.path);
			return callback();
		}
		
		var myPath = util.format("%s/bower.json", file.path);
		fs.readFile(myPath, "utf8", function(error, data) {
			if(!!error || !data) {
				return callback();
			}

			var myData = JSON.parse(data),
				mySourcePath = util.format("%s/%s", file.path, myData.main);

			myInfo.push(myData);
			mySources[myData.name] = mySourcePath;

			callback();
		});
	};

	var endStream = function() {		
		var mySort = new toposort();
		
		myInfo.forEach(function(data) {
			var myDependencies = [];
			if(!!data.dependencies) {
				myDependencies = Object.keys(data.dependencies);
			}		

			mySort.add(data.name, myDependencies);
		});

		myFiles.push.apply(myFiles, mySort.sort().reverse().map(function(name) {
			return mySources[name];
		}));

		gulp.src(myFiles)
			.pipe(concat(filename))
			.on("data", function(data) {
				this.push(data);
				this.emit("end");
			}.bind(this));	
	}

	return through2.obj(bufferContents, endStream);
};