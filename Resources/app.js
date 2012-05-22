// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include('mttt.js');

// mttt.js creates the following namespaces
// mttt
// mttt.app

mttt.app.tabGroup = mttt.ui.createTabGroup();

mttt.app.tabGroup.open();

mttt.app.gvc = mttt.ui.createGameViewController();
mttt.app.gvc.attachToTab(mttt.app.tabGroup.tabs[0]);
