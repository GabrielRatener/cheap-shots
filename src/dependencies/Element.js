function Element(elem){
	var eleme = document.createElement(elem);
	var myobj = {};

	this.obj = function(){
		return myobj;
	}

	this.get = function(){
		return eleme;
	}
}

Element.prototype.append = function(name, el){
	if (arguments.length < 2) var el = name;
	
	if(this[name]){
		if(this[name] instanceof Array){
			var r = this[name][this[name].length] = new Element(el);
		}else{
			var temp = [];
			temp[0] = this[name];
			var r = temp[1] = new Element(el);
			this[name] = temp;
		}	
	}else{
		var r = this[name] = new Element(el);
	}
	
	this.get().appendChild(r.get());
	return r;
}

Element.prototype.getClasses = function(){
	return this.get().getAttribute("class").split(" ");
}

Element.prototype.giveClass = function(){
	var elem = this.get();
	var clas = elem.getAttribute("class") || "";
	var arey = clas.split(" ");
	
	var i = 0, add;
	while(add = arguments[i++]){
		if(arey.indexOf(add) < 0) arey.push(add);
	}
	
	elem.setAttribute("class", arey.join(" "));
	return this;
}			

Element.prototype.takeClass = function(){
	var elem = this.get();
	var clas = elem.getAttribute("class") || "";
	var arey = clas.split(" ");

	var i = 0, take;
	while(take = arguments[i++]){
		var index = arey.indexOf(take);
		if(index >= 0) arey.splice(index, 1);
	}
	
	elem.setAttribute("class", arey.join(" "));
	return this;
}