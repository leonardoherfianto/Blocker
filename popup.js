var _Menu = {
connect : function(){
		this.port = chrome.runtime.connect({name:'menu'});
		this.port.onMessage.addListener(function(msg){
			_Menu.handle(msg);
		});
		this.port.postMessage({req:'status'});
	},
	port : undefined,
	handle : function(msg){
		if(msg.action === 'status_update'){
			_Menu.status = JSON.parse(msg.response);
		}
	},
	status : {
		isActive : false
	},
	setStatus : function(){
		if(this.status.isActive){
			document.getElementsByClassName('switch_toggle')[0].checked = true;
		}else if(!this.status.isActive){
			document.getElementsByClassName('switch_toggle')[0].checked = false;
		}
	},
	setButton : function(btn){
		this.status.isActive = btn.checked === true ? true : false;
		this.port.postMessage({req:'update',val:JSON.stringify(this.status)});
		_Menu.setTab();
	},
	setTab : function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {req : 'reload'});
		});
	},
	ready : function(){
		if(document.readyState === 'complete'){
			_Menu.setStatus();
			document.getElementsByClassName('switch_toggle')[0].onclick = function(){
				_Menu.setButton(this);
			};
		}else{
			setTimeout(_Menu.ready,200);
		}
	}
};
_Menu.connect();
_Menu.ready();