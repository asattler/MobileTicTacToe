Ti.API.info('Including MapViewController.js');

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
	
	var mapview;
	
	var createUserAnnotationOnMap = function(user){
		var annotation = Titanium.Map.createAnnotation({
			draggable : false,
			pincolor : Titanium.Map.ANNOTATION_RED,
			latitude : user.lat,
			longitude : user.lon,
			title : user.nickname,
			subtitle : "Score 12",
			leftButton : "/images/play.png",
			rightButton : "/images/next.png",
		});
		mapview.addAnnotation(annotation);
	}

	mttt.ui.createMapViewController = function(_args) {
		var mvc = {};
		var view = Ti.UI.createView();
		
		mapview = Titanium.Map.createView({
            mapType: Titanium.Map.STANDARD_TYPE,
            region: {
            	latitude: 52.545226,
            	longitude: 13.351818,
            	latitudeDelta:0.01, 
            	longitudeDelta:0.01
            },
            animate:true,
            regionFit:true,
            userLocation:true,
    		visible: true,
        });
		
		//click-event is not supported for annotations on android...
		mapview.addEventListener("click", function(e){
			//alert(e.clicksource);
			if(e.clicksource === "leftPane"){
				alert("Play with me");
			}
			else if(e.clicksource === "rightPane"){
				alert("Info");
			}
			//mapview.showAnnotation(e.annotation);

			//alert("play with me");
		});

		view.add(mapview);
		
		mvc.mapview = mapview;
		mvc.view = view;
		mvc.attachToTab = attachToTab;
		mvc.createUserAnnotationOnMap = createUserAnnotationOnMap;
		return mvc;
	}
})();