## Information

<table>
<tr>
<td>Package</td><td>gulp-scss-lint-reporter</td>
</tr>
<tr>
<td>Description</td>
<td>A simple reporter for gulp-scss-lint. Requires a report first generated from gulp-scss-lint and then transformed to JSON via gulp-xml2json or gulp-xml2js.</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.3</td>
</tr>
</table>

## Install

    Add "gulp-scss-lint-reporter": "https://github.com/ShoeLuver/gulp-scss-lint-reporter/tarball/{latest hash}" to your package.json dependencies.
    npm install from your package.json directory.

## Usage

```javascript
var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');
var xml2json = require('gulp-xml2js');
var lintReadable = require('gulp-scss-lint-reporter');

// Create xml scss lint report
gulp.task( 'validateSCSS', function() {
	return gulp.src(paths.someSCSS)
				.pipe(scssLint({
					reporterOutput: './reports/scssreport.xml'
				}));
});
// Turn xml scss lint report into JSON
gulp.task( 'jsonSCSSReport', ['validateSCSS'], function() {
	return gulp.src('./reports/scssreport.xml')
				.pipe(xml2json())
				.pipe(gulp.dest('./reports'));
});
// JSON scss lint report into readable
gulp.task( 'prettySCSSReport', ['jsonSCSSReport'], function() {
	return gulp.src('./reports/scssreport.json' )
				.pipe( lintReadable({
					filename: './reports/scssreport.log',
					aligned: true
				}));
});
```
'\> gulp prettySCSSReport'<br>
## Options

Plugin options:

Type: `filename`
Default: `"scssreport.log"`

The filename to write output from scsslint. When linting is successfull, the file is not created.

Type: `aligned`
Default: `false`

Normally 1 tab is placed between the [LINE,CHAR] and the (ERRORTYPE) entires creating something like;<br>
```
[12,14]	(SelectorFormat)	Selector 'fakeSelectorThing' should be written in lowercase with hyphens
[23,1]	(SingleLinePerSelector)	Each selector in a comma sequence should be on its own line
[180,19]	(EmptyLineBetweenBlocks)	Rule declaration should be followed by an empty line
```
<br>
if this option is set to 'true' then they are tabbed evenly to create visual columns;<br>
```
[12,14]		(SelectorFormat)			Selector 'fakeSelectorThing' should be written in lowercase with hyphens
[23,1]		(SingleLinePerSelector)		Each selector in a comma sequence should be on its own line
[180,19]	(EmptyLineBetweenBlocks)	Rule declaration should be followed by an empty line
```
<br>
## LICENSE

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
