var Element = (function(){
	function Element(elem){
		var eleme = document.createElement(elem);
		var myobj = {}, binder;

		this.obj = function(){
			return myobj;
		}

		this.get = function(){
			return eleme;
		}

		this.bind = function(obje, override){
			if(!binder || override){
				binder = obje;
				return true;
			}

			return false;
		}
	}

	Element.prototype.take = function(name, i){
		var parent = this.get();
		if(arguments.length > 1 || this[name].length == 1){
			var el = this[name].splice(i, 1);
			var child = el[0].get();
			parent.removeChild(child);
		}else{
			var child = this[name].get();
			parent.removeChild(child);
			delete this[name];
		}

		return this;
	}

	Element.prototype.append = function(name, el, truth){
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
			var r = new Element(el);
			this[name] = (truth) ? [r] : r;
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

	Element.prototype.attributes = function(){
		var el = this.get();

		if(arguments.length){
			var obj = arguments[0];

			for (var k in obj) {
				el.setAttribute(k, obj[k]);
			}

			return this;
		}else{
			var obj = {}
			for(var i = 0; i < el.attributes.length; i++){
				obj[el.attributes[i].name] = el.attributes[i].value;
			}

			return obj;
		}
	}

	Element.prototype.text = function(str){
		var el = this.get();
		var tn = document.createTextNode(str);

		el.appendChild(tn);
	}

	this.new = function(type){
		return new Element(type);
	}

	return this;
}());