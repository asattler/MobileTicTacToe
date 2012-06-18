Ti.API.info('Including ui.js');

(function(){

	mttt.ui = {};
	
	mttt.ui.createTabGroup = function() {
		// create tab group
		var tabGroup = Titanium.UI.createTabGroup();
	
		// create tab1 with window
		var win1 = Titanium.UI.createWindow({  
		    title:'Tab 1',
		    backgroundColor:'#fff'
		});
		var tab1 = Titanium.UI.createTab({  
		    icon:'KS_nav_views.png',
		    title:'Tab 1',
		    window:win1
		});
		var label1 = Titanium.UI.createLabel({
			color:'#999',
			text:'GameView',
			font:{fontSize:20,fontFamily:'Helvetica Neue'},
			textAlign:'center',
			width:'auto'
		});
		win1.add(label1);
		
		// create tab2 with window
		var win2 = Titanium.UI.createWindow({  
		    title:'Tab 2',
		    backgroundColor:'#fff'
		});
		var tab2 = Titanium.UI.createTab({  
		    icon:'KS_nav_ui.png',
		    title:'Tab 2',
		    window:win2
		});
		var label2 = Titanium.UI.createLabel({
			color:'#999',
			text:'MapView',
			font:{fontSize:20,fontFamily:'Helvetica Neue'},
			textAlign:'center',
			width:'auto'
		});
		win2.add(label2);
		
		// create tab2 with window
		var win3 = Titanium.UI.createWindow({  
		    title:'Tab 3',
		    backgroundColor:'#fff'
		});
		var tab3 = Titanium.UI.createTab({  
		    icon:'KS_nav_ui.png',
		    title:'Tab 3',
		    window:win3
		});
		var label3 = Titanium.UI.createLabel({
			color:'#999',
			text:'SettingsView',
			font:{fontSize:20,fontFamily:'Helvetica Neue'},
			textAlign:'center',
			width:'auto'
		});	
		win3.add(label3);
		
		//  add tabs
		tabGroup.addTab(tab1);  
		tabGroup.addTab(tab2);  
		tabGroup.addTab(tab3);  
	
		// open tab group
		return tabGroup;
	}
})();

//Include additional namespaces
Ti.include(
	'MapViewController.js',
	'SettingsViewController.js',
	'GameViewController.js'
);