 $(document).ready(function(){
	init();
});
function init() {
	var log = console.log;
	log('init');
	var t = TweenMax;
	var tlPhone = new TimelineMax({ repeat:10 });
	
	Utils = (function(){
		var getMousePosition = function() {
			return app.renderer.plugins.interaction.mouse.global;
		}
		var random = function(min, max) {
			if (max == null) { max = min; min = 0; }
			return Math.round(Math.random() * (max - min) + min);
		}
		return {
			random : random,
			getMousePosition : getMousePosition
		}
	}());
	
	var Application = PIXI.Application,
	loader 			= PIXI.loader,
	resources 		= PIXI.loader.resources,
	Sprite 			= PIXI.Sprite;
	var stage, ticker, manager, app, resizeTimer,
	alpha, beta, gamma,
	blocks0, blocks1, blocks2, line, gameBoard,
	blockImg0, blockImg1,
	gridWidth, gridHeight, rowNum;
	var grid = [],
	blocks = [], blocks1 = [], sq = [];
	
	var introOverlay;
	var introOverlayHeight;
	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var currentMousePos = { x: -1, y: -1 };
	var theTime = 30, tRate;
	var score = 0;
	//var main 			= $('#main');
	var main 			= $('<div>', {id:'main'}).css({ width : '100%', height : '100%' }).prependTo('body');
	var game 			= $('<div>', { id : 'game' }).css({ width : '100%', height : '100%' }).appendTo(main);
	var footer 			= $('<div>', { id : 'footer'}).appendTo(main);
	var scoreTab 		= $('<div>', { id : 'scoreTab'}).appendTo(main);
	var timeText 		= $('<div>', { id : 'timeText'}).appendTo(scoreTab);
	var scoreText 		= $('<div>', { id : 'scoreText'}).appendTo(scoreTab);
	var introOverlay 	= $('<div>', { id : 'introOverlay'}).appendTo(main);
	var debugText 		= $('<div id="debugText"></div>').appendTo(main);
	var instructions 	= $('<div>', { id : 'instructions'}).appendTo(introOverlay);
	var phoneIcon 		= $('<div>', { id : 'phoneIcon'}).appendTo(instructions);
	var instructionText = $('<div>', { id : 'instructionText'}).appendTo(instructions);
	var cta 			= $('<div>', { id : 'cta'}).appendTo(footer);
	var logo 			= $('<div>', { id : 'logo'}).appendTo(footer);
	var endFrame 		= $('<div>', { id : 'endFrame'}).appendTo(main);
	var endHeader 		= $('<div>', { id : 'endHeader'}).appendTo(endFrame);
	var endSubHead 		= $('<div>', { id : 'endSubHead'}).appendTo(endFrame);
	var replayBtn 		= $('<div>', { id : 'replayBtn'}).appendTo(endFrame);
	var tagLine 		= $('<div>', { id : 'tagLine'}).appendTo(endFrame);
	var endCta 			= $('<div>', { id : 'endCta'}).appendTo(endFrame);
	var endLogo 		= $('<div>', { id : 'endLogo'}).appendTo(endFrame);
	
	
	var dRate = 0;
	var dTick = 0;
	var blockIndex = 0;
	var rowIndex = 0;
	var gridIndex = 0;
	var columnIndex = 1;
	var newRow;
	var controlLock = false;
	var nextColumnIndex = columnIndex;
	var columnOffset = 1;
	var theShape = Utils.random(0, 6);
	var tickTime = 120;
	
	//theShape = 4;
	
	
	
	t.set(endFrame, {autoAlpha:0});
	t.set(scoreTab, {x:-300});
	$(debugText).html('TEST');
	$(scoreText).html('ROWS : 00');
	
	
	function initStage() {
		app = new Application({width : _width, height : _height, legacy : true, transparent : false });
		app.renderer.backgroundColor = 0xFFFFFF;
		app.renderer.autoResize = true;
		app.renderer.resize(window.innerWidth, window.innerHeight);
		stage = app.stage;
		$(app.view).appendTo(game);
		ticker 	= new PIXI.ticker.Ticker({ autoStart : false});
		//ticker.FPS = 0.5;
		ticker.speed = 1.0;
		manager = new PIXI.interaction.InteractionManager(app);
		//manager.on('pointermove', handleMouse);
		ticker.add( function(delta){
			//log('tick');
			handleBlocks(delta);
			handleTimer(delta);
		});
		initLoader();
	}
		
	function isFilled(i) {
		return i === 'filled';
	}
	
	function handleReplay() {
		//icker.stop();
		for ( var r = 0; r < rowNum; r++ ) {
			for ( var c = 0; c < 4; c++ ) {
				sq[r][c].removeChild(sq[r][c].children[0]);
				grid[r][c] = 'empty';
			}
		}
		for (var i = stage.children.length - 1; i >= 0; i--) {
			stage.removeChild(stage.children[i]);
		};
		
		dRate = 0;
		dTick = 0;
		tickTime = 60;
		blockIndex = 0;
		rowIndex = 0;
		gridIndex = 0;
		columnIndex = 1;
		theTime = 30;
		score = 0;
		
		$(scoreText).html('ROWS : 0');
		
		t.to(scoreTab, 0.3, {x:0, ease:Power3.easeOut});
		
		t.to(endFrame, 0.3, {autoAlpha:0});
		setPosition();
		//initStage();
		//setUp();
		//ticker.start();
	}
		
	function handleGameOver() {
		t.set(endFrame, {autoAlpha:1});
		
		var rowText = (score > 1 || score === 0) ? ' Rows.' : ' Row.';
		
		$(endSubHead).html('You cleared ' + score + rowText);
	}
	
	function handleRowDrop() {
		
		//alert(rowIndex);
		
		for (var i = 0; i < 4; i++) {
			sq[rowIndex][i].removeChild( sq[rowIndex][i].children[0] );
			grid[rowIndex][i] = 'empty';
		}
		
		for (var r = rowIndex - 1; r >= 0; r--) {
			for (c = 4 - 1; c >= 0; c--) {
				if( sq[r][c].children.length !== 0 ) {
					log('CHILDREN LENGTH ' + ' ROW ' +[r] + ' COLUMN ' + [c] + '  ' + sq[r][c].children.length )
					activeChild = sq[r][c].children[0];
					newRow = r+=1;
					sq[r][c].removeChild( activeChild );
					sq[newRow][c].addChild( activeChild );
				}
				if (grid[r][c] === 'filled') {
					grid[r][c] = 'empty';
					newRow = r+=1;
					grid[newRow][c] = 'filled';
				}
			}
		}
		score += 1;
		handleScore();
		ticker.start();
	}
	function handleBlocks(delta) {
		dRate += Math.ceil(delta);
		if (dRate >= tickTime) {
			// SINGLE SQUARE
			if (theShape === 0) {
				//log('SINGLE SQUARE');
				columnOffset = 0;
				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled') {
					rowIndex++;
					columnIndex = nextColumnIndex;
					//sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
				} else {
					grid[rowIndex][columnIndex] = 'filled';
					if (rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						handleGameOver();
						ticker.stop();
					}
					if ( grid[rowIndex].every(isFilled) ) {
						ticker.stop();
						handleRowDrop();
					}
					rowIndex = 0;
					blockIndex++;
					columnIndex = 1;
					nextColumnIndex = 1;
					columnOffset = 1;
					theShape = Utils.random(0, 6);
					//theShape = 3;
				}
			} else if (theShape === 1) {
				// DOUBLE SQUARE
				//log('DOUBLE SQUARE');
				columnOffset = 1;
				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex + 1][columnIndex+1] !== 'filled' ) {
					rowIndex++;
					columnIndex = nextColumnIndex;
					//sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					//sq[rowIndex-1][columnIndex+1].removeChild(blocks[blockIndex+1]);
					//sq[rowIndex-1][columnIndex+2].removeChild(blocks[blockIndex+2]);
					sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
					sq[rowIndex][columnIndex+1].addChild(blocks[blockIndex+1]);
					//sq[rowIndex][columnIndex+2].addChild(blocks[blockIndex+2]);
				} else {
					grid[rowIndex][columnIndex] = 'filled';
					grid[rowIndex][columnIndex+1] = 'filled';
					//grid[rowIndex][columnIndex+2] = 'filled';
					if (rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						handleGameOver();
						ticker.stop();
					}
					if ( grid[rowIndex].every(isFilled) ) {
						ticker.stop();
						handleRowDrop();
					}
					rowIndex = 0;
					blockIndex+=3;
					columnIndex = 1;
					nextColumnIndex = 1;
					columnOffset = 1;
					theShape = Utils.random(0, 6);
					//theShape = 3;
				}
			// CADDY SQUARE
			} else if (theShape === 2) {
				//log('CADDY SQUARE');
				columnOffset = 1;
				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex][columnIndex+1] !== 'filled' ) {
					rowIndex++;
					columnIndex = nextColumnIndex;
					//sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					//sq[rowIndex][columnIndex+1].removeChild(blocks[blockIndex+1]);
					sq[rowIndex][columnIndex].addChild(blocks1[blockIndex]);
					sq[rowIndex-1][columnIndex+1].addChild(blocks1[blockIndex+1]);
				} else {
					
					grid[rowIndex][columnIndex] = 'filled';
					if ( typeof grid[rowIndex-1] != 'undefined') {
						grid[rowIndex-1][columnIndex+1] = 'filled';
					} else {
						log('undefined row num');
					}
					
					if (rowIndex === 0 || rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						handleGameOver();
						ticker.stop();
					}
					if ( grid[rowIndex].every(isFilled) ) {
						ticker.stop();
						handleRowDrop();
					}
					rowIndex = 0;
					blockIndex+=2;
					columnIndex = 1;
					nextColumnIndex = 1;
					columnOffset = 1;
					theShape = Utils.random(0, 6);
					//theShape = 2;
				}
			} else if (theShape === 3) {
				//log(' - CADDY SQUARE');
				columnOffset = 1;
				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex + 1] !== 'filled' && grid[rowIndex][columnIndex] !== 'filled' ) {
					rowIndex++;
					columnIndex = nextColumnIndex;
					//sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					//sq[rowIndex][columnIndex+1].removeChild(blocks[blockIndex+1]);
					sq[rowIndex][columnIndex+1].addChild(blocks[blockIndex]);
					sq[rowIndex-1][columnIndex].addChild(blocks[blockIndex+1]);
				} else {
					
					grid[rowIndex][columnIndex+1] = 'filled';
					if ( typeof grid[rowIndex-1] != 'undefined') {
						grid[rowIndex-1][columnIndex] = 'filled';
					} else {
						log('undefined row num');
					}
					
					if (rowIndex === 0 || rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						handleGameOver();
						ticker.stop();
					}
					if ( grid[rowIndex].every(isFilled) ) {
						ticker.stop();
						handleRowDrop();
					}
					rowIndex = 0;
					blockIndex+=2;
					columnIndex = 1;
					nextColumnIndex = 1;
					columnOffset = 1;
					theShape = Utils.random(0, 6);
					//theShape = 3;
				}
			} else if (theShape === 4) {
				//log('- EL SQUARE');
				
				columnOffset = 1;
				
				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex + 1][columnIndex+1] !== 'filled' && grid[rowIndex][columnIndex+1] !== 'filled' ) {
					rowIndex++;
					columnIndex = nextColumnIndex;
					//sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					//sq[rowIndex][columnIndex+1].removeChild(blocks[blockIndex+1]);
					sq[rowIndex][columnIndex].addChild(blocks1[blockIndex]);
					sq[rowIndex][columnIndex+1].addChild(blocks1[blockIndex+1]);
					sq[rowIndex-1][columnIndex+1].addChild(blocks1[blockIndex+2]);
				} else {
					
					grid[rowIndex][columnIndex] = 'filled';
					grid[rowIndex][columnIndex+1] = 'filled';
					
					if ( typeof grid[rowIndex-1] != 'undefined') {
						grid[rowIndex-1][columnIndex+1] = 'filled';
					} else {
						log('undefined row num');
					}
					
					
					if (rowIndex === 0 || rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						handleGameOver();
						ticker.stop();
					}
					if ( grid[rowIndex].every(isFilled) ) {
						ticker.stop();
						handleRowDrop();
					}
					rowIndex = 0;
					blockIndex+=3;
					columnIndex = 1;
					nextColumnIndex = 1;
					columnOffset = 1;
					theShape = Utils.random(0, 6);
					//theShape = 4;
				}
			} else if (theShape === 5) {
				//log('EL SQUARE');
				columnOffset = 1;
				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex + 1][columnIndex+1] !== 'filled' && grid[rowIndex][columnIndex] !== 'filled' ) {
					rowIndex++;
					columnIndex = nextColumnIndex;
					//sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					//sq[rowIndex][columnIndex+1].removeChild(blocks[blockIndex+1]);
					sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
					sq[rowIndex][columnIndex+1].addChild(blocks[blockIndex+1]);
					sq[rowIndex-1][columnIndex].addChild(blocks[blockIndex+2]);
					
				} else {
					
					grid[rowIndex][columnIndex] = 'filled';
					grid[rowIndex][columnIndex+1] = 'filled';
					
					if ( typeof grid[rowIndex-1] != 'undefined') {
						grid[rowIndex-1][columnIndex] = 'filled';
					} else {
						log('undefined row num');
					}
					
					
					if (rowIndex === 0 || rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						handleGameOver();
						ticker.stop();
					}
					if ( grid[rowIndex].every(isFilled) ) {
						ticker.stop();
						handleRowDrop();
					}
					rowIndex = 0;
					blockIndex+=3;
					columnIndex = 1;
					nextColumnIndex = 1;
					columnOffset = 1;
					theShape = Utils.random(0, 6);
					//theShape = 5;
				}
			} else if (theShape === 6) {
				//log('SINGLE SQUARE');
				columnOffset = 0;
				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled') {
					rowIndex++;
					columnIndex = nextColumnIndex;
					//sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					sq[rowIndex][columnIndex].addChild(blocks1[blockIndex]);
				} else {
					grid[rowIndex][columnIndex] = 'filled';
					if (rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						handleGameOver();
						ticker.stop();
					}
					if ( grid[rowIndex].every(isFilled) ) {
						ticker.stop();
						handleRowDrop();
					}
					rowIndex = 0;
					blockIndex++;
					columnIndex = 1;
					nextColumnIndex = 1;
					columnOffset = 1;
					theShape = Utils.random(0, 6);
					//theShape = 6;
				}
			} 			
			dRate = 0;
		}
	}
	
	
	function handleTimer(delta) {
		tRate = delta / 60;
		theTime -= tRate;
		$(timeText).html('TIME : ' + Math.round(theTime));
	}
	
	function handleScore() {
		if (score < 10 ) {
			$(scoreText).html('ROWS : 0' + score);
		} else {
			$(scoreText).html('ROWS : '+ score);
		}
	}
	
	function setPosition() {
		log('setPosition');
		gridWidth  = _width / 4;
		gridHeight = gridWidth;
		rowNum = Math.round(_height / gridWidth);
		log( 'ROW HEIGHt : ' +  _height / gridWidth);
		log('GRID SIZE ' +  gridWidth + ' X ' + gridHeight);
		grid = [];
		for (var i = 0; i<blocks.length; i++) {
			blocks[i].width = blocks[i].height = gridWidth;
			blocks1[i].width = blocks1[i].height = gridWidth;

		}
		for ( var r = 0; r < rowNum; r++ ) {
			grid[r] = [];
			for ( var c = 0; c < 4; c++ ) {
				grid[r][c] = 'empty';
			}
		}
		for (var r = 0; r < rowNum; r++) {
			sq[r] = [];
			for (c = 0; c < 4; c++) {
				sq[r][c] = new PIXI.Graphics();
				sq[r][c].beginFill(0x66CCFf, 0);
				sq[r][c].lineStyle(1, 0x000000, 0.01);
				sq[r][c].drawRect(0, 0, gridWidth, gridHeight);
				sq[r][c].endFill();
				sq[r][c].x = _width / 4 * c;
				sq[r][c].y = gridHeight * r;
				gameBoard.addChild(sq[r][c]);
			}
		}
		gameBoard.y = -gridWidth;
		stage.addChild(gameBoard);
		footerHeight = (_height - gameBoard.height) + gridWidth;
		introOverlayHeight = (_height - footerHeight)
		$(footer).css({ height : footerHeight });
		$(introOverlay).css({ height : introOverlayHeight });
		function resetPhone() {
			t.set(phoneIcon, {rotation:'0deg'})
		}
		t.set(phoneIcon, {rotation:'-45deg'})
		tlPhone.add('begin')
		.to(phoneIcon, 0.9, {rotation:'+=90', ease:Quad.easeOut})
		.to(phoneIcon, 0.9, {rotation:'-=90', ease:Quad.easeOut, onComplete:resetPhone})
		//SOME DEBUG STUFF
		sq[1][0].interactive = true;
		sq[1][0].on('pointerup', function(e){
			log('CLICKED DEBUG SQUARE');
			log(grid);
			ticker.stop();
		});
		$(introOverlay).click( function(e) {
			ticker.stop();
			for ( var r = 0; r < rowNum; r++ ) {
				for ( var c = 0; c < 4; c++ ) {
					sq[r][c].removeChild(sq[r][c].children[0]);
					grid[r][c] = 'empty';
				}
			}
			for (var i = stage.children.length - 1; i >= 0; i--) {
				stage.removeChild(stage.children[i]);
			};
			dRate = 0;
			dTick = 0;
			tickTime = 60;
			blockIndex = 0;
			rowIndex = 0;
			gridIndex = 0;
			columnIndex = 1;
			theTime = 30;
			score = 0;
			t.to(scoreTab, 0.3, {x:0, ease:Power3.easeOut});
			t.to(introOverlay, 0.3, {autoAlpha:0});
			setPosition();
			//initStage();
			//setUp();
			//ticker.start();
		})
		ticker.start();
	}
	
	function createBlock() {
	}
	
	function setUp() {
		log('setup');
		
		//blockImg0 = new PIXI.Sprite(resources['credit.png'].texture);
		//blockImg1 = new PIXI.Sprite(resources['deduction.png'].texture);
		
		for (var i = 0; i < 100; i++) {
			blocks.push(blocks[i] = new PIXI.Sprite(resources['credit.png'].texture));
			blocks1.push(blocks1[i] = new PIXI.Sprite(resources['deduction.png'].texture));

		}
		
		
		
		gameBoard = new PIXI.Container();
		setPosition();
	}
	
	function loadProgressHandler() {
		log('loading');
		//loadingText.setText( 'LOADING ' + Math.round(loader.progress) + '%');
	}
	
	function initLoader() {
		loader.add([
			'credit.png',
			'deduction.png'
		]).on('progress', loadProgressHandler).load(setUp);
	}
	
	$(document).on('keydown', function(e){
		if(e.keyCode == 37) {
			log('LEFT ARROW');
			//if( columnIndex > 0 && grid[rowIndex+1][columnIndex-1] !== 'filled') {
			if( nextColumnIndex > 0) {
				if(nextColumnIndex < 0) {
					nextColumnIndex = 0;
				} else {
					nextColumnIndex--;
				}
			}
		}
		if(e.keyCode == 39) {
			log('RIGHT ARROW');
			if( nextColumnIndex < 3 - columnOffset) {
				if (nextColumnIndex - columnOffset > 3) {
					nextColumnIndex = 3 - columnOffset;
				} else {
					nextColumnIndex++;
				}
			}
		}
	});
	
	var leftTimer, rightTimer;
	window.addEventListener('deviceorientation', function(e) {
		alpha 	= Math.round(e.alpha);
		beta 	= Math.round(e.beta);
		gamma 	= Math.round(e.gamma);
		if (alpha < 180) {
			_alpha = alpha + 180;
		} else {
			_alpha = alpha - 180;
		}
		$(debugText).html('ALPHA : ' + _alpha + '<br>' + 'BETA : ' + beta + '<br>' + 'GAMMA : ' + gamma + '<br>' + 'MOVE TRIGGERED? : ');
		
		if(_alpha > 220 && _alpha < 240) {
			clearTimeout(leftTimer);
			leftTimer = setTimeout(function() {
				if( nextColumnIndex > 0) {
					if(nextColumnIndex < 0) {
						nextColumnIndex = 0;
					} else {
						nextColumnIndex--;
					}
				}
			}, 50);
		}
		
		if(_alpha < 160 && _alpha > 100) {
			clearTimeout(rightTimer);
			rightTimer = setTimeout(function() {
				if( nextColumnIndex < 3 - columnOffset) {
					if (nextColumnIndex - columnOffset > 3) {
						nextColumnIndex = 3 - columnOffset;
					} else {
						nextColumnIndex++;
					}
				}
			}, 50);
		}
	});
	//While(stage.children[0]) { stage.removeChild(stage.children[0]); }
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			_width = window.innerWidth;
			_height = window.innerHeight;
			app.renderer.resize( _width, _height );
			for (var i = stage.children.length - 1; i >= 0; i--) {
				stage.removeChild(stage.children[i]);
			};
			setPosition();
		}, 250);
	});
	$(window).blur(function(){
		ticker.stop();
	});
	$(window).focus(function(){
		ticker.start();
	});
	
	$(replayBtn).click( function(e) {
		handleReplay();
	})
	
	
	$(function () {
		document.addEventListener('touchstart', onTouchStart, true);
		document.addEventListener('touchend', 	onTouchEnd, true);
		document.addEventListener('touchmove', 	onTouchMove, true);
	});
	function onTouchStart(event){
		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY;
	}
	function onTouchMove(event){
		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY;
		//$(debugText).html('TOUCH X : ' +  currentMousePos.x + '<br>' + 'TOUCH Y : ' +  currentMousePos.y );
	}
	function onTouchEnd(event){
		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY;
	}
	initStage();
}