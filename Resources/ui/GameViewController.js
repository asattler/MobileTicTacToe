Ti.API.info('Including GameViewController.js');

(function() {
	
	var PlayerOne,PlayerTwo;
	
	var initPlayers = function(){
		var settings = mttt.app.svc.settings;
		var player1 = settings.player1;
		var player2 = settings.player2;
		
		PlayerOne = {
			name  : player1.begin?player1.name:player2.name,
	        image : player1.begin?player1.image:player2.image,
			image_win   : player1.begin?player1.image_win:player2.image_win,
		};
		
		PlayerTwo = {
			name  : player1.begin?player2.name:player1.name,
	        image : player1.begin?player2.image:player1.image,
			image_win   : player1.begin?player2.image_win:player1.image_win,
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
		
		// mark button as owned by player
		allocateButtonWithCurrentPlayer(index,gvc);
		
		// check if player won
		var win = checkForWin(gvc);
		if(win != null){
			gameEnd(win);
			return;
		}
		
		changeCurrentPlayer(gvc);
		prepareNextTurn(gvc);
		
		// game is over after move 9
		if(gvc.turn > 8){
			gameEnd(null);	
			return;
		}
		
		// cpu as player
		if(mttt.app.svc.settings.mode=='single' && gvc.currentPlayer.name == 'cpu'){
			var chances = checkForWinningChances(gvc);
			// no chances, press first empty field
			if(chances.length==0){
				pressNextEmptyField(gvc);
				return;
			}
			
			// check winning chances
			for(var i=0;i<chances.length;i++){
				var chance = chances[i];
				if(chance.win){
					pressButton(chance.emptyBtn);
					return;
				}
			}
			// press first empty button to prevent to lose
			pressButton(chances[0].emptyBtn);
		}
	}
	
	/*
	 * Iterates over all lines.
	 * Callback should be something like "function(btn1,btn2,btn3,line){}",
	 * where btn1 is the first button of the line, btn2 the second and btn3 the third.
	 * "line" is an array of btn indexes.
	 */
	var eachLine = function(gvc,callback){
		var lines = gvc.lines;
		var btns = gvc.buttons;

		for(x=0;x < lines.length; x++){
			callback(btns[lines[x][0]-1],btns[lines[x][1]-1],btns[lines[x][2]-1],lines[x]);
		}
	}
	
	var pressNextEmptyField = function(gvc){
		var buttonPressed = false;
		
		eachLine(gvc,function(first,second,third){
			if(buttonPressed)return;
			
			if(first.owner == null){
				pressButton(first);
				buttonPressed = true;
			}else if(second.owner == null){
				pressButton(second);
				buttonPressed = true;
			}else if(third.owner == null){
				pressButton(third);
				buttonPressed = true;
			}
		});
			
	}
	
	var pressButton = function(btn){
		if(btn!=null){
			btn.fireEvent('click',{source:{index:btn.index}});
		}
	}
	
	/*
	 * Gets the chances to win a game.
	 * A chance object: {emptyBtn,forWin}.
	 * Where "emptyBtn" is the button to press to win or prevent losing,
	 * and "forWin" is true, if the current user could 
	 * win this game by pressing the empty button.
	 * 
	 * return the list of chance
	 */
	var checkForWinningChances = function(gvc){
		var chances = [];
		var currentPlayer = gvc.currentPlayer;
		eachLine(gvc,function(first,second,third){
			if(first.owner!=null && second.owner!=null && first.owner.name == second.owner.name && third.owner == null){
				chances.push({emptyBtn:third,forWin:first.owner.name==currentPlayer.name});
			}
			else if(first.owner!=null && third.owner!=null && first.owner.name == third.owner.name && second.owner == null){
				chances.push({emptyBtn:second,forWin:first.owner.name==currentPlayer.name});
			}
			else if(third.owner!=null && second.owner!=null && second.owner.name == third.owner.name && first.owner == null){
				chances.push({emptyBtn:first,forWin:third.owner.name==currentPlayer.name});
			}
		});
		return chances;
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
		var win = null;
		eachLine(gvc,function(first,second,third,line){
			if(first.owner == null || second.owner == null || third.owner == null){ 
				return;
			}
			if(first.owner.name == second.owner.name && second.owner.name == third.owner.name){
				win = {line:line, winner:first.owner};
			}
		});
		return win;
	}
	
	var resetGame = function(options){
		var gvc = mttt.app.gvc || options.gvc;
		gvc.turn = 0;
		
		initPlayers();
		
		for (var i=0;i < gvc.buttons.length;i++){
			var btn = gvc.buttons[i];
			btn.backgroundImage = '/images/leer.png';
			btn.backgroundDisabledImage = '/images/leer.png';
			btn.enabled = true;
			btn.owner = null;
		}
		
		gvc.currentPlayer = PlayerOne;
		setPlayerTurnText(gvc.currentPlayer,gvc);
		
		// KI
		if(mttt.app.svc.settings.mode=='single' && PlayerOne.name == 'cpu'){
			gvc.buttons[0].fireEvent('click',{source:{index:1}});
		}
	}
	
	var setPlayerTurnText = function(player,gvc){
		setStatusText(player.name+"s turn",gvc);
	}
	
  	mttt.ui.createGameViewController = function(_args) {
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
		
		var resetBtn = Ti.UI.createButton({
			title : 'reset',
			width: mttt.config.buttonWidth,
			height: mttt.config.buttonHeight,
			left: 130,
			bottom: 30
		});
		
		resetBtn.addEventListener('click', function(e) {
			mttt.app.gvc.resetGame();
		});
				
		view.add(endLabel);
		
		gvc.lines = lines;
		gvc.buttons = buttons;
		gvc.endLabel = endLabel;
		gvc.view = view;
		gvc.resetGame = resetGame;
		
		resetGame({gvc:gvc});		
		
		view.add(resetBtn);
		
	    return gvc;
	};

})();