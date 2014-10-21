var fs = require( 'fs' );
var through = require( 'through2' );

var sDefaultFilename = 'scssreport.log';
var wrStream = null;
var sFilename = null;
var bAligned = false;
var n = 0;

module.exports = function( oOptions ) {
	oOptions = oOptions || {};
	oOptions.filename = oOptions.filename || sDefaultFilename;
	bAligned = oOptions.aligned || bAligned;

	return through.obj( function( fFile, enc, cb ) {
		var thisStream = fs.createWriteStream( oOptions.filename );
		var thisAligned = bAligned;
		if( fFile.isNull() ) {
			console.log( "gulp-scss-lint-reporter: Nothing to convert in json file." );
			return;
		}

		var jsonString = fFile.contents.toString();
		var jsonObj;
		try {
			jsonObj = JSON.parse( jsonString );
		} catch( SyntaxError ) {
			console.log( "gulp-scss-lint-reporter: File is not in valid JSON form." );
			return;
		}

		console.log( "gulp-scss-lint-reporter: Writing log to: " + oOptions.filename );
		var asOutput = [];
		asOutput.push('LEGEND: [LINE,CHARACTER] (ERROR TYPE) DESCRIPTION');
		for( var filename in jsonObj ) {
			var sCurrentFile = filename;
			var aoIssues = jsonObj[sCurrentFile];
			asOutput.push( aoIssues.length + " errors found in: " + sCurrentFile );
			
			var sLocationInfo = '';
			var sFirstTabs = '\t';
			var sSecondTabs = '\t';
			for( var oIssue in aoIssues ) {
				// Reset tabs
				sFirstTabs = '\t';
				sSecondTabs = '\t';
				// Calulate tabs for aligning
				sLocationInfo = '[' + aoIssues[oIssue].line + ',' + aoIssues[oIssue].column + ']';
				if( thisAligned && sLocationInfo.length < 8 ) { sFirstTabs += '\t'; }
				var sErrorType = '(' + aoIssues[oIssue].linter + ')';
				var iLength = sErrorType.length;
				while( thisAligned && iLength < 24 ) {
					iLength += 4;
					sSecondTabs += '\t';
				}
				asOutput.push( '\t' + sLocationInfo + sFirstTabs + sErrorType + sSecondTabs + aoIssues[oIssue].reason );
			}
		}
		thisStream.write( asOutput.join('\n') );
		cb(null, fFile);
	} );
};
