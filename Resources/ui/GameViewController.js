Ti.API.info('Including GameViewController.js');

(function() {
	
	var PlayerOne,PlayerTwo;
	
	var initPlayers = function(){
		var settings = mttt.app.svc.settings;
		PlayerOne = {
			name  : settings.player1.begin?settings.player1.name:settings.player2.name,
	        image : settings.player1.begin?settings.player1.image:settings.player2.image,
			image_win   : settings.player1.begin?settings.player1.image_win:settings.player2.image_win,
		};
		
		PlayerTwo = {
			name  : settings.player1.begin?settings.player2.name:settings.player1.name,
	        image : settings.player1.begin?settings.player2.image:settings.player1.image,
			image_win   : settings.player1.begin?settings.player2.image_win:settings.player1.image_win,
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
	
	var allocateButtonWithCurrentPlayer = function(index,gvc){
		var buttons = gvc.buttons;
		var currentPlayer = gvc.currentPlayer;
		buttons[index-1].backgroundImage = currentPlayer.image;
		buttons[index-1].backgroundDisabledImage = currentPlayer.image;
		buttons[index-1].enabled = false;
		buttons[index-1].owner = currentPlayer;
	}
	
	var changeCurrentPlayer = function(gvc){
		gvc.currentPlayer = gvc.turn%2?PlayerOne:PlayerTwo;
	}
	
	var prepareNextTurn = function(gvc){
		gvc.turn++;
		setPlayerTurnText(gvc.currentPlayer,gvc);
	}
	
	var handleClick = function(_e,options) {
		var index = _e.source.index;
		
		var gvc = mttt.app.gvc || options.gvc;
		
		allocateButtonWithCurrentPlayer(index,gvc);

		var win = checkForWin(gvc);
		if(win != null){
			gameEnd(win);
		}else {
			changeCurrentPlayer(gvc);
			prepareNextTurn(gvc);	
		}
		
		if(gvc.turn > 8){
			gameEnd(null);	
		}
		
		if(mttt.app.svc.settings.mode=='single' && gvc.currentPlayer.name == 'cpu'){
			var btn = checkForWinningChance(gvc);
			if(btn){
				// press button to win or to prevent losing
				pressButton(btn);
			}
			else{
				var lines = gvc.lines;
				var btns = gvc.buttons;
				// press first empty field
				for(x=0;x < lines.length; x++){
					var index1 = lines[x][0];
					var index2 = lines[x][1];
					var index3 = lines[x][2];
			
					if(btns[index1-1].owner == null){
						pressButton(btns[index1-1]);
						break;
					}else if(btns[index2-1].owner == null){
						pressButton(btns[index2-1]);
						break;
					}else if(btns[index3-1].owner == null){
						pressButton(btns[index3-1]);
						break;
					}
				}
			}
		}
	}
	
	var pressButton = function(btn){
		if(btn!=null){
			btn.fireEvent('click',{source:{index:btn.index}});
		}
	}
	
	var checkForWinningChance = function(gvc){
		var currentPlayer = gvc.currentPlayer;
		var lines = gvc.lines;
		alert(lines);
		var btns = gvc.buttons;
		var x;
		for(x=0;x < lines.length; x++){
			var index1 = lines[x][0];
			var index2 = lines[x][1];
			var index3 = lines[x][2];
			
			if(btns[index1-1].owner!=null && btns[index2-1].owner!=null && btns[index1-1].owner.name == btns[index2-1].owner.name && btns[index3-1].owner == null){
				return btns[index3-1];
			}
			else if(btns[index1-1].owner!=null && btns[index3-1].owner!=null && btns[index1-1].owner.name == btns[index3-1].owner.name && btns[index2-1].owner == null){
				return btns[index2-1];
			}
			else if(btns[index3-1].owner!=null && btns[index2-1].owner!=null && btns[index2-1].owner.name == btns[index3-1].owner.name && btns[index1-1].owner == null){
				return btns[index1-1];
			}
		}
		return null;
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
	
	var setStatusText = function(text,gvc){
		gvc.endLabel.text = text;
	};
	
	var checkForWin = function(gvc){
		var lines = gvc.lines;
		var btns = gvc.buttons;
		var x;
		for(x=0;x < lines.length; x++){
			var index1 = lines[x][0];
			var index2 = lines[x][1];
			var index3 = lines[x][2];
			if(btns[index1-1].owner == null || btns[index2-1].owner == null || btns[index3-1].owner == null){ 
				continue;
			}
			if(btns[index1-1].owner.name == btns[index2-1].owner.name && btns[index2-1].owner.name == btns[index3-1].owner.name){
				return {line:lines[x], winner:btns[index1-1].owner};
			}
		}
		return null;		
	}
	
	var resetGame = function(options){
		var gvc = mttt.app.gvc || options.gvc;
		gvc.turn = 0;
		
		for (var i=0;i < gvc.buttons.length;i++){
			var btn = gvc.buttons[i];
			btn.backgroundImage = '/images/leer.png';
			btn.backgroundDisabledImage = '/images/leer.png';
			btn.enabled = true;
			btn.owner = null;
		}
		gvc.currentPlayer = PlayerOne;
		setPlayerTurnText(gvc.currentPlayer,gvc);
		
		initPlayers();
		
		// KI
		if(mttt.app.svc.settings.mode=='single' && PlayerOne.name == 'cpu'){
			gvc.buttons[0].fireEvent('click',{source:{index:1}});
		}
	}
	
	var setPlayerTurnText = function(player,gvc){
		setStatusText(player.name+"S TURN",gvc);
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
					width: mttt.config.buttonWidth,
					height: mttt.config.buttonHeight,
					center: {x: buttonBaseX + (x*buttonDelta), y: buttonBaseY + (y*buttonDelta)},
					enabled: true,
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
		
//		var label = Ti.UI.createLabel({text:_args});
		gvc.lines = lines;
		gvc.buttons = buttons;
		gvc.endLabel = endLabel;
		gvc.view = view;
		gvc.resetGame = resetGame;
		
		resetGame({gvc:gvc});		
		
	    return gvc;
	};

})();