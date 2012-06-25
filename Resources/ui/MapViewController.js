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
	
	var mapview;
	
	var createUserAnnotationsOnMap = function(userlist){
		for(var i=0;i<userlist.length;i++){
			var user = userlist[i];
			// user.status;
			// user.id;
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
		
		var socket = Ti.Network.Socket.createTCP({
			host: 'www.czichos.net',port: 8080,
			connected: function(e){
				Titanium.Geolocation.getCurrentPosition(function(e){
					if(e.error){
						alert('error get current pos');
						return;
					}
					
					var lon = e.coords.longitude;
					var lat = e.coords.latitude;
					
					Ti.Stream.write(socket,Ti.createBuffer({value: 'msg=position;lat='+lat+';lon='+lon+';nickname=geistMario;'}),function(data){});
				})
				Ti.Stream.pump(e.socket,function(obj){
					
					var data = eval('('+obj.buffer+') ');
					alert(data.users)
					if(data.users){
						createUserAnnotationsOnMap(data.users)
					}
				}, 1024, true);
				Ti.Stream.write(socket,Ti.createBuffer({
					value: 'msg=userlist'
				}),function(data){
				});
			
			}
		})
		
		socket.connect();
		
		
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
		
		return mvc;
	}
})();