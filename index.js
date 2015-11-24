"use strict";

var gulp = require("gulp"),
        path = require("path"),
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
		myLibs = [],
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

		var myPath = util.format("%s/.bower.json", file.path);
		fs.exists(myPath, function(exists) {
  			if (exists) {
				fs.readFile(myPath, "utf8", function(error, data) {
					if(!!error || !data) {
						return callback();
					}

					var myData = JSON.parse(data);

					if(!!myData.main  && path.extname( myData.main ) == '.js') {
						var myMain = [].concat(myData.main),
							mySourcePath = util.format("%s/%s", file.path, myMain[0]);

						myInfo.push(myData);
						mySources[myData.name] = mySourcePath;

						callback();
					}
					else {
						console.log(util.format("Skipping library @ %s. Bower.js is missing 'main' property or it is not a JS filtype.", file.path));
						callback();
					}
				});
  			} else {
    			console.log(util.format("Skipping library @ %s. Couldn't find %s", file.path, myPath));
    			callback();
  			}
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

		myLibs.push.apply(myLibs, mySort.sort().reverse().map(function(name) {
			return mySources[name];
		}));

		myLibs = myLibs.concat(myFiles);

		gulp.src(myLibs)
			.pipe(concat(filename))
			.on("data", function(data) {
				this.push(data);
				this.emit("end");
			}.bind(this));	
	}

	return through2.obj(bufferContents, endStream);
};
