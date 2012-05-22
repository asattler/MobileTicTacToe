Ti.API.info('Including GameViewController.js');

(function() {
	var kreuzImg = '/images/kreuz.png';
	var kreuzWinImg = '/images/kreuz_g.png';
	
	var kreisImg = '/images/kreis.png';
	var kreisWinImg = '/images/kreis_g.png';
	
	var numTurn = 1;
	
	var attachToTab = function(_tab) {
		
		var oneWindow = _tab.window;
		var children = oneWindow.children;
		var childCount = children.length;
		
		for (var index = 0; index < childCount; index += 1)
		{
			var oneChild = children[index];
		    oneWindow.remove(oneChild);
		}
		
		oneWindow.add(this.view);
	};

	var grid = [];
	var handleClick = function(_e) {
		if(numTurn >= 9){
			gameEnd();	
		}
		var lastTurn = mttt.app.gvc.turn || 0;
		var testen = _e;
		var index = _e.source.index;
		
		var image;
		var statusText;
		if(lastTurn%2){
			image=kreisImg;
			statusText = "Spieler 1 ist dran";
		}
		else{
			 image=kreuzImg;
			 statusText = "Spieler 2 ist dran";
		}
		
		
		
				
		mttt.app.gvc.buttons[index-1].backgroundImage = image;
		mttt.app.gvc.buttons[index-1].backgroundDisabledImage = image;
		mttt.app.gvc.buttons[index-1].enabled = false;
		mttt.app.gvc.buttons[index-1].owner = (image == kreuzImg) ? "Spieler 1" : "Spieler 2";
		mttt.app.gvc.turn = lastTurn+1;
		
		grid[index-1] = image;
		
		if(checkForWin() != null){
			gameEnd(image);
		}
		
		mttt.app.gvc.endLabel.text = statusText;
		
		numTurn++;
	}
	
	var gameEnd = function(image){
		var winner;
		// spieler 2
		if(image == kreisImg){
			winner = "Spieler 2";
		}
		//spieler 1
		else if(image == kreuzImg){
			winner = "Spieler 1";
		}
		//draw
		else {
			winner = "Niemand";
		}
		
		var text = winner+" hat gewonnen";
		
		alert(text);
		resetGame();
		
	}
	
	var checkForWin = function(){
		var lines = mttt.app.gvc.lines;
		var btns = mttt.app.gvc.buttons;
		for(var x in lines){
			var index1 = lines[x][0];
			var index2 = lines[x][1];
			var index3 = lines[x][2];
			alert(btns[index1-1].owner +" : "+ btns[index2-1].owner +" : "+ btns[index3-1].owner);
			if(btns[index1-1].owner == null || btns[index2-1].owner == null || btns[index3-1].owner == null){ 
				return null;
			}
			if(btns[index1-1].owner == btns[index2-1].owner && btns[index2-1].owner == btns[index3-1].owner){
				return {line:lines[x], winner:btns[index1].owner};
			}
		}
		return null;		
	}
	
	
	var resetGame = function(){
		for (var i=0;i < mttt.app.gvc.buttons.length;i++){
			var btn = mttt.app.gvc.buttons[i];
			btn.backgroundImage = '/images/leer.png';
			btn.backgroundDisabledImage = '/images/leer.png';
			btn.owner = null;
		}
		mttt.app.gvc.endLabel.text = "Spieler 1 ist dran";
	}

  	mttt.ui.createGameViewController = function(_args) {
  		
  		var gvc = {};
  		var buttons = [];
  		var lines = [];
		lines[0] = [1,2,3];
		lines[1] = [4,5,6];
		lines[2] = [7,8,9];
		lines[3] = [1,4,7];
		lines[4] = [2,5,8];
		lines[5] = [3,6,9];
		lines[6] = [1,5,9];
		lines[7] = [3,5,7];
		
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
		
		// Create a Label.
		var endLabel = Ti.UI.createLabel({
			text : "Spieler 1 ist dran",
			color : '#000000',
			font : {fontSize:12},
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
	
	    return gvc;
	};

})();