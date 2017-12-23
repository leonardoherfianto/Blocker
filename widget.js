var _Widget = {
	_title : ['hide','remove','click','fill'],
	_logo : ['H','R','C','F'],
	_area : ['b','d','f','h'],
	control : {
		init : function(){
			document.addEventListener('keypress',function(event){
				var key = event.which || event.keyCode;
				if(key === 9){
					_Widget.incept.active = _Widget.incept.active == true ? false : true;
				}
				if(key === 10){
					_Widget.manager.app();
				}
				if(key === 17){
					_Widget.page.app();
				}
				if(key === 109 && _Widget.incept.active){
					_Widget.incept.menu = _Widget.incept.menu == true ? false : true;
				}
				console.log(key);
			});
			document.addEventListener('mousemove',function(event){
				_Widget.incept.app(event);
			});
		}
	},
	incept : {
		counter : 0,
		active : false,
		elem : undefined,
		menu : false,
		app : function(e){
			if(!this.panel){
				this.addPanel();
			}
			if(!this.border){
				this.addBorder();
			}
			if(!this.layerMenu){
				this.addMenu();
			}
			if(this.active){
				if(!this.menu){
					this.elem = document.elementFromPoint(e.clientX, e.clientY);
					if(this.elem){
						var measure = this.elem.getBoundingClientRect();
						this.setBorder(measure);
						this.setPanel(this.getInfo(),new Vector(e.clientX,e.clientY));
					}
				}else{
					if(this.elem){
						this.setMenu(new Vector(e.clientX,e.clientY));
					}
				}
			}else{
				if(this.border[0].isActive){
					this.setBorder({
						width : 0,
						height : 0,
						left : 0,
						top : 0
					});
					this.border.css({'display' : 'none'}).prop({'isActive':false});
				}
				if(this.panel[0].isActive){
					this.panel.css({'display' : 'none'}).prop({'isActive':false});
				}
				if(this.layerMenu[0].isActive){
					this.closeMenu();
				}
				if(this.elem){
					this.elem = undefined;
				}
			}
		},
		border : undefined,
		panel : undefined,
		layerMenu : undefined,
		isScan : true,
		addBorder : function(){
			this.border = _Grab().add('DIV#inceptBorder').prop({
				'isActive' : false
			});
		},
		addPanel : function(){
			this.panel = _Grab().add('DIV#inceptPanel').prop({
				'isActive' : false
			});
		},
		addMenu : function(){
			this.layerMenu = _Grab().add('UL#inceptMenu').prop({
				'isActive' : false
			});
			var menuBtn = this.layerMenu.add('LI.inceptBtn*4');
			menuBtn.map(function(elm,idx){
				elm.title = _Widget._title[idx];
				elm.innerHTML = _Widget._logo[idx];
				elm.style.gridArea = _Widget._area[idx];
				elm.onclick = function(){
					_Widget.incept.action(this.title);
				};
			});
		},
		setBorder : function(measure){
			this.border.css({
				'width' : measure.width+'px',
				'height' : measure.height+'px',
				'left' : measure.left+'px',
				'top' : measure.top+'px'
			});
			if(!this.border[0].isActive){
				this.border.css({'display' : 'block'}).prop({'isActive':true});
			}
		},
		setPanel : function(data,pos){
			var psize = this.panel.bound()[0];
			var center = new Vector(window.innerWidth/2,window.innerHeight/2);
			var dist = pos.clone().sub(center);
			var mag = new Vector(psize.width,psize.height).mag();
			var spot = dist.clone().setMag(-mag).add(pos).sub(new Vector(psize.width/2,psize.height/2));
			if(!this.panel[0].isActive){
				this.panel.css({'display' : 'block'}).prop({'isActive':true});
			}
			this.panel.html('<label style="display:block">TAG : '+data.tag+'</label><label style="display:block">CLASS : '+data.class+'</label><label style="display:block">ID : '+data.id+'</label>');
			this.panel.css({
				'left' : spot.x + 'px',
				'top' : spot.y + 'px'
			});
		},
		setMenu : function(pos){
			if(!this.layerMenu[0].isActive){
				this.layerMenu.css({
					'display' : 'grid',
					'left' : pos.x + 'px',
					'top' : pos.y + 'px'
				}).prop({'isActive':true});
			}
		},
		closeMenu : function(){
			this.layerMenu.css({
				'display' : 'none',
				'left' :'-60px',
				'top' : '-60px'
			}).prop({'isActive':false});
			this.menu = false;
		},
		getInfo : function(){
			var info = {};
			info.tag = this.elem.tagName;
			info.class = this.elem.className;
			info.id = this.elem.id;
			return info;
		},
		action : function(mode){
			if(this.elem){
				var target = _Uni_Id(this.elem._Grab());
				this.data[this.counter] = {};
				this.data[this.counter].el = target;
				this.data[this.counter].mode = _Widget._title.indexOf(mode);
				this.counter++;
				this.isScan = true;
				this.closeMenu();
				this.save();
			}
		},
		scan : function(){
			if(this.isScan){
				for(var i in this.data){
					if(this.data.hasOwnProperty(i)){
						var data = this.data[i];
						var idx = [];
						var elms = data.el.split('>');
						for (var j= 0; j < elms.length; j++) {
							if(elms[j].match(/\[[0-9]+\]/g) !== null){
								var setidx = elms[j].match(/\[[0-9]+\]/g)[0];
								elms[j] = elms[j].replace(setidx,'');
								idx.push(parseFloat(setidx.replace(/[\[\]]/g,'')));
							}else{
								idx.push(null);
							}
						}
						var parent = _Grab();
						var child = undefined;
						for (var k = 0; k < elms.length; k++){
							if(child){
								parent = child;
							}
							child = parent._Grab(elms[k]);
							if(idx[k] !== null){
								child = child[idx[k]];
							}
						}
						if(child){
							if(data.mode == 0){
								child._Grab().css({
									'display':'none',
									'position':'absolute',
									'left':'-1000px',
									'top':'-1000px',
									'z-index':'-1',
									'height':'0px',
									'width':'0px',
									'overflow':'hidden'
								});
							}
							if(data.mode == 1){
								child._Grab().remove();
							}
							if(data.mode == 2){
								child._Grab()[0].click();
							}
							if(data.mode == 3){
								child._Grab()[0].focus();
							}
						}
						this.counter = i + 1;
					}
				}
			}
			this.isScan = false;
		},
		init : function(){
			if(typeof(Storage) !== undefined){
				if(localStorage.getItem('WIDGET_ITEM')){
					_Widget.incept.data = JSON.parse(localStorage.getItem('WIDGET_ITEM'));
				}else{
					localStorage.setItem('WIDGET_ITEM',JSON.stringify(_Widget.incept.data));
				}
			}
		},
		save : function(){
			localStorage.setItem('WIDGET_ITEM',JSON.stringify(_Widget.incept.data));
		},
		data : {}
	},
	manager : {
		panel : undefined,
		active : false,
		addPanel : function(){
			this.panel = _Grab().add('UL#inceptManager').addClass('.scroll').attr({
				'title' : 'ITEM MANAGER'
			});
			for(var i in _Widget.incept.data){
				if(_Widget.incept.data.hasOwnProperty(i)){
					this.panel.add('LI.item_list').text(_Widget.incept.data[i].el+' --> '+_Widget.incept.data[i].mode).on('click',function(){
						_Widget.manager.release(this.tableList);
						this._Grab().remove();
					}).prop({
						'tableList' : i
					});
				}
			}
		},
		closePanel : function(){
			this.panel.remove();
			this.panel = undefined;
		},
		app : function(){
			this.active = this.active === true ? false : true;
			if(this.active){
				this.addPanel();
			}else{
				this.closePanel();
			}
		},
		release : function(idx){
			delete _Widget.incept.data[idx];
			_Widget.incept.save();
		},
	},
	page : {
		app : function(){
			if(localStorage.getItem('BLOCKED') != null){
				var isBlock = localStorage.getItem('BLOCKED');
				var actBlock = isBlock == 'true' ? 'false' : 'true';
				localStorage.setItem('BLOCKED',actBlock);
				if(actBlock === 'false'){
					alert('Page is not Blocked');
				}else{
					_Blocker.engine.page.block();
				}
			}else{
				localStorage.setItem('BLOCKED','true');
			}
		}
	}
};