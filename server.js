var _Server = {
	connect : function(){
		chrome.tabs.onActivated.addListener(function(){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {req : 'log'});
			});
		});
		chrome.runtime.onConnect.addListener(function(port){
			port.onMessage.addListener(function(msg){
				if(msg.req){
					if(msg.req === 'close'){
						_Server.command.closePage(port);
					}
					if(msg.req === 'status'){
						port.postMessage({
							response : JSON.stringify(_Server.command.status),
							action : 'status_update'
						});
					}
					if(msg.req === 'update'){
						_Server.command.setStatus(msg.val);
					}
					if(msg.req === 'filter'){
						port.postMessage({
							response : JSON.stringify(_Server.command.filter),
							action : 'filter_update'
						});
					}
					if(msg.req === 'update_log'){
						chrome.browserAction.setBadgeText({text : msg.val});
						port.postMessage({
							response : JSON.stringify(_Server.command.status),
							action : 'last_status'
						});
					}
				}else{
					port.postMessage({
						response : 'Server Ready!'
					});
				}
			});
		});
	},
	command : {
		closePage : function(port){
			chrome.tabs.remove(port.sender.tab.id);
		},
		status : {
			isActive : false
		},
		setStatus : function(newStatus){
			_Server.command.status = JSON.parse(newStatus);
			_Server.save.status();
		},
		filter : {
			page : ["[^lo]ads\\b","\\bads",".gif","adclick","offer","adv(?!en)","banner","klik"],
			element : ["[^lo]ads\\b","\\bads","banner","aswift","modal","ad-","pop","adv(?!en)","google_ads"],
			content : ["[^lo]ads\\b","\\bads","adv(?!en)"]
		}
	},
	sync : function(){
		document.addEventListener('DOMContentLoaded',function(event){
			if(typeof(Storage) !== undefined){
				if(localStorage.getItem('STATUS')){
					_Server.command.status = JSON.parse(localStorage.getItem('STATUS'));
				}else{
					_Server.save.status();
				}
			}
		});
	},
	save : {
		status : function(){
			var statusData = JSON.stringify(_Server.command.status);
			localStorage.setItem('STATUS',statusData);
		}
	}
};
_Server.connect();
_Server.sync();