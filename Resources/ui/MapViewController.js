Ti.API.info('Including SettingsViewController.js');

(function() {
	var attachToTab = function(_tab) {
		_tab.title = 'Map';
		var oneWindow = _tab.window;
		var children = Ti.Platform.osname === 'android' ? oneWindow._children : oneWindow.children;

		for (var index = 0; index < children.length; index += 1) {
			var oneChild = children[index];
			oneWindow.remove(oneChild);
		}

		oneWindow.add(this.view);
	};

	mttt.ui.createMapViewController = function(_args) {
		var mvc = {};
		var view = Ti.UI.createView();
		
		var mapview = Titanium.Map.createView({
            mapType: Titanium.Map.STANDARD_TYPE,
            region: {latitude: 52.585294, 
            longitude: 13.300105, 
            latitudeDelta:0.01, 
            longitudeDelta:0.01},
            animate:true,
            regionFit:true,
            userLocation:true,
        });

		var myAnnotation = Titanium.Map.createAnnotation({
			draggable : false,
			latitude : 52.585294,
			longitude : 13.300105,
		});
		
		//click-event is not supported for annotations on android...
		mapview.addEventListener("click", function(e){
			alert("play with me");
		})

		mapview.addAnnotation(myAnnotation);

		view.add(mapview);
		
		mvc.view = view;
		mvc.attachToTab = attachToTab;
		
		return mvc;
	}
})();