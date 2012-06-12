Ti.API.info('Including SettingsViewController.js');

(function() {
	var attachToTab = function(_tab) {
		_tab.title = 'Settings';
		var oneWindow = _tab.window;
		var children = Ti.Platform.osname === 'android' ? oneWindow._children : oneWindow.children;

		for(var index = 0; index < children.length; index += 1) {
			var oneChild = children[index];
			oneWindow.remove(oneChild);
		}

		oneWindow.add(this.view);
	};

	mttt.ui.createSettingsViewController = function(_args) {
		var svc = {};
		var view = Ti.UI.createView();

		var settings = {
			mode : 'dual',
			player1 : {
				image : mttt.config.kreuzImg,
				image_win : mttt.config.kreuzImgG,
				begin : true,
				name : 'player 1'
			},
			player2 : {
				image : mttt.config.kreisImg,
				image_win : mttt.config.kreisImgG,
				begin : false,
				name : 'player 2'
			}
		};

		var singleButton = Ti.UI.createButton({
			title : 'Single',
			height : mttt.config.settingsButtonHeight,
			width : mttt.config.settingsButtonWidth,
			top : 30,
			left : 30
		});

		var dualButton = Ti.UI.createButton({
			title : 'Dual',
			enabled : false,
			height : mttt.config.settingsButtonHeight,
			width : mttt.config.settingsButtonWidth,
			top : 30,
			left : 130
		});

		var userImage1 = Ti.UI.createButton({
			backgroundImage : mttt.config.kreisImg,
			backgroundDisabledImage : mttt.config.kreisImgG,
			width : mttt.config.buttonWidth,
			height : mttt.config.buttonHeight,
			enabled : true,
			top : 100,
			left : 30
		});
		var userImage2 = Ti.UI.createButton({
			backgroundImage : mttt.config.kreuzImg,
			backgroundDisabledImage : mttt.config.kreuzImgG,
			width : mttt.config.buttonWidth,
			height : mttt.config.buttonHeight,
			enabled : false,
			top : 100,
			left : 130
		});

		var player1Button = Ti.UI.createButton({
			title : 'Player 1',
			enabled : false,
			height : mttt.config.settingsButtonHeight,
			width : mttt.config.settingsButtonWidth,
			top : 200,
			left : 30
		});

		var player2Button = Ti.UI.createButton({
			title : 'Player 2',
			height : mttt.config.settingsButtonHeight,
			width : mttt.config.settingsButtonWidth,
			top : 200,
			left : 130
		});

		// Create a Label.
		var gameserverLabel = Ti.UI.createLabel({
			text : 'Game-Server',
			color : '#000000',
			font : {
				fontSize : 12
			},
			height : 30,
			width : 100,
			top : 290,
			left : 30,
			textAlign : 'left'
		});

		var nicknameLabel = Ti.UI.createLabel({
			text : 'Nickname',
			color : '#000000',
			font : {
				fontSize : 12
			},
			height : 30,
			width : 100,
			top : 330,
			left : 30,
			textAlign : 'left'
		});

		// Create a TextField.
		var gameserverText = Ti.UI.createTextField({
			height : 35,
			top : 290,
			left : 130,
			width : 100,
			softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_DEFAULT_ON_FOCUS, // Android only
			keyboardType : Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType : Ti.UI.RETURNKEY_DEFAULT,
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		});

		var nicknameText = Ti.UI.createTextField({
			height : 35,
			top : 330,
			left : 130,
			width : 100,
			softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_DEFAULT_ON_FOCUS, // Android only
			keyboardType : Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType : Ti.UI.RETURNKEY_DEFAULT,
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		
		
		singleButton.addEventListener('click',function() {
			this.enabled = false;
			settings.mode = 'single';
			player1Button.title = 'CPU';
			player2Button.title = 'User';
			
			settings.player1.begin = true;
			settings.player2.begin = false;
			
			dualButton.enabled = true;
			
			settings.player1.name = "cpu";
			settings.player2.name = "user";
			
			mttt.app.gvc.resetGame();
		});
		dualButton.addEventListener('click',function() {
			this.enabled = false;
			settings.mode = 'dual';
			player1Button.title = 'Player 1';
			player2Button.title = 'Player 2';
			singleButton.enabled = true;
			settings.player1.name = "player 1";
			settings.player2.name = "player 2";
		});
		userImage1.addEventListener('click',function() {
			this.enabled = false;
			settings.player1.image = mttt.config.kreisImg;
			settings.player1.image_win = mttt.config.kreisImgG;
			settings.player2.image = mttt.config.kreuzImg;
			settings.player2.image_win = mttt.config.kreuzImgG;
			userImage2.enabled = true;
		});
		userImage2.addEventListener('click',function() {
			this.enabled = false;
			settings.player2.image = mttt.config.kreisImg;
			settings.player2.image_win = mttt.config.kreisImgG;
			settings.player1.image = mttt.config.kreuzImg;
			settings.player1.image_win = mttt.config.kreuzImgG;
			userImage1.enabled = true;
		});
		player1Button.addEventListener('click',function() {
			this.enabled = false;
			settings.player1.begin = true;
			settings.player2.begin = false;
			player2Button.enabled = true;
		});
		player2Button.addEventListener('click',function() {
			this.enabled = false;
			settings.player2.begin = true;
			settings.player1.begin = false;
			player1Button.enabled = true;
		});

		// Add to the parent view.
		view.add(singleButton);
		view.add(dualButton);
		view.add(userImage1);
		view.add(userImage2);
		view.add(player1Button);
		view.add(player2Button);
		view.add(gameserverLabel);
		view.add(nicknameLabel);
		view.add(gameserverText);
		view.add(nicknameText);

		svc.view = view;
		svc.attachToTab = attachToTab;
		svc.settings = settings;
		Ti.API.info(settings);
		return svc;
	}
})();
