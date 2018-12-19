 $(document).ready(function(){
	init();
});

function init() {
	var log = console.log;
	log('init');

	var t = TweenMax;

	var Application = PIXI.Application,
	loader 			= PIXI.loader,
	resources 		= PIXI.loader.resources,
	Sprite 			= PIXI.Sprite;

	var app, resizeTimer;

	var alpha, beta, gamma;

	var blocks0, blocks1, blocks2, line, gameBoard;

	var blockImg0, blockImg1;

	var columnLine = [];
	var rowLine = [];

	var grid = [];
	var blocks = [];

	var sq = [];
	var gd = [];

	var gridWidth;
	var rowNum;
	var gridHeight;

	var footer; // = $('<div>', { id : 'footer'}).appendTo('body');
	var footerHeight;

	var introOverlay;
	var introOverlayHeight;

	var currentMousePos = { x: -1, y: -1 };

	var main = $('#main');

	var game = $('<div>', { id : 'game' }).css({ width : '100%', height : '100%' }).appendTo(main);

	footer = $('<div>', { id : 'footer'}).appendTo(main);
	introOverlay = $('<div>', { id : 'introOverlay'}).appendTo(main);

	var debugText = $('<div id="debugText"></div>').appendTo(main);

	var instructions = $('<div>', { id : 'instructions'}).appendTo(introOverlay);
	var phoneIcon = $('<div>', { id : 'phoneIcon'}).appendTo(instructions);
	var instructionText = $('<div>', { id : 'instructionText'}).appendTo(instructions);

	var cta = $('<div>', { id : 'cta'}).appendTo(footer);
	var logo = $('<div>', { id : 'logo'}).appendTo(footer);

	var endFrame = $('<div>', { id : 'endFrame'}).appendTo(main);
	var endHeader = $('<div>', { id : 'endHeader'}).appendTo(endFrame);

	var endSubHead = $('<div>', { id : 'endSubHead'}).appendTo(endFrame);

	var replayBtn = $('<div>', { id : 'replayBtn'}).appendTo(endFrame);

	var tagLine = $('<div>', { id : 'tagLine'}).appendTo(endFrame);

	var endCta = $('<div>', { id : 'endCta'}).appendTo(endFrame);

	var endLogo = $('<div>', { id : 'endLogo'}).appendTo(endFrame);

	t.set(endFrame, {autoAlpha:0});


	var tlPhone = new TimelineMax({ repeat:10 });

	$(debugText).html('TEST');

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var stage, ticker, manager;

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
		});

		initLoader();
	}



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

	var dRate = 0;
	var dTick = 0;
	var blockIndex = 0;
	var rowIndex = 0;
	var gridIndex = 0;
	var columnIndex = 1;
	var newRow;
	var controlLock = false;
	var nextColumnIndex = columnIndex;

	var theShape = Utils.random(0, 2);

	//theShape = Utils.random(0, 2);


	function isFilled(i) {
		return i === 'filled';
	}

	function handleGameOver() {
		t.set(endFrame, {autoAlpha:1});
	}

	function handleRowDrop() {
		for (var i = 0; i < 4; i++) {
			sq[rowIndex][i].removeChild( sq[rowIndex][i].children[0] );
			grid[rowIndex][i] = 'empty';
		}

		for (var r = rowNum - 2; r >= 0; r--) {
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
		ticker.start();
	}

	function handleBlocks(delta) {

		dRate += Math.ceil(delta);

		if (dRate >= 60) {

			// SINGLE SQUARE
			if (theShape === 0) {
				log('SINGLE SQUARE');

				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled') {
					rowIndex++;
					columnIndex = nextColumnIndex;
					sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
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
					theShape = Utils.random(0, 2);
				}
			// TRIPLE SQUARE
			} else if (theShape === 1) {
				log('TRIPLE SQUARE');

				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex + 1][columnIndex+1] !== 'filled' ) {
					rowIndex++;

					columnIndex = nextColumnIndex;

					sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					sq[rowIndex-1][columnIndex+1].removeChild(blocks[blockIndex+1]);
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
					theShape = Utils.random(0, 2);
				}
			// CADDY SQUARE
			} else if (theShape === 2) {
				log('CADDY SQUARE');

				if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex][columnIndex+1] !== 'filled' ) {
					rowIndex++;

					columnIndex = nextColumnIndex;

					sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
					sq[rowIndex][columnIndex+1].removeChild(blocks[blockIndex+1]);

					sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
					sq[rowIndex-1][columnIndex+1].addChild(blocks[blockIndex+1]);

				} else {

					grid[rowIndex][columnIndex] = 'filled';
					grid[rowIndex-1][columnIndex+1] = 'filled';

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
					blockIndex+=2;
					columnIndex = 1;
					nextColumnIndex = 1;
					theShape = Utils.random(0, 2);
				}
			}


			dRate = 0;
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
				sq[r][c].lineStyle(1, 0x000000, 0.05);
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

			t.set(introOverlay, {autoAlpha:0});

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
			blockIndex = 0;
			rowIndex = 0;
			gridIndex = 0;
			columnIndex = 1;

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
		//log('key down');
		if(e.keyCode == 37) {
			log('LEFT ARROW');
			log('CONTROL LOCK = ' + controlLock );
			if( columnIndex > 0 && grid[rowIndex+1][columnIndex-1] !== 'filled') {
				//columnIndex--;
				nextColumnIndex--;
			}
		}
		if(e.keyCode == 39) {
			log('RIGHT ARROW');
			log('CONTROL LOCK = ' + controlLock );
			if( columnIndex < 3 && grid[rowIndex+1][columnIndex+1] !== 'filled') {
				//columnIndex++;
				nextColumnIndex++;
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

		$(debugText).html('ALPHA : ' + _alpha + '<br>' + 'BETA : ' + beta + '<br>' + 'GAMMA : ' + gamma);

		if(_alpha > 200) {
			clearTimeout(leftTimer);
			leftTimer = setTimeout(function() {
				if( columnIndex > 0 && controlLock === false) {
					nextColumnIndex--;
				}
			}, 50);
		}

		if(_alpha < 170) {
			clearTimeout(rightTimer);
			rightTimer = setTimeout(function() {
				if( columnIndex < 3 && controlLock === false) {
					nextColumnIndex++;
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