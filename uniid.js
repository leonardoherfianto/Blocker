var _Uni_Id = function(el){
	var find = true, res = [], idx, elm = el;
	while(find){
		if(elm.prop('tagName')[0] === 'BODY' || elm.prop('tagName')[0] === 'HTML'){
			res.push(elm.prop('tagName')[0].toUpperCase());
			find = false;
		}else if(elm.prop('id')[0] !== ''){
			res.push('#'+elm.prop('id')[0]);
			find = false;
		}else if(elm.prop('className')[0] !== ''){
			idx = getIndexClass(elm);
			res.push('.'+elm.prop('className')[0].split(' ')[0] + '[' + idx + ']');
			find = false;
		}else{
			idx = getIndexTag(elm,elm.parent());
			res.push(elm.prop('tagName')[0].toUpperCase() + '[' + idx + ']');
			elm = elm.parent();
		}
	}
	if(res.length === 1){
		return res[0];
	}else{
		resquery = '';
		for (var i = res.length-1; i >= 0; i--) {
			resquery += res[i];
			if(i > 0){
				resquery += '>';
			}
		}
		return resquery;
	}
};
var getIndexClass = function(el){
	el.prop({
		'uniClass' : 'unifind'
	});
	var matchClass = _Grab('.'+el.prop('className')[0].split(' ')[0]);
	var resClass = matchClass.map(function(elm,index){
		if(elm.uniClass !== undefined){
			return index;
		}
	});
	delete el[0].uniClass;
	var residx;
	for (var i = 0; i < resClass.length; i++) {
		if(resClass[i] !== undefined){
			residx = resClass[i];
		}
	}
	return residx;
};
var getIndexTag = function(el,parent){
	parent = parent || _Grab();
	el.prop({
		'uniTag' : 'unifind'
	});
	var matchTags = parent._Grab(el.prop('tagName')[0].toUpperCase());
	var resTags = matchTags.map(function(elm,index){
		if(elm.uniTag !== undefined){
			return index;
		}
	});
	delete el[0].uniTag;
	var residx;
	for (var i = 0; i < resTags.length; i++) {
		if(resTags[i] !== undefined){
			residx = resTags[i];
		}
	}
	return residx;
};
