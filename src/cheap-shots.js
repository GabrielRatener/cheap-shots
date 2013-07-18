var CheapShots = (function(){
	var PLAY = false;
	var I = -1;
	var INTERVAL = 5;	// in seconds
	
	var ORDER = "ordered";
	
	var IMAGE = new Image();
	var IMAGES = {
		ordered: [],
		random: []
	};
	
	var STATE = {
		transit: false,
		loading: false
	};
	
	var CONTEXTS = [];
	var ELEMENT;

	var TILES;
	var TIMEOUT;
	var DOM = {};

	var PATH = (function(){
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {Ï
			var path = scripts[i].getAttribute("src").split("/");
			if(path[path.length - 1] == "cheap-shots.js" ||
				path[path.length - 1] == "cheap-shots.min.js"){

				return path.pop().join("/") + "/";
			}
		}

		return false;
	}());

	var CONTROLLER = (function(){	// includes state views
		/*
		This object deals with all controlls of the gallery be it and updating the controllers' views to
		reflect changes in the galler state. The image loader is also included even though it is not a control.
		*/	
		var CONTROLLER_DOM = {};
		
		var NEXT = {};
		var PREV = {};
		
		var SHUFFLE = {};
		var PLAY = {};
		
		var LOADER = {};
			
		this.drawPlay = function(boo){
			var c = PLAY.context;
			var h = PLAY.height, w = PLAY.width;

			c.clearRect(0, 0, w, h);
			c.fillStyle = "#00aa00";
			
			if(boo){	
				c.beginPath();
				c.moveTo(w/5, h/5);
				c.lineTo(4*w/5, h/2);
				c.lineTo(w/5, 4*h/5);
				c.closePath();
				c.fill();
			}else{
				c.fillRect(w/5, h/5, w/5, 3*h/5);
				c.fillRect(3*w/5, h/5, w/5, 3*h/5);
			}
			
			return true;
		}
		
		this.drawShuffle = function(boo){
			var c = SHUFFLE.context;
			var w = SHUFFLE.width, h = SHUFFLE.height;

			c.clearRect(0, 0, w, h);
			c.lineWidth = 5;
			c.strokeStyle = "#00aa00";
			
			if(boo){
				c.beginPath();
				c.moveTo(w/5, 2*h/5);
				c.lineTo(2*w/5, 2*h/5);
				c.lineTo(3*w/5, 3*h/5);
				c.lineTo(4*w/5, 3*h/5);
				c.stroke();
				
				c.beginPath();
				c.moveTo(w/5, 3*h/5);
				c.lineTo(2*w/5, 3*h/5);
				c.lineTo(3*w/5, 2*h/5);
				c.lineTo(4*w/5, 2*h/5);
				c.stroke();
			}else{
				c.beginPath();
				c.moveTo(w/5, 2*h/5);
				c.lineTo(4*w/5, 2*h/5);
				c.stroke();
					
				c.beginPath();
				c.moveTo(w/5, 3*h/5);
				c.lineTo(4*w/5, 3*h/5);
				c.stroke();
			}
		}
		
		this.set = function(boot){
			boot.append("controller", "div").giveClass("controlls");
			var loader = boot.controller.append("loader","div");
			
			boot.controller.append("buttons", "ul");
			
			var play = boot.controller.buttons.append("play", "li");
			var shuffle = boot.controller.buttons.append("shuffle", "li");
			
			var prev = boot.controller.append("prev", "div");
			var next = boot.controller.append("next", "div");
			
			boot.controller.loader.giveClass("gallery_loader");
			boot.controller.prev.giveClass("gallery_prev");
			boot.controller.next.giveClass("gallery_next");
			
			this.setLoader(loader);
			this.setPlay(play);
			this.setShuffle(shuffle);
			this.setPrev(prev);
			this.setNext(next);
			
			CONTROLLER_DOM.root = boot.controller;
			return true;
		}
		
		this.setLoader = function(e){
			LOADER.sonic = new Sonic({
				 width: 100,
				 height: 100,
				 fillColor: '#55bbbb',
				 path: [
					  ['line', 10, 10, 90, 10],
					  ['line', 90, 10, 90, 90],
					  ['line', 90, 90, 10, 90],
					  ['line', 10, 90, 10, 10]
				 ]
			});
			
			LOADER.element = e.get();
			
			return true;
		}
		
		this.drawLoader = function(boo){
			var bool = STATE.loading;
			if(boo && !bool){
				STATE.loading = true;
				var s = LOADER.sonic;
				LOADER.element.appendChild(s.canvas);
				s.play();
			}else if(bool && !boo){
				STATE.loading = false;
				var s = LOADER.sonic;
				s.stop();
				LOADER.element.removeChild(s.canvas);
			}else return false;
			
			return true;
		}
			
		this.setPlay = function(e){
			var canvas = e.append("canvas").get();
			canvas.setAttribute("width", canvas.clientWidth);
			canvas.setAttribute("height", canvas.clientHeight);
		
			canvas.onclick = function(){
				var bool = CheapShots.isPlaying();
				
				if(bool) pause();
				else play();
			}

			PLAY.context = canvas.getContext("2d");
			PLAY.width = canvas.clientWidth;
			PLAY.height = canvas.clientHeight;
			
			drawPlay(isPlaying());
		}
		
		this.setShuffle = function(e){
			var canvas = e.append("canvas").get();
			canvas.setAttribute("width", canvas.clientWidth);
			canvas.setAttribute("height", canvas.clientHeight);
			
			canvas.onclick = function(){
				var bool = CheapShots.isRandom();
				
				if(bool) order();
				else randomize();
			}
			

			SHUFFLE.context = canvas.getContext("2d");
			SHUFFLE.width = canvas.clientWidth;
			SHUFFLE.height = canvas.clientHeight;
			
			drawShuffle(isRandom());
		}
		
		this.setNext = function(e){
			var canvas = e.append("canvas").get();
			canvas.setAttribute("width", canvas.clientWidth);
			canvas.setAttribute("height", canvas.clientHeight);
			
			canvas.onclick = function(){
				CheapShots.next();	
			}
			
			var w = NEXT.width = canvas.clientWidth;
			var h = NEXT.height = canvas.clientHeight;
			var c = NEXT.context = canvas.getContext("2d");
				
			c.lineWidth = "10";
			c.strokeStyle = "#4444ff";
			
			c.beginPath();
			c.moveTo(w/5, h/5);
			c.lineTo(4*w/5, h/2);
			c.lineTo(w/5, 4*h/5);
			c.stroke();
		}
		
		this.setPrev = function(e){
			var canvas = e.append("canvas").get();
			canvas.setAttribute("width", canvas.clientWidth);
			canvas.setAttribute("height", canvas.clientHeight);
			
			canvas.onclick = function(){
				CheapShots.prev();	
			}
			
			var w = PREV.width = canvas.clientWidth;
			var h = PREV.height = canvas.clientHeight;
			var c = PREV.context = canvas.getContext("2d");
				
			c.lineWidth = "10";
			c.strokeStyle = "#4444ff";
			
			c.beginPath();
			c.moveTo(4*w/5, h/5);
			c.lineTo(w/5, h/2);
			c.lineTo(4*w/5, 4*h/5);
			c.stroke();
		}
			
		return this;
	}());
	
	function uniqueID(n){
		do{
			var id = "gallery_";
			for (var i = 0; i < n; i++) {
				id += Math.floor(10 * Math.random());
			};
		}while(document.getElementById(id));

		return id
	}

	function shuffle(input){
		var array = input.slice(0);
		var l = array.length;
		var newImages = [];
		
		for(var i = 0; i < l; i++){
			var item = array.splice(Math.floor(array.length * Math.random()), 1)
			newImages.push(item[0]);
		}
		
		return newImages;
	}
	
	function resetDimentions(){
		var c = ELEMENT.get().getElementsByTagName("canvas");

		c[0].setAttribute("width", c[0].offsetWidth);
		c[0].setAttribute("height", c[0].offsetHeight);
		CONTEXTS[c[0].context] = c[0].getContext("2d");
		
		c[1].setAttribute("width", c[1].offsetWidth);
		c[1].setAttribute("height", c[1].offsetHeight);
		CONTEXTS[c[1].context] = c[1].getContext("2d");
		
		var dims = {width: c[1].width, height: c[1].height};
		
		var slices = {down: 20, right: 30};
		var rectas = [];
		for(var i = 0; i < slices.right; i++){
			for(var j = 0; j < slices.down; j++){
				var arey = [];
				
				arey[0] = Math.floor(i * dims.width / slices.right);	// x
				arey[1] = Math.floor(j * dims.height / slices.down);	// y
				
				//arey[2] = Math.ceil(1 + dims.width / slices.right);		// width
				//arey[3] = Math.ceil(1 + dims.height / slices.down);		// height
				
				rectas.push(arey.join(" "));
			}
		}
		
		var random = [];
		var l = rectas.length;
		for(var i = 0; i < l; i++){
			var index = Math.floor(rectas.length * Math.random());	
			random.push(rectas.splice(index, 1)[0]);
		}
		
		TILES = {
			width: Math.ceil(1 + dims.width / slices.right),
			height: Math.ceil(1 + dims.height / slices.down),
			coordinates: random
		};
		
		return true;
	}
		
	function displayImageByIndex(index, callback, parameters){
		var place = Math.min(IMAGES.ordered.length, Math.max(0, index));
		
		var c = ELEMENT.get().getElementsByTagName("canvas");

		var c1 = c[0];
		var c2 = c[1];
		
		IMAGE.onload = function(){
			CONTROLLER.drawLoader(false);
			
			var ca = CONTEXTS[c1.getAttribute("context")], cb = CONTEXTS[c2.getAttribute("context")];
			var x = Math.round((c1.offsetWidth - IMAGE.width) / 2);
			
			ca.fillStyle = "#000000";
			ca.fillRect(0, 0, c1.offsetWidth, c1.offsetHeight);
			
			ca.drawImage(IMAGE, x, 0);
			
			var i = 0, speed = 10;
			STATE.transit = true;
			var transition = window.setInterval(function(){
				if(i < TILES.coordinates.length){
					var end = Math.min(TILES.coordinates.length, i + speed);
					
					while(i < end){
						var coords = TILES.coordinates[i++].split(" ");
						cb.clearRect(coords[0], coords[1], TILES.width, TILES.height);
					}
					
				}else{
					clearInterval(transition);
					I = place;
					ELEMENT.get().appendChild(c1);
					STATE.transit = false;
					callback(parameters);	
				}
				
			}, 10);
		}
		
		CONTROLLER.drawLoader(true);
		IMAGE.src = "cgi-bin/image.py?a=true&dir=costarica&height=" + c1.offsetHeight + "&image=" + IMAGES[ORDER][place];
		
		return true;
	}
	
	function playNext(wait){
		TIMEOUT = window.setTimeout(function(){
			if(I >= IMAGES.ordered.length){
				I = 0;
				if(PLAY) displayImageByIndex(0, playNext, 5000);
			}else{
				if(PLAY) displayImageByIndex(++I, playNext, 5000);
			}
		}, wait);
		
		return true;
	}
	
	function set(boot){
		ELEMENT = boot.append("viewer","div").giveClass("arkanvas");
		for(var i = 0; i < 2; i++){
			var c = ELEMENT.append("canvas").giveClass("arkanvas").get();
			CONTEXTS.push(c.getContext("2d"));
			c.setAttribute("context", i);
		}
		
		window.onresize = function(){
			resetDimentions();	
		}
		
		return resetDimentions();
	}

	this.isPlaying = function(){
		return PLAY;
	}
	
	this.isRandom = function(){
		return (ORDER == "random");
	}
	
	this.play = function(){
		if(PLAY) return false;
		
		PLAY = true;
		CONTROLLER.drawPlay(true);
		
		return playNext(0);
	}
	
	this.pause = function(){
		window.clearTimeout(TIMEOUT);
		
		if(!PLAY) return false;
		
		PLAY = false;
		CONTROLLER.drawPlay(false);
		
		return true;
	}
	
	this.addImages = function(imgs){
		IMAGES.ordered = IMAGES.ordered.concat(imgs);
		IMAGES.random = shuffle(IMAGES.ordered);
		return true;
	}
	
	this.setImages = function(imgs){
		IMAGES.ordered = imgs;
		IMAGES.random = shuffle(IMAGES.ordered);
		return true;
	}
	
	this.prev = function(){
		pause();
		
		if(STATE.transit) return false;
		
		if(I <= 0) displayImageByIndex(IMAGES.ordered.length, function(){}, 0);
		else displayImageByIndex(I - 1, function(){}, 0);
		
		return true;
	}
	
	this.next = function(){
		pause();
		
		if(STATE.transit) return false;
		
		if(I >= IMAGES.ordered.length) displayImageByIndex(0, function(){}, 0);
		else displayImageByIndex(I + 1, function(){}, 0);
		
		return true;
	}
	
	this.order = function(){
		if(ORDER == "ordered") return false;
		
		I = IMAGES.ordered.indexOf(IMAGES[ORDER][I]);
		ORDER = "ordered";
		CONTROLLER.drawShuffle(false);
		
		return true;
	}
	
	this.randomize = function(){
		if (ORDER == "random") return false;
		
		ORDER = "random";
		IMAGES.random = shuffle(IMAGES.random);
		CONTROLLER.drawShuffle(true);
		
		return true;
	}
	
	this.select = function(i){
		pause();	
		
		if(STATE.transit) return false;
		
		displayImageByIndex(i, function(){}, 0);
	}
		
	this.element = function(element){
		var head = document.getElementsByTagName('head')[0];

		var styleId = uniqueID(10);
		var link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', PATH + 'styles/CSS.php?id=' + styleId);
		link.onload = function(){
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", PATH + "dependencies/Element.js");
			script.onload = function(){
				var root = new Element("div");
				var oot = root.giveClass("arkanvas").get();
				oot.setAttribute("id", styleId);
				element.appendChild(oot);
				
				set(root);					
				CONTROLLER.set(root);
				
				DOM.root = root;
				DOM.container = element;
			}
			
			head.appendChild(script);
		}

		head.appendChild(link);

		return true;
	}
	
	this.test = function(){
		prompt("Works!");	
	}
	
	this.Controller = (function(){
		this.setPrev = CONTROLLER.setPrev;
		this.setNext = CONTROLLER.setNext;
		this.setShuffle = CONTROLLER.setShuffle;						
		this.setPlay = CONTROLLER.setPlay;
		
		return this;
	}());
	
	return this;
}());
