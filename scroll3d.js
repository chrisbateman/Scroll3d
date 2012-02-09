/* Modernizr 2.5.2 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-csstransforms3d-canvas-canvastext-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a)if(i[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.substr(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.5.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),k.appendChild(j);return h=["&#173;","<style>",a,"</style>"].join(""),k.id=g,m.innerHTML+=h,m.appendChild(k),l||f.appendChild(m),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e});var F=function(a,c){var d=a.join(""),f=c.length;v(d,function(a,c){var d=b.styleSheets[b.styleSheets.length-1],g=d?d.cssRules&&d.cssRules[0]?d.cssRules[0].cssText:d.cssText||"":"",h=a.childNodes,i={};while(f--)i[h[f].id]=h[f];e.csstransforms3d=(i.csstransforms3d&&i.csstransforms3d.offsetLeft)===9&&i.csstransforms3d.offsetHeight===3},f,c)}([,["@media (",l.join("transform-3d),("),g,")","{#csstransforms3d{left:9px;position:absolute;height:3px;}}"].join("")],[,"csstransforms3d"]);p.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},p.canvastext=function(){return!!e.canvas&&!!A(b.createElement("canvas").getContext("2d").fillText,"function")},p.csstransforms3d=function(){var a=!!E("perspective");return a&&"webkitPerspective"in f.style&&(a=e.csstransforms3d),a};for(var G in p)x(p,G)&&(u=G.toLowerCase(),e[u]=p[G](),s.push((e[u]?"":"no-")+u));return y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},e}(this,this.document);


var Scroll3d = function(config) {
	var self = this;
	
	var _prefixes = ['webkit', 'Moz', 'O', 'ms'];
	var _perspective = 1000;
	var _depth = 50;
	var _parentContainer;
	var _targetElements;
	var _windowCenterOffset;
	var _parentHeight;
	
	
	
	
	
	
	var _init = function() {
		if (!Modernizr.csstransforms3d) return;
		
		_parentContainer = document.querySelector(config.parentContainer);
		_targetElements = _parentContainer.querySelectorAll(config.targetElements);
		if (typeof config.perspective != 'undefined') _perspective = config.perspective;
		if (typeof config.depth != 'undefined') _depth = config.depth;
		
		_initParentContainer();
		_initScrolling();
		
		for (var i=0; i<_targetElements.length; i++) {
			_addSides(_targetElements[i]);
		}
	};
	
	
	
	
	var _addSides = function(element) {
		element.style.position = 'relative';
		
		var height = element.offsetHeight;
		
		var hexValues = window.getComputedStyle(element).backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
		var rgbColor = [parseInt(hexValues[1]), parseInt(hexValues[2]), parseInt(hexValues[3])];
		var hslColor = rgbToHsv(rgbColor[0], rgbColor[1], rgbColor[2]);
		
		element.appendChild(_getTopSide(height, hslColor));
		element.appendChild(_getBottomSide(height, hslColor));
		element.appendChild(_getLeftSide(height, hslColor));
		element.appendChild(_getRightSide(height, hslColor));
	};
	
	
	var _getSideBase = function(height) {
		var div = document.createElement('div');
		div.style.position = 'absolute';
		
		return div;
	};
	
	var _getSide = function(config) {
		var div = document.createElement('div');
		div.style.position = 'absolute';
		
		div.style.width = config.width;
		div.style.height = config.height;
		if (config.left != 'undefined') div.style.left= config.left;
		if (config.right != 'undefined') div.style.right = config.right;
		if (config.top != 'undefined') div.style.top = config.top;
		if (config.bottom != 'undefined') div.style.bottom = config.bottom;
		
		div.style[Modernizr.prefixed('transform')] = config.transform;
		div.style[Modernizr.prefixed('transform-origin')] = config.transformOrigin;
		div.style.backgroundColor = config.backgroundColor;
		
		return div;
	};
	
	
	var _getTopSide = function(height, hslColor) {
		var div = _getSide({
			width: '100%',
			height: _depth + 'px',
			top: (-_depth) + 'px',
			transform: 'rotateX(90deg)',
			transformOrigin: '50% 100%',
			backgroundColor: _lightenColor(hslColor, 0.1)
		});
		
		return div;
	};
	
	var _getBottomSide = function(height, hslColor) {
		var div = _getSide({
			width: '100%',
			height: _depth + 'px',
			bottom: (-_depth) + 'px',
			transform: 'rotateX(-90deg)',
			transformOrigin: '50% 0%',
			backgroundColor: _lightenColor(hslColor, -0.05)
		});
		
		return div;
	};
	
	var _getLeftSide = function(height, hslColor) {
		var div = _getSide({
			width: _depth + 'px',
			height: '100%',
			left: '0px',
			transform: 'rotateY(90deg)',
			transformOrigin: '0% 50%',
			backgroundColor: _lightenColor(hslColor, 0.05)
		});
		
		return div;
	};
	
	var _getRightSide = function(height, hslColor) {
		var div = _getSide({
			width: _depth + 'px',
			height: '100%',
			right: '0px',
			transform: 'rotateY(-90deg)',
			transformOrigin: '100% 50%',
			backgroundColor: _lightenColor(hslColor, 0.05)
		});
		
		return div;
	};
	
	
	var _lightenColor = function (hslColor, amount) {
		var hslColor = hslColor.slice(0);
		
		hslColor[1] = hslColor[1] - amount;
		hslColor[2] = hslColor[2] + amount;
		
		var rgbColor = hsvToRgb(hslColor[0], hslColor[1], hslColor[2]);
		
		rgbColor[0] = Math.round(rgbColor[0]);
		rgbColor[1] = Math.round(rgbColor[1]);
		rgbColor[2] = Math.round(rgbColor[2]);
		
		return rgbString = '#' + rgbColor[0].toString(16) + rgbColor[1].toString(16) + rgbColor[2].toString(16);
	};
	
	
	
	var _initParentContainer = function() {
		_parentContainer.style[Modernizr.prefixed('perspective')] = _perspective + 'px';
		_parentContainer.style[Modernizr.prefixed('transformStyle')] = 'preserve-3d';
	};
	
	
	var _initScrolling = function() {
		
		_parentHeight = _parentContainer.offsetHeight;
		
		_setCenterScrollPosition();
		_setPerspective();
		
		window.addEventListener('resize', function() {
			_setCenterScrollPosition();
			_setPerspective();
		});
		window.addEventListener('orientationchange', function() {
			_setCenterScrollPosition();
			_setPerspective();
		});
		
		window.addEventListener('scroll',  function() {
			_setPerspective();
		});
	};
	
	
	
	var _setCenterScrollPosition = function() {
		_windowCenterOffset = (window.innerHeight / 2);
	};
	
	var _setPerspective = function() {
		_parentContainer.style[Modernizr.prefixed('perspectiveOrigin')] = '50% ' + (window.scrollY + _windowCenterOffset - _parentContainer.offsetTop) / _parentHeight * 100 + '%';
	};
	
	
	
	
	
	/**
	 * @see http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	 * @param	{Number}  r	The red color value
	 * @param	{Number}  g	The green color value
	 * @param	{Number}  b	The blue color value
	 * @return		{Array}      	The HSV representation
	 */
	var rgbToHsv = function(r, g, b){
		r = r/255, g = g/255, b = b/255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;

		var d = max - min;
		s = max == 0 ? 0 : d / max;

		if(max == min){
			h = 0; // achromatic
		}else{
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h, s, v];
	}

	/**
	 * @see http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	 * @param	{Number}  h	The hue
	 * @param	{Number}  s	The saturation
	 * @param	{Number}  v	The value
	 * @return		{Array}			The RGB representation
	 */
	var hsvToRgb = function(h, s, v){
		var r, g, b;

		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);

		switch(i % 6){
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}

		return [r * 255, g * 255, b * 255];
	}
	
	
	
	_init();
	
};
