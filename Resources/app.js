// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include('mttt.js');

// mttt.js creates the following namespaces
// mttt
// mttt.app

mttt.app.tabGroup = mttt.ui.createTabGroup();

mttt.app.tabGroup.open();

mttt.app.svc = mttt.ui.createSettingsViewController();
mttt.app.svc.attachToTab(mttt.app.tabGroup.tabs[2]);

mttt.app.gvc = mttt.ui.createGameViewController();
mttt.app.gvc.resetGame();
mttt.app.gvc.attachToTab(mttt.app.tabGroup.tabs[0]);

