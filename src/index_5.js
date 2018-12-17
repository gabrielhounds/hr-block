 $(document).ready(function(){
	init();
});

function init() {
	var log = console.log;
	log('init');

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
	
	var currentMousePos = { x: -1, y: -1 };


	var main = $('#main');

	var game = $('<div>', { id : 'game' }).css({ width : '100%', height : '100%' }).appendTo(main);

	var debugText = $('<div id="debugText"></div>').appendTo(main);

	$(debugText).html('TEST');

	var _width = window.innerWidth;
	var _height = window.innerHeight;

	app = new Application({width : _width, height : _height, legacy : true, transparent : false });
	app.renderer.backgroundColor = 0x0040A3;
	app.renderer.autoResize = true;
	app.renderer.resize(window.innerWidth, window.innerHeight);

	var stage = app.stage;

	$(app.view).appendTo(game);

	var ticker 	= new PIXI.ticker.Ticker({ autoStart : false});
	//ticker.FPS = 0.5;
	ticker.speed = 0.15;


	var manager = new PIXI.interaction.InteractionManager(app);
    //manager.on('pointermove', handleMouse);

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
	
	function isRowFilled(i) {
		return i === 'filled';
	}

	function handleBlocks(delta) {

		dRate += delta;

		if (dRate >= 4) {
			if (rowIndex < sq.length-1) {
				log(' MOVE DOWN ');
				
				if (grid[1][columnIndex] === 'filled') {
					log('game over');
					ticker.stop();
				}
				
				if (grid[rowIndex + 1][columnIndex] !== 'filled') {
					
					log(grid[rowIndex][columnIndex]);
					
					rowIndex++;	
					sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);			
					sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
					
				} else {
					
					log('OCCUPIED GRID | ROW : ' + rowIndex + ' COLUMNS : ' + columnIndex);
					log('On another piece - lock piece');
					
					grid[rowIndex][columnIndex] = 'filled';
					
					if (rowIndex === 1) {
						log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
						ticker.stop();
					}
					
					log('FULL ROW = ' + grid[rowIndex].every(isRowFilled));
									
					rowIndex = 0;
					blockIndex++;
					columnIndex = Utils.random(0,3);
					
					
				}
				
			} else {
				log('OCCUPIED GRID | ROW : ' + rowIndex + ' COLUMNS : ' + columnIndex);
				log('At the end - Lock Pice');
				grid[rowIndex][columnIndex] = 'filled';
				
				log('FULL ROW = ' + grid[rowIndex].every(isRowFilled));

				rowIndex = 0;
				blockIndex++;
				columnIndex = Utils.random(0,3);
			}
			
			
			
			dRate = 0;
		}
	}
	
	/*
	for ( var r = 0; r < rowNum; r++ ) {
		for ( var c = 0; c < 4; c++ ) {
			if ( grid[r][c] !== 'empty' ) {
				log('NOT EMPTY');
			}
		}
	}
	
	for (var i = 0; i < 4; i++) {
			if( grid[rowIndex][i] === 'filled') {
				log('========== --------- FULL ROW ---------- ==========');
				ticker.stop();
			}
		}
	
	*/



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
				sq[r][c].beginFill(0x66CCFf);
				sq[r][c].lineStyle(1, 0x000000, 1);
				sq[r][c].drawRect(0, 0, gridWidth, gridHeight);
				sq[r][c].endFill();
				sq[r][c].x = _width / 4 * c;
				sq[r][c].y = gridHeight * r;
				//sq[r][c].alpha = 0;
				gameBoard.addChild(sq[r][c]);
			}
		}
		
		gameBoard.y = -gridWidth;
		stage.addChild(gameBoard);
		
		log(grid);
		
		log('SQ LENGTH: ' + sq.length);

		for (var i = 0; i < rowNum; i++) {
			for (var j = 0; j < 4; j++) {
				if (sq[i][j].children.length === 0) {
					log('NO CHILDREN');
				} else {
					log('CHILDREN IN ROW NUM ' + i + ' | COLUMN NUM ' + j + ' | Children : ' + sq[i][j].children.length);
				}

			}
		}




		log( 'STAGE CHILDREN : ' + stage.children.length);

		ticker.start();
	}
	
	function createBlock() {
		
	}


	function setUp() {
		log('setup');
		
		//blockImg0 = new PIXI.Sprite(resources['credit.png'].texture);
		//blockImg1 = new PIXI.Sprite(resources['deduction.png'].texture);
		
		for (var i = 0; i < 20; i++) {

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

	ticker.add( function(delta){
		//log('tick');
		handleBlocks(delta);
	});

	window.addEventListener('deviceorientation', function(e) {

		alpha 	= Math.round(e.alpha);
		beta 	= Math.round(e.beta);
		gamma 	= Math.round(e.gamma);

		$(debugText).html('ALPHA : ' + alpha + '<br>' + 'BETA : ' + beta + '<br>' + 'GAMMA : ' + gamma);

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

	});

	$(window).focus(function(){

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

	initLoader();

}