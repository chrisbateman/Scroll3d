
/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-csstransforms3d-canvas-addtest-teststyles-testprop-prefixes
 */
;window.Modernizr=function(a,b,c){function z(a,b){for(var d in a)if(j[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function y(a,b){return!!~(""+a).indexOf(b)}function x(a,b){return typeof a===b}function w(a,b){return v(m.join(a+";")+(b||""))}function v(a){j.cssText=a}var d="2.0.6",e={},f=b.documentElement,g=b.head||b.getElementsByTagName("head")[0],h="modernizr",i=b.createElement(h),j=i.style,k,l=Object.prototype.toString,m=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),n={},o={},p={},q=[],r=function(a,c,d,e){var g,i,j,k=b.createElement("div");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),k.appendChild(j);g=["&shy;","<style>",a,"</style>"].join(""),k.id=h,k.innerHTML+=g,f.appendChild(k),i=c(k,a),k.parentNode.removeChild(k);return!!i},s,t={}.hasOwnProperty,u;!x(t,c)&&!x(t.call,c)?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],c)};var A=function(a,c){var d=a.join(""),f=c.length;r(d,function(a,c){var d=b.styleSheets[b.styleSheets.length-1],g=d.cssRules&&d.cssRules[0]?d.cssRules[0].cssText:d.cssText||"",h=a.childNodes,i={};while(f--)i[h[f].id]=h[f];e.csstransforms3d=i.csstransforms3d.offsetLeft===9},f,c)}([,["@media (",m.join("transform-3d),("),h,")","{#csstransforms3d{left:9px;position:absolute}}"].join("")],[,"csstransforms3d"]);n.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},n.csstransforms3d=function(){var a=!!z(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]);a&&"webkitPerspective"in f.style&&(a=e.csstransforms3d);return a};for(var B in n)u(n,B)&&(s=B.toLowerCase(),e[s]=n[B](),q.push((e[s]?"":"no-")+s));e.addTest=function(a,b){if(typeof a=="object")for(var d in a)u(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return;b=typeof b=="boolean"?b:!!b(),f.className+=" "+(b?"":"no-")+a,e[a]=b}return e},v(""),i=k=null,e._version=d,e._prefixes=m,e.testProp=function(a){return z([a])},e.testStyles=r;return e}(this,window.document);



var Scroll3d = function(config) {
	var self = this;
	
	var _prefixes = ['webkit', 'Moz', 'O', 'ms'];
	
	var _perspective = 1000;
	var _depth = 50;
	var _parentContainer;
	var _targetElements;
	
	
	var _windowCenterOffset;
	var _parentHeight;
	
	
	
	
	
	/**
	 * Converts an RGB color value to HSV. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and v in the set [0, 1].
	 *
	 * @param   Number  r       The red color value
	 * @param   Number  g       The green color value
	 * @param   Number  b       The blue color value
	 * @return  Array           The HSV representation
	 */
	function rgbToHsv(r, g, b){
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
	 * Converts an HSV color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes h, s, and v are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  v       The value
	 * @return  Array           The RGB representation
	 */
	function hsvToRgb(h, s, v){
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
	
	
	
	
	
	
	var _addSides = function(element) {
		element.style.position = 'relative';
		
		
		var regexResult = window.getComputedStyle(element).backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
		var rgbColor = [parseInt(regexResult[1]), parseInt(regexResult[2]), parseInt(regexResult[3])];
		var hslColor = rgbToHsv(rgbColor[0], rgbColor[1], rgbColor[2]);
		
		var height = element.offsetHeight;
		
		
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
	
	var _getTopSide = function(height, hslColor) {
		var div = _getSideBase(height);
		div.style.width = '100%';
		div.style.height = _depth + 'px';
		div.style.top = (-_depth) + 'px';
		div.style.webkitTransform = 'rotateX(90deg)';
		div.style.webkitTransformOrigin = '50% 100%';
		div.style.backgroundColor = _lightenColor(hslColor, 0.1);
		
		return div;
	};
	
	var _getBottomSide = function(height, hslColor) {
		var div = _getSideBase(height);
		div.style.width = '100%';
		div.style.height = _depth + 'px';
		div.style.bottom = (-_depth) + 'px';
		div.style.webkitTransform = 'rotateX(-90deg)';
		div.style.webkitTransformOrigin = '50% 0%';
		div.style.backgroundColor = _lightenColor(hslColor, 0.1);
		
		return div;
	};
	
	var _getLeftSide = function(height, hslColor) {
		var div = _getSideBase(height);
		div.style.width = _depth + 'px';
		div.style.height = '100%';
		div.style.left = '0px';
		div.style.webkitTransform = 'rotateY(90deg)';
		div.style.webkitTransformOrigin = '0% 50%';
		div.style.backgroundColor = _lightenColor(hslColor,0.05);
		
		return div;
	};
	
	var _getRightSide = function(height, hslColor) {
		var div = _getSideBase(height);
		div.style.width = _depth + 'px';
		div.style.height = '100%';
		div.style.right = '0px';
		div.style.webkitTransform = 'rotateY(-90deg)';
		div.style.webkitTransformOrigin = '100% 50%';
		div.style.backgroundColor = _lightenColor(hslColor, 0.05);
		
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
		_parentContainer.style.webkitPerspective = _perspective;
		_parentContainer.style.webkitTransformStyle = 'preserve-3d';
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
		_parentContainer.style.webkitPerspectiveOriginY = (window.scrollY + _windowCenterOffset - _parentContainer.offsetTop) / _parentHeight * 100 + '%';
	};
	
	(function init() {
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
		
	})();
	
	
};
