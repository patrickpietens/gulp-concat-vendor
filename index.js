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
		myInfo = [];			

	var bufferContents = function(file, enc, callback) {
		if (!file.isNull()) {
			this.emit("error", new gutil.PluginError("gulp-concat-vendor", "Files not supported"));
			return;
		}

		if (file.isStream()) {
			this.emit("error", new gutil.PluginError("gulp-concat-vendor", "Streaming not supported"));
			callback();
		}
		
		var myRoot = file.path.replace(/\/+$/, "");
		try {				
			var myBower = util.format("%s/bower.json", myRoot),
				myRawData = fs.readFileSync(myBower, "utf8");			
		}
		catch(error) {
			gutil.log("Couldn't find", gutil.colors.magenta("bower.json"), " at ", gutil.colors.red(myRoot));
		}

		if(!!myRawData) {
			var myParsedData = JSON.parse(myRawData),
				mySource = util.format("%s/%s", myRoot, myParsedData.main);

			myInfo.push(myParsedData);
			mySources[myParsedData.name] = mySource;
		}

		callback();
	};

	var endStream = function() {
		// Create toposort which is used to sort based on dependencies
		var mySort = new toposort();

		// Go through all libraries and add them to to toposort
		myInfo.forEach(function(data) {

			// Exclude all files which aren't added by bower
			if(!!data) {
				var myDependencies = [];
				if(!!data.dependencies) {
					myDependencies = Object.keys(data.dependencies);
				}		

				mySort.add(data.name, myDependencies);
			}
		});

		// Finally do the actual sort and get all sources
		var mySortedSources = mySort.sort().reverse().map(function(name) {
			var mySource = mySources[name];
			gutil.log("Adding file", gutil.colors.green(mySource));

			return mySource;
		});

		gulp.src(mySortedSources).pipe(concat(filename)).on("data", function(data) {
			this.push(data);
			this.emit("end");
		}.bind(this));	
	}

	return through2.obj(bufferContents, endStream);
};