/*
	GRABER LIBRARY V2.0
	Author : Leonardo H.
*/
_GRAB_INSTALL = function(){
	var res;
	var Grab = function(selector){
		if(!selector){
			if(this !== window){
				if(this instanceof _Grab.init.Graber){
					return this;
				}
				if(Array.isArray(this)){
					return new Grab.init.Graber(this);
				}else{
					return new Grab.init.Graber([this]);
				}
			}else{
				return new Grab.init.Graber([document.body]);
			}
		}
		if(selector && typeof selector === 'string'){
			try{
				if(this instanceof _Grab.init.Graber){
					_selectorChild = selector;
					allres = this.map(function(el){
						var elms = el.querySelectorAll(_selectorChild);
						return elms;
					});
					res = [];
					for (var i = 0; i < allres.length; i++) {
						for (var j = 0; j < allres[i].length; j++) {
							res.push(allres[i][j]);
						}
					}
					return new Grab.init.Graber(res);
				}else{
					res = document.querySelectorAll(selector);
					return new Grab.init.Graber(res);
				}
			}catch(err){
				try{
					if(this !== window){
						var els;
						if(this instanceof _Grab.init.Graber === false){
							if(this[0] != undefined){
								var toArr = [];
								for (var i = 0; i < this.length; i++) {
									toArr.push(this[i]);
								}
								els = new _Grab.init.Graber(toArr);
							}else{
								els = new _Grab.init.Graber([this]);
							}
						}else{
							els = this;
						}
						res = els.map(function(elem){
							var matches = Grab.init.Nav(elem,selector);
							return matches;
						});
						return new Grab.init.Graber(res);
					}
				}catch(err){
					return undefined;
				}
			}
		}
	};
	(function(){
		Grab.init = Grab.prototype = {
			Graber : function(elms){
				var ps = 0;
				for(var i = 0; i < elms.length; i++ ) {
					if(elms[i] instanceof _Grab.init.Graber){
						for(var j = 0; j < elms[i].length; j++){
							this[ps] = elms[i][j];
							ps++;
						}
					}else{
						this[ps] = elms[i];
						ps++;
					}
				}
				this.length = ps;
			},
			Nav : function(target,selector){
				var rlen = /[\d]+/, 
					len = rlen.exec(selector) ? parseFloat(rlen.exec(selector)[0]) : undefined,
					base = target;
				if(selector.match(/^</)){
					if(!len) len = 1;
					for (var i = 0; i < len; i++) {
						base = base.parentElement;
					}
					return base;
				}
				if(selector.match(/^\>/)){
					if(!len) len = 0;
					base = base.children[len];
					return base;
				}
				if(selector.match(/^\+/)){
					if(!len) len = 1;
					for (var i = 0; i < len; i++) {
						if(base.nextElementSibling){
							base = base.nextElementSibling;
						}
					}
					return base;
				}
				if(selector.match(/^\-/)){
					if(!len) len = 1;
					for (var i = 0; i < len; i++) {
						if(base.previousElementSibling){
							base = base.previousElementSibling;
						}
					}
					return base;
				}
			},
			handle : function(){}
		};
		Grab.fn = Grab.prototype = {
			add : function(query,parent){
				this.query = query || '';
				this.parent = parent || document.body;
				this.len = 1;
				this.pos = undefined;
				this.els = [];
				this.init = function(){
					this.els = [];
					var rlen = /\*[\d]+/, rmultiple = /\[.*?\]/, rsingle = /[^*]+/, rprop = /(?:\.|\#|\$)\w*/g, rtag = (/^\w*/), rpos = /\((?:[\.\#]\w+|\d+)\)/;
					this.len = rlen.exec(this.query) ? parseFloat(rlen.exec(this.query)[0].replace('*','')):1;
					this.el = rmultiple.exec(this.query) ? (rmultiple.exec(this.query)[0].replace(/[\[\]]/g,'')).split(',') : rsingle.exec(this.query)[0].replace(/[\*]/g);
					this.len = Array.isArray(this.el) ? (this.len >= this.el.length ? this.len : this.el.length) : this.len;
					this.pos = rpos.exec(this.query) ? rpos.exec(this.query)[0].replace(/[\(\)]/g,'') : undefined;
					for(var j = 0; j < this.len; j++){
						var el = Array.isArray(this.el) ? this.el[j] : this.el;
						if(el){
							var prop = el.match(rprop) ? el.match(rprop) : null;
							var newEl = document.createElement(rtag.exec(el.replace(/\s+/g,''))[0].toUpperCase());
							if(prop){
								for (var k = 0; k < prop.length; k++) {
									if(prop[k].match(/^\#/) != null){
										newEl.id = prop[k].replace('#','');
									}
									if(prop[k].match(/^\./) != null){
										newEl.className = prop[k].replace('.','');
									}
									if(prop[k].match(/^\$/) != null){
										var newName = document.createAttribute('name');
										newName.value = prop[k].replace('$','');
										newEl.setAttributeNode = newName;
									}
								}
							}
							if(this.pos){
								var insertPos = !isNaN(parseFloat(this.pos)) ? parseFloat(this.pos) : this.pos;
								if(typeof insertPos === 'number'){
									this.parent.insertBefore(newEl,this.parent.childNodes[insertPos]);
								}else{
									this.parent.className = this.parent.className.length > 0 ? this.parent.className + ' grabclass' : this.parent.className = 'grabclass';
									var elPos = document.querySelectorAll('.grabclass>'+this.pos);
									this.parent.insertBefore(newEl,elPos[0]);
									this.parent.className = this.parent.className.replace(/(?:\s|)grabclass/g,'');
								}
							}else{
								this.parent.appendChild(newEl);
							}
							this.els.push(newEl);
						}
					}
				};
				this.init();
				return new _Grab.init.Graber(this.els);
			},
			prop : function(target,preset){
				if(typeof preset === 'string'){
					return target[preset];
				}else{
					for(var i in preset){
						if(preset.hasOwnProperty(i)){
							target[i] = preset[i];
						}
					}
				}
			},
			attr : function(target,preset){
				if(typeof preset === 'string'){
					return target.getAttribute(preset);
				}else{
					for(var i in preset){
						if(preset.hasOwnProperty(i)){
							target.setAttribute(i,preset[i]);
						}
					}
				}
			},
			css : function(target,preset){
				var rfix = /\w\-\w/g;
				if(typeof preset === 'string'){
					var matchcss = target.style[preset] != '' ? target.style[preset] : window.getComputedStyle(target,null)[preset];
					return matchcss;
				}else{
					for(var i in preset){
						if(preset.hasOwnProperty(i)){
							target.style[i] = preset[i];
						}
					}
				}
			},
			text : function(target,intext){
				if(intext){
					target.innerText = intext;
				}else{
					return target.innerText;
				}
			},
			html : function(target,inhtml){
				if(inhtml){
					target.innerHTML = inhtml;
				}else{
					return target.innerHTML;
				}
			},
			on : function(target,event,callback){
				if(target.event === undefined){
					target.event = {};
				}
				if(target.event[event] === undefined){
					target.event[event] = {};
				}
				var fname;
				if(callback.name === "anonymous" || callback.name === ''){
					fname = 'F'+Math.floor(_Grab.math.randomize(999999,9999999999));
				}else{
					fname = callback.name;
				}
				target.event[event][fname] = callback;
				target.addEventListener(event,target.event[event][fname]);
				target.lastEvent = [event,fname];
			},
			off : function(target,event,fname){
				target.removeEventListener(event,target.event[event][fname]);
				try{
					delete target.event[event][fname];
				}catch(err){}
				if(target.lastEvent[1] == fname){
					target.lastEvent = [];
				}
			},
			isReady : function(){
				document.onreadystatechange = function () {
					if (document.readyState === "complete") {
						_Grab.init.handle();
					}
				};
			},
		};
		Grab.lib = Grab.prototype = {
			onsurf : function(callback){
				Grab.init.handle = callback;
			},
			map : function(callback){
				var results = [], i = 0;
				for ( ; i < this.length; i++) {
					results.push(callback.call(this, this[i], i));
				}
				return results;
			},
			toArray : function(){
				var res = this.map(function(elem){
					return elem;
				});
				return res;
			},
			each : function(callback){
				this.map(callback);
				return this;
			},
			add : function(query){
				var newEl;
				newEl = this.map(function(elem){
					res = _Grab.fn.add(query,elem);
					return res;
				});
				return new _Grab.init.Graber(newEl);
			},
			hasClass : function(classname){
				var reclass = new RegExp(classname,"g");
				var res = this.map(function(elem){
					return elem.className.match(reclass) != null ? true : false;
				});
				return res;
			},
			addClass : function(classname){
				this.map(function(elem){
					elem.className =  elem.className.length > 0 ? elem.className+' '+classname: classname;
				});
				return this;
			},
			removeClass : function(classname){
				var patt = '(?:\\s|)';
				patt+=classname;
				var reclass = new RegExp(patt);
				this.map(function(elem){
					elem.className =  elem.className.replace(reclass,'');
				});
				return this;
			},
			remove : function(){
				var res = this.map(function(elem){
					var par = elem.parentElement;
					par.removeChild(elem);
					return par;
				});
				return res[res.length-1];
			},
			prop : function(objprop){
				if(typeof objprop === 'string'){
					res = this.map(function(elem){
						var props = _Grab.fn.prop(elem,objprop);
						return props;
					});
					return res;
				}else{
					this.map(function(elem){
						_Grab.fn.prop(elem,objprop);
					});
					return this;
				}
				
			},
			attr : function(objattr){
				if(typeof objattr === 'string'){
					res = this.map(function(elem){
						var attrs = _Grab.fn.attr(elem,objattr);
						return attrs;
					});
					return res;
				}else{
					this.map(function(elem){
						_Grab.fn.attr(elem,objattr);
					});
					return this;
				}
			},
			css : function(objcss){
				if(typeof objcss === 'string'){
					res = this.map(function(elem){
						var csst = _Grab.fn.css(elem,objcss);
						return csst;
					});
					return res;
				}else{
					this.map(function(elem){
						_Grab.fn.css(elem,objcss);
					});
					return this;
				}
			},
			text : function(intext){
				if(intext){
					this.map(function(elem){
						_Grab.fn.text(elem,intext);
					});
					return this;
				}else{
					res = this.map(function(elem){
						var intext = _Grab.fn.text(elem,null);
						return intext;
					});
					return res;
				}
			},
			html : function(inhtml){
				if(inhtml){
					this.map(function(elem){
						_Grab.fn.html(elem,inhtml);
					});
					return this;
				}else{
					res = this.map(function(elem){
						var inhtml = _Grab.fn.html(elem,null);
						return inhtml;
					});
					return res;
				}
			},
			next : function(num){
				num = num || 1;
				var res = this.map(function(elem){
					var base = elem;
					for (var k = 0; k < num; k++) {
						if(base.nextElementSibling){
							base = base.nextElementSibling;
						}else{
							base = null;
						}
					}
					return base;
				});
				return new _Grab.init.Graber(res);
			},
			prev: function(num){
				num = num || 1;
				var res = this.map(function(elem){
					var base = elem;
					for (var k = 0; k < num; k++) {
						if(base.previousElementSibling){
							base = base.previousElementSibling;
						}else{
							base = null;
						}
					}
					return base;
				});
				return new _Grab.init.Graber(res);
			},
			siblings: function(){
				res = this[0].parentElement.children;
				return new _Grab.init.Graber(res);
			},
			select: function(start,inc,len){
				start = start || 0;
				inc = inc || 1;
				len = len || this.length;
				var j = len > 0 ? 1 : -1, matches = [], res = [];
				for (var i = 0; i < Math.abs(len); i++) {
					if(start >= 0 || start < this.len){
						matches.push(this[start]);
					}
					start += (j*inc);
				}
				for(j in matches){
					if(matches.hasOwnProperty(j)){
						if(j !== 'length'){
							if(matches[j]) res.push(matches[j]);
						}
					}
				}
				return new _Grab.init.Graber(res);
			},
			skip: function(start,inc,len){
				len = len || this.length;
				inc = inc || 1;
				var j = len > 0 ? 1 : -1, matches = [];
				for (var i = 0; i < Math.abs(len); i++) {
					if(start >= 0 || start < this.len){
						delete this[start];
					}
					start += (j*inc);
				}
				for(j in this){
					if(this.hasOwnProperty(j)){
						if(j !== 'length'){
							matches.push(this[j]);
						}
					}
				}
				return new _Grab.init.Graber(matches);
			},
			parent: function(){
				var par = [],i,j,selfpar;
				for (i = 0; i < this.length; i++){
					if(this[i].parentElement.className.match(/grabclass/g) === null){
						selfpar = this[i].parentElement;
						selfpar._Grab().addClass('grabclass'+par.length);
						par.push(selfpar);
					}
				}
				par._Grab().removeClass('grabclass[\\d]+');
				return new _Grab.init.Graber(par);
			},
			child: function(){
				res = [];
				var matches = this.map(function(elem){
					return elem.children;
				});
				for (var i = 0; i < matches.length; i++) {
					for (var j = 0; j < matches[i].length; j++) {
						res.push(matches[i][j]);
					}
				}
				return new _Grab.init.Graber(res);
			},
			on: function(event,callback){
				this.map(function(elem){
					_Grab.fn.on(elem,event,callback);
				});
				return this;
			},
			off: function(event,functionName){
				this.map(function(elem){
					if(!functionName){
						setup = elem.lastEvent;
						_Grab.fn.off(elem,setup[0],setup[1]);
					}else{
						_Grab.fn.off(elem,event,functionName);
					}
				});
				return this;
			},
			bound: function(){
				var boundingRect = this.map(function(elem){
					var res = elem.getBoundingClientRect();
					return res;
				});
				return boundingRect;
			},
			offset : function(){
				var offset = this.map(function(elem){
					var resOffset = {};
					resOffset.left = elem.offsetLeft;
					resOffset.top = elem.offsetTop;
					resOffset.width = elem.offsetWidth;
					resOffset.height = elem.offsetHeight;
					return resOffset;
				});
				return offset;
			},
		};
		Grab.math = Grab.prototype = {
			randomize : function(min,max){
				min = min || 0;
				if(!max){
					max = min != 0 ? 1 : min;
					min = 0;
				}
				return (Math.random() * (max-min)) + min;
			}
		};
		Grab.array = Grab.prototype = {
			sortAsc : function(){
				var newArr;
				if(typeof this[0] === 'string' && isNaN(parseFloat(this[0]))){
					newArr = this.slice(0,this.length);
					return newArr.sort();
				}else{
					newArr = this.slice(0,this.length);
					return newArr.sort(function(argsA, argsB){return parseFloat(argsA) - parseFloat(argsB);});
				}
			},
			sortDsc : function(){
				var newArr;
				if(typeof this[0] === 'string' && isNaN(parseFloat(this[0]))){
					newArr = this.slice(0,this.length);
					newArr.sort();
					return newArr.reverse();
				}else{
					newArr = this.slice(0,this.length);
					return newArr.sort(function(argsA, argsB){return parseFloat(argsB) - parseFloat(argsA);});
				}
			},
			max : function(){
				var newArr = this.sortAsc();
				return Math.max.apply(null, newArr);
			},
			min : function(){
				var newArr = this.sortAsc();
				return Math.min.apply(null, newArr);
			},
			sum : function(){
				var newArr = this.sortAsc();
				return newArr.reduce(function(total,num){
					return total + num;
				});
			},
			near : function(val){
				var absnum = Math.abs(val);
				var newArr = this.sortAsc();
				var nearnum = newArr.reduce(function(res,num){
					var curres = Math.abs(absnum - Math.abs(num));
					return (res = (res[0] < curres ? res : [curres,num]));
				},[Infinity,-1]);
				return nearnum[1];
			},
			far : function(val){
				var absnum = Math.abs(val);
				var newArr = this.sortAsc();
				var nearnum = newArr.reduce(function(res,num){
					var curres = Math.abs(absnum - Math.abs(num));
					return (res = (res[0] > curres ? res : [curres,num]));
				},[0,-1]);
				return nearnum[1];
			}
		};
		Grab.string = Grab.prototype = {
			add : function(post,text){
				return this.substr(0, post) + text + this.substr(post + text.length);
			}
		};
		Grab.number = Grab.prototype = {
			scaler : function(min,max,minscale,maxscale){
				return (((maxscale - minscale)/(max - min))*(parseFloat(this)-min))+minscale;
			},
			fixed : function(dec){
				return parseFloat(this.toFixed(dec));
			},
			rad : function(){
				//degree to radians
				return this * (2*Math.PI) / 360;
			},
			deg : function(){
				//radians to degree.
				return this * 360 / (2*Math.PI);
			}
		};
		Grab.object = Grab.prototype = {
			vw : function(screen){
				//convert px to viewport width
				screen = screen || window.innerWidth;
				num = typeof this === 'string' ? parseFloat(this.replace(/[^\d\.]+/,'')) : this;
				return (num * 100 / screen);
			},
			vh : function(screen){
				//convert px to viewport height
				screen = screen || window.innerHeight;
				num = parseFloat(this.replace(/[^\d\.]+/,''));
				return (num * 100 / screen);
			},
		};
		Grab.locale = Grab.prototype = {
			requestAnimationFrame : window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
			cancelAnimationFrame : window.cancelAnimationFrame || window.mozCancelAnimationFrame,
		};
		Grab.additional = Grab.prototype = {
			Vector : function(x,y){
				this.x = x || 0;
				this.y = y || 0;
				return this;
			},
			Canvas : function(w,h,p){
				this.w = w != undefined ? w : window.innerWidth;
				this.h = h != undefined ? h : window.innerHeight;
				this.p = p != undefined ? p : document.body;
				this.e = undefined;
				this.c = undefined;
				this.create = function(){
					this.e = document.createElement('CANVAS');
					this.e.width = this.w;
					this.e.height = this.h;
					this.c = this.e.getContext('2d');
					if(this.p instanceof _Grab.init.Graber){
						this.p[0].appendChild(this.e);
					}else{
						this.p.appendChild(this.e);
					}
					try{
						_WORLD.origin = new Vector(this.w/2,this.h/2);
					}catch(err){

					}
				};
				this.create();
			},
			Anime : {
				start : function(){
					if(!Anime.running){
						Anime.running = true;
						Anime.timer.last = new Date().getTime();
						Anime.frameset();
					}
				},
				frameset : function(){
					if(Anime.running){
						if(Anime.frameCount % Anime.rollSpeed == 0){
							Anime.timestamp.end = Anime.timestamp.start;
							Anime.timestamp.start = new Date().getTime();
							Anime.timer.now = new Date().getTime();
							Anime.timer.delta = (Anime.timer.now-Anime.timer.last)/1000;
							for(var i in Anime.onrender){
								if(Anime.onrender.hasOwnProperty(i)){
									Anime.engine(Anime.onrender[i]);
								}
							}
							Anime.frameRate();
							Anime.timer.last = new Date().getTime();
						}
						Anime.frameCount++;
						Anime.loop = requestAnimationFrame(Anime.frameset);
					}
				},
				engine : function(callback){
					callback();
				},
				break : function(){
					Anime.running = false;
					cancelAnimationFrame(Anime.loop);
					Anime.frameCount = 0;
					Anime.timestamp = {
						start : undefined,
						end : undefined,
					};
					for(var i in Anime.onbreak){
						if(Anime.onbreak.hasOwnProperty(i)){
							Anime.engine(Anime.onbreak[i]);
						}
					}
				},
				running : false,
				onrender : {},
				onbreak : {},
				loop : undefined,
				FPS : undefined,
				frameCount : 0,
				frameSpeed : 0,
				rollSpeed : 1,
				timestamp : {
					start : 0,
					end : undefined,
				},
				timer : {
					last : 0,
					now : 0,
					delta : 0,
				},
				frameRate : function(){
					if(Anime.timestamp.end){
						Anime.frameSpeed = (Anime.timestamp.start - Anime.timestamp.end);
						Anime.FPS = Math.floor(1000/Anime.frameSpeed);
					}
				},
			},
		};
		//Vector proto object
		Grab.additional.Vector.prototype = {
			set : function(x,y){
				this.x = x;
				this.y = y != undefined ? y : x;
				return this;
			},
			copy : function(other){
				this.x = other.x;
				this.y = other.y;
				return this;
			},
			clone : function(){
				return new Vector(this.x,this.y);
			},
			add : function(other){
				this.x += other.x;
				this.y += other.y;
				return this;
			},
			sub : function(other){
				this.x -= other.x;
				this.y -= other.y;
				return this;
			},
			mult : function(x,y){
				this.x *= x;
				this.y *= y != undefined ? y : x;
				return this;
			},
			div : function(x,y){
				this.x /= x;
				this.y /= y != undefined ? y : x;
				return this;
			},
			dir : function(){
				return Math.atan2(this.y,this.x);
			},
			mag : function(){
				return Math.sqrt(this.magSq());
			},
			magSq : function(){
				return this.dot(this);
			},
			dist : function(other){
				var del = other.clone().sub(this);
				return del.mag();
			},
			dot : function(other){
				return (this.x * other.x)+(this.y * other.y);
			},
			norm : function(){
				return this.mag() === 0 ? this : this.div(this.mag());
			},
			angle : function(other){
				return Math.acos(this.dot(other) / (this.mag() * other.mag()));
			},
			translate : function(other){
				return this.sub(other);
			},
			project : function(other,origin){
				origin = origin || new Vector();
				var PA = this.clone().translate(origin);
				var PB = other.clone().translate(origin);
				var Projectlen = PA.setMag(PB.scalar(PA));
				return(origin.clone().add(Projectlen));
			},
			rotate : function(a){
				var newAng = this.dir() + a;
				var mag = this.mag();
				this.x = mag * Math.cos(newAng);
				this.y = mag * Math.sin(newAng);
				return this;
			},
			heading : function(a){
				var mag = this.mag();
				this.x = mag * Math.cos(a);
				this.y = mag * Math.sin(a);
				return this;
			},
			setMag : function(n){
				return this.norm().mult(n);
			},
			scalar : function(other){
				return this.mag() * Math.cos(other.angle(this));
			},
			limit : function(max){
				var magSq = this.magSq();
				if(magSq > (max*max)){
					this.div(Math.sqrt(magSq));
					this.mult(max);
				}
				return this;
			},
			reverse : function(){
				this.x = -this.x;
				this.y = -this.y;
				return this;
			},
			lerp : function(x,y,amt){
				if(x instanceof Vector){
					return this.lerp(x.x,x.y,y);
				}
				this.x += (x - this.x) * amt || 0;
				this.y += (y - this.y) * amt || 0;
				return this;
			},
		};
		Grab.additional.Canvas.prototype = {
			two_PI: 2*Math.PI,
			css: function(preset){
				for(var key in preset){
					if(preset.hasOwnProperty(key)){
						this.e.style[key] = preset[key];
					}
				}
			},
			save: function(){
				this.c.save();
			},
			restore:function(){
				this.c.restore();
			},
			clear : function(pos){
				if(pos){
					pos.x = pos.x != undefined ? pos.x : 0;
					pos.y = pos.y != undefined ? pos.y : 0;
					pos.w = pos.w != undefined ? pos.w : this.w;
					pos.h = pos.h != undefined ? pos.h : this.h;
					this.c.clearRect(pos.x,pos.y,pos.w,pos.h);
				}else{
					this.c.clearRect(0,0,this.w,this.h);
				}
			},
			scale : function(sw,sh){
				sh = sh != undefined ? sh : sw;
				this.c.scale(sw,sh);
			},
			rotate : function(ang){
				ang = ang.rad();
				this.c.rotate(ang);
			},
			translate : function(tx,ty){
				tx = tx != undefined ? tx : this.w/2;
				ty = ty != undefined ? ty : this.h/2;
				this.c.translate(tx,ty);
			},
			begin : function(){
				this.c.beginPath();
			},
			close : function(){
				this.c.closePath();
			},
			//costum preset.
			colorMode : 'RGB',
			initColor : function(cols,type){
				if(cols.length > 0){
					if(typeof cols[0] === 'string'){
						return cols[0];
					}else{
						cols[1] = cols[1] != undefined ? cols[1] : cols[0];
						cols[2] = cols[2] != undefined ? cols[2] : cols[1];
						cols[3] = cols[3] != undefined ? cols[3] : 1;
						if(this.colorMode === 'RGB'){
							return ('rgba(' + cols[0] + ',' + cols[1] + ',' + cols[2] + ',' + cols[3] + ')');
						}else{
							return ('hsla(' + cols[0] + ',' + cols[1] + '%,' + cols[2] + '%,' + cols[3] + ')');
						}
					}
				}
				if(type === 0){
					return this.c.fillStyle;
				}else{
					return this.c.strokeStyle;
				}
			},
			fillBg : function(c0,c1,c2,c3){
				var args = [];
				if(c0 && Array.isArray(c0)){
					args = c0;
				}else{
					for (i = 0; i < arguments.length; i++) {
						args.push(arguments[i]);
					}
				}
				var matchCol = this.initColor(args,0);
				this.c.fillStyle = matchCol;
				this.c.fillRect(0,0,this.w,this.h);
			},
			fill : function(c0,c1,c2,c3){
				var args = [];
				if(c0 && Array.isArray(c0)){
					args = c0;
				}else{
					for (i = 0; i < arguments.length; i++) {
						args.push(arguments[i]);
					}
				}
				var matchCol = this.initColor(args,0);
				this.c.fillStyle = matchCol;
				this.c.fill();
			},
			stroke : function(c0,c1,c2,c3){
				var args = [];
				if(c0 && Array.isArray(c0)){
					args = c0;
				}else{
					for (i = 0; i < arguments.length; i++) {
						args.push(arguments[i]);
					}
				}
				var matchCol = this.initColor(args,1);
				this.c.strokeStyle = matchCol;
				this.c.stroke();
			},
			fillStyle : function(c0,c1,c2,c3){
				var args = [];
				if(c0 && Array.isArray(c0)){
					args = c0;
				}else{
					for (i = 0; i < arguments.length; i++) {
						args.push(arguments[i]);
					}
				}
				var matchCol = this.initColor(args,0);
				this.c.fillStyle = matchCol;
			},
			strokeStyle : function(c0,c1,c2,c3){
				var args = [];
				if(c0 && Array.isArray(c0)){
					args = c0;
				}else{
					for (i = 0; i < arguments.length; i++) {
						args.push(arguments[i]);
					}
				}
				var matchCol = this.initColor(args,1);
				this.c.strokeStyle = matchCol;
				this.c.stroke();
			},
			shadow : function(xoff,yoff,sb,sc){
				this.c.shadowOffsetX = xoff != undefined ? xoff : this.c.shadowOffsetX;
				this.c.shadowOffsetY = yoff != undefined ? yoff : this.c.shadowOffsetY;
				this.c.shadowBlur = sb != undefined ? sb : this.c.shadowBlur;
				this.c.shadowColor = sc != undefined ? sc : this.c.shadowColor;
			},
			lineStyle : function(lw,lc,lj){
				this.c.lineWidth = lw != undefined ? lw : this.c.lineWidth;
				this.c.lineCap = lc != undefined ? lc : this.c.lineCap;
				this.c.lineJoin = lj != undefined ? lj : this.c.lineJoin;
			},
			//costum shape
			line : function(vecA,vecB){
				this.begin();
				this.c.moveTo(vecA.x,vecA.y);
				this.c.lineTo(vecB.x,vecB.y);
				this.close();
			},
			arc : function(cp,r,sa,ea,sh){
				sh = sh != undefined ? sh : 'chord'; //'pie'
				var rs = sa * (2*Math.PI) || 0;
				var re = ea * (2*Math.PI) || 2*Math.PI;
				this.begin();
				if(sh == 'pie'){
					this.c.moveTo(cp.x,cp.y);
				}
				this.c.arc(cp.x,cp.y,r,rs,re);
				this.close();
			},
			rect : function(sp,w,h){
				this.begin();
				h = h != undefined ? h : w;
				this.c.rect(sp.x,sp.y,w,h);
				this.close();
			},
			ellipse : function(sp,rs,ag,sa,ea,sh){
				sh = sh != undefined ? sh : 'chord';  //'pie'
				rs.y = rs.y != undefined ? rs.y : rs.x;
				ag = ag.rad();
				var sta = sa * (2*Math.PI) || 0;
				var eda = ea * (2*Math.PI) || 2*Math.PI;
				this.begin();
				if(sh == 'pie'){
					this.c.moveTo(sp.x,sp.y);
				}
				this.c.ellipse(sp.x, sp.y, rs.x, rs.y, ag, sta, eda);
				this.close();
			},
			polygon : function(cx,cy,r,s){
				s = s != undefined && s > 2 ? s : 3;
				var angAcc = this.two_PI/s;
				var angVel = 0;
				var vertex = [];
				for(var i = 0; i < s; i ++){
					var vec = {x:0,y:0};
					vec.x = cx + (r * Math.cos(angVel));
					vec.y = cy + (r * Math.sin(angVel));
					vertex.push(vec);
					angVel += angAcc;
				}
				this.path(vertex);
			},
			path : function(vertex,mode){
				mode = mode || 'close';
				var i;
				if(mode === 'close'){
					this.begin();
					this.c.moveTo(vertex[0].x,vertex[0].y);
					for(i = 0; i < vertex.length; i++){
						this.c.lineTo(vertex[(i+1)%vertex.length].x,vertex[(i+1)%vertex.length].y);
					}
					this.close();
				}
				if(mode === 'open'){
					this.begin();
					this.c.moveTo(vertex[0].x,vertex[0].y);
					for(i = 1; i < vertex.length; i++){
						this.c.lineTo(vertex[i].x,vertex[i].y);
					}
					for(i = vertex.length-2; i >= 0; i--){
						this.c.lineTo(vertex[i].x,vertex[i].y);
					}
					this.close();
				}
			},
			plane : function(vec,theta){
				var ang = Math.atan2(theta.y,theta.x);
				var plane = [{x:6,y:0},{x:-6,y:4},{x:-4,y:0},{x:-6,y:-4}];
				this.translate(vec.x,vec.y);
				this.c.rotate(ang);
				this.path(plane);
			},
			fillText : function(text,pos,option){
				if(option){
					for(var key in option){
						if(option.hasOwnProperty(key)){
							this.c[key] = option[key];
						}
					}
				}
				this.c.fillText(text,pos.x,pos.y);
			},
			strokeText : function(text,pos,option){
				if(option){
					for(var key in option){
						if(option.hasOwnProperty(key)){
							this.c[key] = option[key];
						}
					}
				}
				this.c.strokeText(text,pos.x,pos.y);
			}
		};
		Grab.init.Graber.prototype = Grab.lib;
	}());
	//define lib.
	//Array
	var i;
	for(i in Grab.array){
		if(Grab.array.hasOwnProperty(i)){
			Array.prototype[i] = Grab.array[i];
		}
	}
	//String
	for(i in Grab.string){
		if(Grab.string.hasOwnProperty(i)){
			String.prototype[i] = Grab.string[i];
		}
	}
	//Number
	for(i in Grab.number){
		if(Grab.number.hasOwnProperty(i)){
			Number.prototype[i] = Grab.number[i];
		}
	}
	//Object
	for(i in Grab.object){
		if(Grab.object.hasOwnProperty(i)){
			Object.prototype[i] = Grab.object[i];
		}
	}
	//Browser Support
	for(i in Grab.locale){
		if(Grab.locale.hasOwnProperty(i)){
			this[i] = Grab.locale[i];
		}
	}
	Object.prototype._Grab = Grab;
	this._Grab = Grab;
	this.randomize = Grab.math.randomize;
	//Vector
	this.Vector = Grab.additional.Vector;
	//Canvas
	this.Canvas = Grab.additional.Canvas;
	//Animator
	this.Anime = Grab.additional.Anime;
	_Grab.fn.isReady();
};
_GRAB_INSTALL();