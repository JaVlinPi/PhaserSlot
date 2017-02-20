
function Winlines( winlineDef, parent ) { // parent == windisplay layer
	
	// create holder
	var winlineGroup = game.add.group();
	parent.add(winlineGroup);
	
	// create winlines
	var winlines = [];
	var lineMasks = [];
	var mask;
	var buffer = 10;
	for ( var i = 0; i < 2; i++ ) {
		lineMasks.push( mask = game.add.graphics(0,0) );
		mask.beginFill(0xffffff);
		mask.drawRect( -buffer, -buffer, symbolWidth*(i+2)+buffer, (symbolHeight+buffer)*2 );
		winlineGroup.add( mask );
		mask.visible = false;
		// mask.mask = reelsMask;
	}
	
	
	var line;
	for ( var i = 0; i < winlineDef.length; i++ ) {
		line = game.add.graphics(0,0);
		
		// set a fill and line style
		line.lineStyle(10, 0xffd900, 1);
		
		// draw a shape
		line.moveTo(0,winlineDef[i][0]*symbolHeight);
		for ( var n = 1; n < winlineDef[i].length; n++ ) {
			line.lineTo(n*symbolWidth,winlineDef[i][n]*symbolHeight);
		}
		winlineGroup.add( line );
		winlines.push( line );
		// console.log('line.visible:'+line.visible);
		line.visible = false;
	}
	
	// this.visible = false;
	
	this.showLine = function( index, length, callback ) {
		
		winlines[index].visible = true;
		if ( length >= 3 && length < 5 ) {
			winlineGroup.mask = mask = lineMasks[length-3];
			lineMasks[length-3].visible = true;
		}
		else {
			winlineGroup.mask = null;
		}
		
		game.time.events.add(Phaser.Timer.SECOND * 2,
								function() {
									winlines[index].visible = false;
									winlineGroup.mask = null;
									mask.visible = false;
									callback();
								});
		
	}
	
}