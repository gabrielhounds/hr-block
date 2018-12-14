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
	
	var block1, block2, line;
		
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
	$(app.view).appendTo(game);
	
	var ticker 	= new PIXI.ticker.Ticker({ autoStart : false});
	
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

	function handleBlocks() {
		
	}
	
	$(window).mousemove( function(e) {
		//handleMouse();
	});
	
	var columnLine = [];
	var rowLine = [];
	
	var grid = [];
	
	function setUp() {
		log('setup');
		
		var gridWidth  = _width / 4;
		var gridHeight = _height / 6;
		
		log(gridWidth + '    ' + gridHeight);
		
		block1 = new PIXI.Sprite(resources['credit.png'].texture);
		block2 = new PIXI.Sprite(resources['deduction.png'].texture);
		
		grid = [];
		
		
		
		
		for ( var i = 0; i < 4; i++ ) {
			columnLine[i]  = new PIXI.Graphics();
			columnLine[i].lineStyle(1, 0x000000, 1);
			columnLine[i].moveTo( 0 , 0);
			columnLine[i].lineTo( 0 , _height);
			columnLine[i].x = _width / 4 * i;
			columnLine[i].y = 0;
			app.stage.addChild(columnLine[i]);
		}
		
		for ( var i = 0; i < 6; i++ ) {
			rowLine[i]  = new PIXI.Graphics();
			rowLine[i].lineStyle(1, 0x000000, 1);
			rowLine[i].moveTo( 0 , 0);
			rowLine[i].lineTo( _width , 0);
			rowLine[i].x = 0;
			rowLine[i].y = _height / 6 * i;
			app.stage.addChild(rowLine[i]);
		}

		//ticker.start();		
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
		handleBlocks();		
	});
	
	window.addEventListener('deviceorientation', function(e) {
		
		alpha 	= Math.round(e.alpha);
		beta 	= Math.round(e.beta);
		gamma 	= Math.round(e.gamma);
		
		//$(debugText).html('ALPHA : ' + alpha + '<br>' + 'BETA : ' + beta + '<br>' + 'GAMMA : ' + gamma);
		
	});
		
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			_width = window.innerWidth;
			_height = window.innerHeight;
			app.renderer.resize( _width, _height );
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
		$(debugText).html('TOUCH X : ' +  currentMousePos.x + '<br>' + 'TOUCH Y : ' +  currentMousePos.y );
	}
		
	function onTouchEnd(event){  
		currentMousePos.x = event.pageX;  
		currentMousePos.y = event.pageY;
	}
	
	initLoader();

}