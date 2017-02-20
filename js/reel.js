
function Reel( id, def, parent ) {

	console.log('new Reel('+def+', '+parent+')');
	
	//var symbols = [];
	// console.log('parent.add:'+parent.add);
	// for ( var a in parent.add ) {
		// console.log('parent.add['+a+']:'+parent.add[a]);
	// }
	// console.log('parent.add.group:'+parent.add.group);
	var reelSymbols = [];
	var symbolGroup = game.add.group();
	parent.add(symbolGroup);
	
	var createSymbols = function() {
		// console.log(' - symbolHeight:'+symbolHeight);
		for ( var n = 0; n < def.length; n++ ) {
			// console.log('create symbol '+n);
			var y = n*symbolHeight;
			// console.log('n:'+n);
			// console.log('def[n]:'+def[n]);
			// console.log('symbols[def[n]]:'+symbols[def[n]]);
			symbol = symbolGroup.create( id*symbolWidth, n*symbolHeight, symbols[def[n]] );
			symbol.scale.setTo( 0.2, 0.2 );
			// symbol.alpha = 0.2;
			reelSymbols.push( symbol );
		}
		// console.log('PIXI:'+PIXI);
		// for ( var a in PIXI ) {
			// console.log('PIXI['+a+']:'+PIXI[a]);
		// }
		// console.log('PIXI.filters:'+PIXI.filters);
		// console.log('PIXI.filters.GlowFilter:'+PIXI.filters.GlowFilter);
		
		// symbol.filters = [ new PIXI.filters.GlowFilter(viewWidth, viewHeight, distance, outerStrength, innerStrength, color, quality) ];
		// game.add.filter( 
		
		// var blurFilter1 = new PIXI.filters.BlurFilter();
		// var blurFilter2 = new PIXI.filters.BlurFilter();

		// symbol.filters = [blurFilter1];
		
		// symbol.filters = new GlowFilter( 100, 100, 1, 2, 1, '#FF0000', 0.001, true );

	}
	
	
	createSymbols();
	
	this.isSpinning = false;
	
	var tween;
	var index;
	
	this.spin = function( symbolIndex, callback ) {
		// console.log('spin');
		// console.log('this:'+this);
		// console.log('callback:'+callback);
		this.isSpinning = true;
		tween = game.add.tween(symbolGroup).to( { y: -symbolHeight*symbolIndex }, 2000, Phaser.Easing.Sinusoidal.InOut, true);
		tween.onComplete.add( 	function() {
									// console.log('this:'+this);
									// console.log('callback:'+callback);
									this.isSpinning = false;
									index = symbolIndex;
									callback();
								}, this );
	}
	
	this.highlight = function( n ) {
		for ( var i = 0; i < 3; i++ ) {
			if ( i == n ) reelSymbols[index+i].alpha = 1;
			else reelSymbols[index+i].alpha = 0.2;
		}
	}
	
	this.removeHighlight = function() {
		for ( var i = 0; i < 3; i++ ) {
			reelSymbols[index+i].alpha = 1;
		}
	}
	
	this.dim = function() {
		for ( var i = 0; i < 3; i++ ) {
			reelSymbols[index+i].alpha = 0.2;
		}
	}
	
}