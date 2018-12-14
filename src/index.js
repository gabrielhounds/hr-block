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
	
	var block0, block1, line;
	
	var columnLine = [];
	var rowLine = [];
	
	var grid = [];
	
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

	function handleBlocks(delta) {
		
		dRate += delta;
		
		for ()
				
		if (dRate >= 10) {
			if (dTick < rowNum - 2) {
				block0.y += gridHeight;
				dTick += 1;
				dRate = 0;
			} else {
				block0.y = block0.y;
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
			
		for ( var i = 0; i < 4; i++ ) {
			columnLine[i]  = new PIXI.Graphics();
			columnLine[i].lineStyle(1, 0x000000, 1);
			columnLine[i].moveTo( 0 , 0);
			columnLine[i].lineTo( 0 , _height);
			columnLine[i].x = _width / 4 * i;
			columnLine[i].y = 0;
			stage.addChild(columnLine[i]);
		}
		
		for ( var i = 0; i < rowNum; i++ ) {
			rowLine[i]  = new PIXI.Graphics();
			rowLine[i].lineStyle(1, 0x000000, 1);
			rowLine[i].moveTo( 0 , 0);
			rowLine[i].lineTo( _width , 0);
			rowLine[i].x = 0;
			rowLine[i].y = gridHeight * i;
			stage.addChild(rowLine[i]);
		}
		
		block0.width = gridWidth;
		block1.width = gridWidth;
		
		block0.height = gridHeight;
		block1.height = gridHeight;
		
		block0.x = _width - block0.width;
		
		stage.addChild(block0);
		stage.addChild(block1);
			
		log( 'STAGE CHILDREN : ' + stage.children.length);
		
		ticker.start();
	}
	
	function setUp() {
		log('setup');
		
		block0 = new PIXI.Sprite(resources['credit.png'].texture);
		block1 = new PIXI.Sprite(resources['deduction.png'].texture);
		
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