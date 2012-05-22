var mttt = {};

(function() {
	// application state variables are held in this namespace.
	// Like the current app window, for instance, which is created in app.js
	mttt.app = {};

	// app-parameters
	mttt.app.screenWidth = Ti.Platform.displayCaps.platformWidth;
	mttt.app.screenHeight = Ti.Platform.displayCaps.platformHeight;
	
})();

//Include additional namespaces
Ti.include(
	'/config/config.js',
	'/ui/ui.js',
	'/model/model.js'
);