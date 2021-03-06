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

	var blocks0, blocks1, blocks2, line;

	var columnLine = [];
	var rowLine = [];

	var grid = [];
	var blocks = [];

	var sq = [];
	var gd = [];

	var gridWidth;
	var rowNum;
	var gridHeight;

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
	ticker.speed = 0.25;


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

	//var mousePos = Utils.getMousePosition();

	var dRate = 0;
	var dTick = 0;
	var blockIndex = 0;
	var gridIndex = 0;
	var columnIndex = 0;

	function handleBlocks(delta) {

		dRate += delta;

		if (dRate >= 10) {

			if (gridIndex < sq.length - 1 ) {
				sq[gridIndex][columnIndex].addChild(blocks[0]);
				gridIndex ++;
				dRate = 0;
			}

			if (columnIndex < 3) {
				//columnIndex ++;
			}

		}

	}



	function setPosition() {
		log('setPosition');

		gridWidth  = _width / 4;
		//var gridHeight = _height / 6;

		rowNum = Math.round(_height / gridWidth);

		log('ROWNUM : ' + rowNum);

		gridHeight = gridWidth;

		log(gridWidth + '    ' + gridHeight);

		grid = [];

		for (var i = 0; i<blocks.length; i++) {
			blocks[i].width = blocks[i].height = gridWidth;
		}

		for (var i = 0; i < rowNum; i++) {
			sq[i] = [];
			for (j = 0; j < 4; j++) {
				sq[i][j] = new PIXI.Graphics();
				//sq[i][j].beginFill(0x66CCFf);
				sq[i][j].lineStyle(1, 0x000000, 1);
				sq[i][j].drawRect(0, 0, gridWidth, gridHeight);
				//sq[i][j].endFill();
				sq[i][j].x = _width / 4 * j;
				sq[i][j].y = gridHeight * i;
				stage.addChild(sq[i][j]);
			}
		}

		//sq[3][0].alpha = 0.5;

		/*sq[0][0].addChild(blocks[0]);
		sq[0][1].addChild(blocks[1]);
		sq[0][2].addChild(blocks[2]);
		sq[0][3].addChild(blocks[3]);

		sq[0][3].removeChild(blocks[3]);
		sq[1][3].addChild(blocks[3]);
		*/



		log('SQ LENGTH: ' + sq.length);

		for (var i = 0; i < rowNum; i++) {
			for (var j = 0; j < 4; j++) {
				//log('ROWNUM : ' + j);

				//sq[i][j].alpha = 0.5;

				if (sq[i][j].children.length === 0) {

					//log(this);

					sq[i][j].alpha = 1.0;
				} else {
					log('CHILDREN IN ROW NUM ' + i + ' | COLUMN NUM ' + j + ' | Children : ' + sq[i][j].children.length);
				}

			}
		}




		log( 'STAGE CHILDREN : ' + stage.children.length);

		ticker.start();
	}


	//var block0, block1, block2, block3, block4, block5, block6, block7, block8, block9;

	//var block = [];

	function setUp() {
		log('setup');



		//blocks0 = new PIXI.Sprite(resources['credit.png'].texture);
		//blocks1 = new PIXI.Sprite(resources['deduction.png'].texture);
		//blocks2 = new PIXI.Sprite(resources['credit.png'].texture);


		for (var i = 0; i < 10; i++) {

			blocks.push(blocks[i] = new PIXI.Sprite(resources['credit.png'].texture));



			//blocks.push( block[i] );
		}


		//blocks = [block0, block1];

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

	var currentMousePos = { x: -1, y: -1 };

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