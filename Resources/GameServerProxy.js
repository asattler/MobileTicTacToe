Ti.API.info('Including GameServerProxy.js');

(function() {
	var onConnected = function(e) {
		Ti.API.info("connected");
		Ti.Stream.pump(e.socket, pumpCallback, 1024, true);
		getLocation();
		getUserlist(e);
	}
	var writeCallback = function(data) {
		Ti.API.info("get userlist");
		setTimeout(getUserlist, 10000);
	}
	var userId;

	var pumpCallback = function(obj) {
		var data = eval('(' + obj.buffer + ') ');
		if (data.users) {
			for (var i = 0; i < data.users.length; i++) {
				var user = data.users[i];
				if (user.nickname && user.lat && user.lon && user.id !== userId) {
					mttt.app.mvc.createUserAnnotationOnMap(user)
				}
			}
		} else if (data.msg) {
			if (data.msg === 'loginInfo') {
				if (data.id) {
					userId = data.id;
				}
			}
		}
	}
	var socket;

	var createSocket = function() {
		var server = mttt.app.svc.settings.server.split(":");
		if (server && server[0] && server[1]) {
			socket = Ti.Network.Socket.createTCP({
				host : server[0],
				port : parseInt(server[1], 10),
				connected : onConnected,
				error : function(e) {
					Ti.API.info("error connecting")
				}
			})
		}
	}
	var isConnected = function() {
		if (socket) {
			return socket.state === Ti.Network.Socket.CONNECTED;
		} else {
			return false;
		}
	}
	var connect = function() {
		Ti.API.info(isConnected());
		if (!isConnected()) {
			socket.connect();
		}
	}
	var login = function() {
		var data = {
			value : 'msg=login;nickname='+mttt.svc.settings.nickname
		};
		if (isConnected()) {
			Ti.Stream.write(socket.Ti.createBuffer(data), function(data) {
			});
		}
	}
	var getUserlist = function(){
		Ti.Stream.write(socket, Ti.createBuffer({
			value : 'msg=userlist'
		}), writeCallback);
	}
	var publishPosition = function(lat, lon) {
		var data = {
			value : 'msg=position;lat=' + lat + ';lon=' + lon + ';nickname=' + mttt.app.svc.settings.nickname + ';'
		};
		if (isConnected()) {
			Ti.Stream.write(socket, Ti.createBuffer(data), function(data) {
			});
		}
	}
	var getLocation = function() {
		Titanium.Geolocation.getCurrentPosition(function(evt) {
			if (evt.error) {
				return;
			}

			var lon = evt.coords.longitude;
			var lat = evt.coords.latitude;

			publishPosition(lat, lon);
		})
	}

	mttt.app.createGameServerProxy = function() {
		var gsp = {};

		createSocket();
		connect();

		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_HIGH;

		Ti.Geolocation.addEventListener('location', function(e) {
			if (e.error) {
				return false;
			}
			if (e.coords.longitude !== null && e.coords.latitude !== null) {
				var lon = e.coords.longitude;
				var lat = e.coords.latitude;
				publishPosition(lat, lon);
			}
		});
		
		

		gsp.publishPosition = publishPosition;
		gsp.createSocket = createSocket;
		gsp.connect = connect;
		return gsp;
	}
})(); 