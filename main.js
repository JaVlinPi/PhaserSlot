
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('cherry', 'assets/cherry.png');
	game.load.image('lime', 'assets/lime.png');
	game.load.image('peach', 'assets/peach.png');
	game.load.image('plum', 'assets/plum.png');
	game.load.image('raspberry', 'assets/raspberry.png');
	game.load.image('starfruit', 'assets/starfruit.png');
	game.load.image('watermelon', 'assets/watermelon.png');
	game.load.image('spin', 'assets/spin.png');
	game.load.image('star', 'assets/bullet56.png');
}

// values
var symbolWidth = 100;
var symbolHeight = 120;
var symbolsPerReel = 3;
var minWinLength = 3;
var symbols = [ 'cherry', 'lime', 'peach', 'plum', 'raspberry', 'starfruit', 'watermelon' ];
var reelSymbolDef = [[0,1,2,3,4,0,0,1,2,2,3,4,4],
					[1,2,1,2,0,0,0,1,2,2,3,4,4],
					[2,3,0,1,1,0,0,1,2,2,3,4,4],
					[3,4,4,0,2,0,0,1,2,2,3,4,4],
					[4,0,3,4,3,0,0,1,2,2,3,4,4]];
var winlineDef = [	[0,0,0,0,0],
					[1,1,1,1,1],
					[2,2,2,2,2],
					[0,1,0,1,0],
					[1,2,1,2,1],
					[1,0,1,0,1],
					[2,1,2,1,2],
					[0,1,1,1,0],
					[1,2,2,2,1],
					[1,0,0,0,1],
					[2,1,1,1,2],
					[0,2,2,2,0],
					[2,0,0,0,2],
					[0,0,1,0,0],
					[1,1,2,1,1],
					[1,1,0,1,1],
					[2,2,1,2,2],
					[0,2,0,2,0],
					[2,0,2,0,2],
					
					[2,0,1,0,2],
					[0,2,1,2,0]];
				
// layers
var reelsHolder, windisplay, effects, ui;

// components
var reels = [];
var spinBtn;
var winlines;

// vars
var i;  
var spinEnabled = false;
var spinResult = {
	reelIndexes: [],
	symbolResults: [],
	winlines: []
};

var emitter;
function create() {
	
	// game.input.mouse.capture = true;
	
	// layers
	reelsHolder = game.add.group();
	windisplay = game.add.group();
	effects = game.add.group();
	ui = game.add.group();
	
	// emitter
	game.physics.startSystem(Phaser.Physics.ARCADE);
	emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('star');
    emitter.gravity = 200;
	effects.add( emitter );
	
	// setup windisplay
	windisplay.x = 100+symbolWidth/2;
	windisplay.y = 100+symbolHeight/2;
	winlines = new Winlines( winlineDef, windisplay );
	//winlines.showLine( 3 );
	
	// setup ui
	spinBtn = ui.create( 580, 480, 'spin' );
	spinBtn.inputEnabled = true;
	spinBtn.events.onInputDown.add( spinClick, this );
	
	// setup reels
	var reelsMask = game.add.graphics(0,0);
	reelsMask.beginFill(0xffffff);
	reelsMask.drawRect(0, 0, symbolWidth*5, symbolHeight*3);
	reelsHolder.add( reelsMask );
	reelsHolder.mask = reelsMask;
	reelsHolder.x = 100;
	reelsHolder.y = 100;

	var reel;
	var symbol;
	for ( i = 0; i < reelSymbolDef.length; i++ ) {
		reels.push( new Reel( i, reelSymbolDef[i], reelsHolder ) );
	}
	
	spinEnabled = true;
}

var spinClick = function() {
	console.log(' -> spinClick');
	if ( !spinEnabled ) return;
	disableSpin();
	spin();
}
var spin = function () {
	// disable ui
	// spinBtn.inputEnabled = false;
	
	// create results
	spinResult.reelIndexes = [];
	spinResult.symbolResults = [];
	spinResult.winlines = [];
	var index, reelResults;
	for ( i = 0; i < reels.length; i++ ) {
		index = spinResult.reelIndexes[i] = Math.floor(Math.random()*(reelSymbolDef[i].length-symbolsPerReel));
		// index = spinResult.reelIndexes[i] = 3;
		reelResults = spinResult.symbolResults[i] = reelSymbolDef[i].slice(index,index+3);
		console.log('reel '+i+' index:'+index+' results:'+reelResults);
	}
	for ( i = 0; i < reels.length; i++ ) {
		reels[i].spin(spinResult.reelIndexes[i], reelSpinComplete);
	}
	var symbol, reelIndex, lineDef, winLength;
	for ( i = 0; i < winlineDef.length; i++ ) {
		reelIndex = 0;
		winLength = 1;
		lineDef = winlineDef[i];
		symbol = spinResult.symbolResults[reelIndex][lineDef[reelIndex]];
		for ( reelIndex++; reelIndex < lineDef.length; reelIndex++ ) {
			if ( symbol != spinResult.symbolResults[reelIndex][lineDef[reelIndex]] ) break;
			winLength++;
		}
		if ( winLength >= minWinLength ) {
			console.log('winline '+i+' length:'+winLength);
			spinResult.winlines.push( { index:i, length:winLength } );
		}
	}
}
var reelSpinComplete = function() {
	// console.log('reelSpinComplete');
	// console.log('reelsStill:'+reelsStill());
	if ( reelsStill() ) {
		console.log('spinResult.winlines.length:'+spinResult.winlines.length);
		if ( spinResult.winlines.length ) {
			showWin();
		}
		else {
			enableSpin();
		}
	}
}
var reelsStill = function() {
	for ( i = 0; i < reels.length; i++ ) {
		if ( reels[i].isSpinning ) return false;
	}
	return true;
}
var showWin = function() {
	var winlineIndex = 0;
	var lineData;
	var showNextWinline = function() {
		if ( winlineIndex >= spinResult.winlines.length ) {
			for ( i = 0; i < 5; i++ ) {
				reels[i].removeHighlight();
			}
			enableSpin();
			console.log('IDLE');
			return;
		}
		lineData = spinResult.winlines[winlineIndex];
		winlines.showLine( lineData.index, lineData.length, showNextWinline );
		winlineIndex++;
		
		for( i = 0; i < lineData.length; i++ ) {
			reels[i].highlight( winlineDef[lineData.index][i] );
		}
		for ( i; i < 5; i++ ) {
			reels[i].dim();
		}
		
		emitter.x = 100+Math.random()*600;
		emitter.y = 100+Math.random()*400;
		emitter.start(true, 2000, null, 10);
	}
	showNextWinline();
	
	
}

var enableSpin = function() {
	spinBtn.alpha = 1;
	spinEnabled = true;
}
var disableSpin = function() {
	spinBtn.alpha = 0.2;
	spinEnabled = false;
}



function update() {
	
}