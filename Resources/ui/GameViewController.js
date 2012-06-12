Ti.API.info('Including GameViewController.js');

(function() {
	
	var PlayerOne,PlayerTwo;
	
	var initPlayers = function(){
		Ti.API.info(mttt.app.svc.settings);
		PlayerOne = {
			name  : mttt.app.svc.settings.player1.begin?mttt.app.svc.settings.player1.name:mttt.app.svc.settings.player2.name,
	        image : mttt.app.svc.settings.player1.begin?mttt.app.svc.settings.player1.image:mttt.app.svc.settings.player2.image,
			image_win   : mttt.app.svc.settings.player1.begin?mttt.app.svc.settings.player1.image_win:mttt.app.svc.settings.player2.image_win,
		};
		
		PlayerTwo = {
			name  : mttt.app.svc.settings.player1.begin?mttt.app.svc.settings.player2.name:mttt.app.svc.settings.player1.name,
	        image : mttt.app.svc.settings.player1.begin?mttt.app.svc.settings.player2.image:mttt.app.svc.settings.player1.image,
			image_win   : mttt.app.svc.settings.player1.begin?mttt.app.svc.settings.player2.image_win:mttt.app.svc.settings.player1.image_win,
		};
	}
	var attachToTab = function(_tab) {
		_tab.title = 'Game';
		var oneWindow = _tab.window;
		var children = Ti.Platform.osname==='android'?oneWindow._children:oneWindow.children;
		
		for (var index = 0; index < children.length; index += 1)
		{
			var oneChild = children[index];
		    oneWindow.remove(oneChild);
		}
				
		oneWindow.add(this.view);
	};

	var handleClick = function(_e) {
		var index = _e.source.index;
		
		mttt.app.gvc.buttons[index-1].backgroundImage = mttt.app.gvc.currentPlayer.image;
		mttt.app.gvc.buttons[index-1].backgroundDisabledImage = mttt.app.gvc.currentPlayer.image;
		mttt.app.gvc.buttons[index-1].enabled = false;
		mttt.app.gvc.buttons[index-1].owner = mttt.app.gvc.currentPlayer;
		
		var win = checkForWin();
		if(win != null){
			gameEnd(win);
		}else {
			if(mttt.app.gvc.turn%2){
				mttt.app.gvc.currentPlayer = PlayerOne;
			}
			else{
	            mttt.app.gvc.currentPlayer = PlayerTwo;
			}
			mttt.app.gvc.turn++;
			setPlayerTurnText(mttt.app.gvc.currentPlayer);
		}
		
		if(mttt.app.gvc.turn > 8){
			gameEnd(null);	
		}
	}
	
	var gameEnd = function(win){
		var winner;
		var buttons = mttt.app.gvc.buttons;
			
		if(win != null){
			winner = win.winner;
			
			//works fine, if its not shown, your emulator needs to long to render!
			for(var i = 0; i<win.line.length;i++){
				buttons[win.line[i]-1].backgroundImage = winner.image_win;
				buttons[win.line[i]-1].backgroundDisabledImage = winner.image_win;
			}
		}
		
		for(var i = 0; i<buttons.length;i++){
			buttons[i].enabled = false;
		}
		
		setTimeout(function() {
		    alert(winner?winner.name+" WINS":"DRAW");
		    resetGame();
		}, 2000);
		
		
		
	}
	
	var setStatusText = function(text){
		mttt.app.gvc.endLabel.text = text;
	};
	
	var checkForWin = function(){
		var lines = mttt.app.gvc.lines;
		var btns = mttt.app.gvc.buttons;
		var x;
		for(x=0;x < lines.length; x++){
			var index1 = lines[x][0];
			var index2 = lines[x][1];
			var index3 = lines[x][2];
			if(btns[index1-1].owner == null || btns[index2-1].owner == null || btns[index3-1].owner == null){ 
				continue;
			}
			if(btns[index1-1].owner == btns[index2-1].owner && btns[index2-1].owner == btns[index3-1].owner){
				return {line:lines[x], winner:btns[index1-1].owner};
			}
		}
		return null;		
	}
	
	var resetGame = function(){
		mttt.app.gvc.turn = 0;
		for (var i=0;i < mttt.app.gvc.buttons.length;i++){
			var btn = mttt.app.gvc.buttons[i];
			btn.backgroundImage = '/images/leer.png';
			btn.backgroundDisabledImage = '/images/leer.png';
			btn.enabled = true;
			btn.owner = null;
		}
		mttt.app.gvc.currentPlayer = PlayerOne;
		setPlayerTurnText(mttt.app.gvc.currentPlayer);
		
		// KI
		initPlayers();
		if(mttt.app.svc.settings.mode=='single' && PlayerOne.name == 'cpu'){
			Ti.API.info(mttt.app.gvc.buttons);
			mttt.app.gvc.buttons[0].fireEvent('click');
		}
	}
	
	var setPlayerTurnText = function(player){
		setStatusText(player.name+"S TURN");
	}
	
  	mttt.ui.createGameViewController = function(_args) {
  		initPlayers();
  		
  		var gvc = {};
  		var buttons = [];
  		var lines = [];
  		
  		lines.push([1,2,3]);
		lines.push([4,5,6]);
		lines.push([7,8,9]);
		lines.push([1,4,7]);
		lines.push([2,5,8]);
		lines.push([3,6,9]);
		lines.push([1,5,9]);
		lines.push([3,5,7]);
		
		gvc.attachToTab = attachToTab;
		gvc.handleClick = handleClick;

		var view = Ti.UI.createView();
		
		var grid = Ti.UI.createImageView({
			image:'/images/grid.png',
			center: mttt.config.grid.center
		})

		var buttonBaseX = mttt.config.buttonStartX;
		var buttonBaseY = mttt.config.buttonStartY;
		var buttonDelta = mttt.config.buttonDelta;

		view.add(grid);
		
		for(var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				var index =  1+(x*3)+y;
				var oneButton = Ti.UI.createButton({
					backgroundImage: '/images/leer.png',
					backgroundDisabledImage: '/images/leer.png',
					width: mttt.config.buttonWidth,
					height: mttt.config.buttonHeight,
					center: {x: buttonBaseX + (x*buttonDelta), y: buttonBaseY + (y*buttonDelta)},
					enabled: true,
//					gvc: gvc,
					index: index
				});
				buttons.push(oneButton);
				oneButton.addEventListener('click',gvc.handleClick);
				view.add(oneButton);
			}
		}
		
		var endLabel = Ti.UI.createLabel({
			color : mttt.config.labelColor,
			font : {fontSize:18},
			height : 20,
			width : 200,
			top : 0,
			left : 0,
			textAlign : 'center'
		});
		
		view.add(endLabel);
		
		// KI
		if(mttt.app.svc.settings.mode=='single' && PlayerOne.name == 'cpu'){
			buttons[0].fireEvent('click');
		}
		
//		var label = Ti.UI.createLabel({text:_args});
		gvc.lines = lines;
		gvc.buttons = buttons;
		gvc.endLabel = endLabel;
		gvc.view = view;
		gvc.resetGame = resetGame;
	    return gvc;
	};

})();