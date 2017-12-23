var _Blocker = {
	port : undefined,
	init : function(){
		if(_Blocker.ready){
			if(_Blocker.status.isActive){
				_Blocker.engine.page.status();
				_Blocker.engine.page.scaner();
				_Widget.incept.init();
			}
		}else{
			setTimeout(function(){
				_Blocker.init();
			},200);
		}
	},
	connect : function(){
		this.port = chrome.runtime.connect({name:'scanner'});
		this.port.onMessage.addListener(function(msg){
			_Blocker.handle(msg);
		});
		chrome.runtime.onMessage.addListener(function(msg){
			if(msg.req === 'log'){
				_Blocker.sendLog();
			}
			if(msg.req === 'reload'){
				location.reload();
			}
		});
		_Blocker.sync();
	},
	scaning : function(){
		try{
			if(_Blocker.status.isActive){
				var items = _Grab('*');
				items.map(function(item){
					var itemProp = {};
					var itemAttr = {};
					var itemLink = {};
					itemProp[0] = item.id ? item.id : '';
					itemProp[1] = item.className ? item.className.toString() : '';
					itemAttr[0] = item.getAttribute('title') ? item.getAttribute('title') : '';
					itemAttr[1] = item.getAttribute('alt') ? item.getAttribute('alt') : '';
					itemLink[0] = item.href ? item.href.toString() : '';
					itemLink[1] = item.src ? item.src.toString() : '';
					var j;
					for(j in itemProp){
						if(itemProp.hasOwnProperty(j)){
							if(itemProp[j].match(_Blocker.engine.element.filter) !== null || itemAttr[j].match(_Blocker.engine.content.filter) !== null || itemLink[j].match(_Blocker.engine.page.filter) !== null){
								_Blocker.engine.eliminate(item._Grab());
								_Blocker.amount++;
							}
						}
					}
				});
				_Blocker.engine.prevent();
				_Blocker.sendLog();
			}
		}catch(err){
			console.log(err);
		}
	},
	sync : function(){
		this.port.postMessage({req:'status'});
		this.port.postMessage({req:'filter'});
	},
	handle : function(msg){
		if(msg.action === 'status_update'){
			_Blocker.status = JSON.parse(msg.response);
		}else if(msg.action === 'filter_update'){
			var filter = JSON.parse(msg.response);
			_Blocker.engine.page.filter = new RegExp(filter.page.join('|'),'gmi');
			_Blocker.engine.element.filter = new RegExp(filter.element.join('|'),'gmi');
			_Blocker.engine.content.filter = new RegExp(filter.content.join('|'),'gmi');
			_Blocker.ready = true;
		}else if(msg.action === 'last_status'){
			var last_status = JSON.parse(msg.response);
			if(last_status.isActive !== _Blocker.status.isActive){
				location.reload();
			}
		}else{
			console.log(msg);
		}
	},
	sendLog : function(){
		this.port.postMessage({req:'update_log',val:_Blocker.amount.toString()});
	},
	status : {
		isActive : false
	},
	engine : {
		page : {
			filter : undefined,
			scaner : function(){
				try{
					if(location.href.toString().match(_Blocker.engine.page.filter) != null){
						localStorage.setItem('BLOCKED','true');
						_Blocker.engine.page.block();
					}else{
						if(localStorage.getItem('BLOCKED') == null){
							localStorage.setItem('BLOCKED','false');
						}
					}
				}catch(err){
					console.log(err);
				}
			},
			status : function(){
				try{
					if(location.href === 'http://leonardopc/Extention/BLOCKER_FINAL/EXT/blockpage.html'){
						_Blocker.port.postMessage({req:'close'});
					}else if(localStorage.getItem('BLOCKED') !== null && localStorage.getItem('BLOCKED') === 'true'){
						_Blocker.engine.page.block();
					}
				}catch(err){
					console.log(err);
				}				
			},
			block : function(){
				window.stop();
				location.replace('http://leonardopc/Extention/BLOCKER_FINAL/EXT/blockpage.html');
			}
		},
		element : {
			filter : undefined
		},
		content : {
			filter : undefined
		},
		eliminate : function(target){
			if(target){
				try{
					target.remove();
				}catch(err){
					try{
						target[0].parentNode.removeChild(target[0]);
					}catch(err){
						target.addClass('BlockItem');
					}
				}
			}
		},
		prevent : function(){
			var threat = _Grab('.BlockItem');
			threat.css({
				'width':'0px',
				'height':'0px',
				'overflow':'hidden',
				'display':'none'
			});
		},
	},
	amount : 0,
	ready : false,
};
_Blocker.connect();
_Blocker.init();