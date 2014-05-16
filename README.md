## Information

<table>
<tr> 
<td>Package</td><td>gulp-concat-vendor</td>
</tr>
<tr>
<td>Description</td>
<td>Concatenates external libraries installed by [Bower](http://bower.io/) sorted by their dependencies</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

```javascript
var concat-vendor = require('gulp-concat-vendor');

gulp.task('scripts', function() {
  	gulp.src('./scripts/vendor/*')
		.pipe(vendor('vendor.js'))
		.pipe(gulp.dest('./dist/scripts'));  
});
```

This will concat all external libraries installed by [Bower](http://bower.io/). It will sort all files depending on their dependencies before concating. Libraries not installed with [Bower](http://bower.io/) - that is, when the bower.json file was not found - will be skipped.

Libraries like [Modernizr](http://modernizr.com/) don't use a bower.json file. Therefor you can add files manually to the concatenation, like so:

```javascript
var concat-vendor = require('gulp-concat-vendor');

gulp.task('scripts', function() {
	gulp.src([
		'./scripts/vendor/*',
		'./scripts/vendor/modernizr/modernizr.js'
	])
	.pipe(vendor('vendor.js'))
	.pipe(gulp.dest('./dist/scripts'));
});
```

## LICENSE

(MIT License)

Copyright (c) 2014

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
