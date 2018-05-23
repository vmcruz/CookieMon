

var CookieMon = cookiemon = (function(document) {
	'use strict';
	var _version = 0.3;
	var _author = "Victor Cruz";
	var _build = "28122016";
	var _path = "/";
	var _domain = "";
	var _secure = !1;
	
	return {
		
		version : function() {
			return _version;
		},
		
		
		author : function() {
			return _author;
		},
		
		
		build : function() {
			return _build;
		},
		
		
		path : function(p) {
			if(p)
				_path = p;
			else
				return _path;
		},
		
		
		domain : function(d) {
			if(d)
				_domain = d;
			else
				return _domain;
		},
		
		
		secure : function(s) {
			if(typeof s == 'boolean')
				_secure = s;
			else
				return _secure;
		},
		
		
		set : function(flavor, taste, expires, attrs) {
			if(flavor) {
				if(typeof taste != 'undefined') {
					expires = expires || 'Infinita';
					attrs = attrs || {};
			
					if(!isNaN(expires)) {
						var d = new Date();
						var creationDate = d.toGMTString();
						d.setTime(d.getTime() + 1000 * expires);
					}
					
					var jcookie = (taste.length > 0) ? encodeURIComponent(JSON.stringify({
						taste: taste,
						creation: creationDate,
						expiration: ((isNaN(expires)) ? expires : d.toGMTString()),
						path: attrs.path || _path,
						domain: attrs.domain || _domain,
						secure: attrs.secure || _secure
					})) : "";
					
					document.cookie = flavor + "=" + jcookie
										+ ((!isNaN(expires)) ? ";expires=" + d.toGMTString() : "")
										+ ";path=" + _path
										+ ((_domain.length > 0) ? ";domain=" + _domain : "")
										+ ((_secure === true) ? ";secure" : "");
					return true;
				}
			}
			return false
		},
		
		
		get : function(flavor) {
			if(flavor) {
				var cookies = document.cookie.split(";");
				for(var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i].trim().split("=");
					if(cookie[0] == flavor) {
						try {
							var c = JSON.parse(decodeURIComponent(cookie[1]));
							c.expires = function() {
								if(this.expiration == 'infinite')
									return 'infinite';
								return (new Date(this.expiration)).getTime() - (new Date()).getTime();
							};
							
							return c;
						} catch(e) {
							return decodeURIComponent(cookie[1]);
						}
					}
				}
			}
			return false;
		},
		
		
		jar : function() {
			var jar = {
				length: 0,
				flavors: [],
				foreach: function(f) {
					if(typeof f == 'function') {
						for(var i = 0; i < this.flavors.length; i++) {
							f(this[this.flavors[i]]);
						}
					}
				}
			};
			
			var cookies = document.cookie.split(";");
			var flavors = new Array();
			if(document.cookie.length > 0) {
				for(var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i].trim().split("=");
					try {
						jar[cookie[0]] = this.get(cookie[0]);
					} catch(e) {
						jar[cookie[0]] = decodeURIComponent(cookie[1]);
					}
					flavors.push(cookie[0]);
				}
				jar.length = flavors.length;
				jar.flavors = flavors;
			}
			
			return jar;
		},
		
		
		remove : function(flavor) {
			var cookie = this.get(flavor);
			if(cookie) {
				this.set(flavor, "", -1, {path: cookie.path, domain: cookie.domain, secure: cookie.secure})
				return true;
			}
			return false;
		}
	}
})(document);