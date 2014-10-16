var fs = require( 'fs' );
var through = require( 'through2' );

var sDefaultFilename = 'scssreport.log';
var wrStream = null;
var sFilename = null;
var bAligned = false;

module.exports = function( oOptions ) {
	oOptions = oOptions || {};
	oOptions.filename = oOptions.filename || sDefaultFilename;
	bAligned = oOptions.aligned || bAligned;

	console.log( "gulp-scss-lint-reporter: Writing log to: " + oOptions.filename );
	if( wrStream && sFilename !== oOptions.filename ) {
		wrStream.end();
		wrStream = null;
	}
	if( !wrStream ) {
		wrStream = fs.createWriteStream( oOptions.filename );
		sFilename = oOptions.filename;
	}

	return through.obj( function( fFile, enc, cb ) {
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

		var asOutput = [];
		asOutput.push('LEGEND: [LINE,CHARACTER] (ERROR TYPE) DESCRIPTION');
		for( var a in jsonObj.lint.file ) {
			var currentFile = jsonObj.lint.file[a];
			asOutput.push( currentFile.issue.length + " errors found in: " + currentFile.$.name );
			var sLocationInfo = '';
			var sFirstTabs = '\t';
			var sSecondTabs = '\t';
			for( var b in currentFile.issue ) {
				// Reset tabs
				sFirstTabs = '\t';
				sSecondTabs = '\t';
				// Calulate tabs for aligning
				var currentIssue = currentFile.issue[b];
				sLocationInfo = '[' + currentIssue.$.line + ',' + currentIssue.$.column + ']';
				if( bAligned && sLocationInfo.length < 8 ) { sFirstTabs += '\t'; }
				var sErrorType = '(' + currentIssue.$.linter + ')';
				var iLength = sErrorType.length;
				while( bAligned && iLength < 24 ) {
					iLength += 4;
					sSecondTabs += '\t';
				}
				asOutput.push( '\t' + sLocationInfo + sFirstTabs + sErrorType + sSecondTabs + currentIssue.$.reason );
			}
		}
		wrStream.write( asOutput.join('\n') );
	} );
};
