/**
 @singleton CookieMon.__singleton
 @description Manejador de cookies en JavaScript.
 @author Víctor Cruz
 @created 28/12/2016
 @version 0.3
*/

var CookieMon = cookiemon = (function(document) {
	'use strict';
	var _version = 0.3;
	var _author = "Victor Cruz";
	var _build = "28122016";
	var _path = "/";
	var _domain = "";
	var _secure = !1;
	
	return {
		/**
			Devuelve la versión de CookieMon.
			@function CookieMon.version
			@returns {Float} La versión de CookieMon
		*/
		version : function() {
			return _version;
		},
		
		/**
			Devuelve el autor de CookieMon.
			@function CookieMon.author
			@returns {String} El autor de CookieMon
		*/
		author : function() {
			return _author;
		},
		
		/**
			Devuelve la fecha de construcción de esta versión de CookieMon.
			@function CookieMon.build
			@returns {String} La fecha en la que se creó esta versión de CookieMon
		*/
		build : function() {
			return _build;
		},
		
		/**
			Devuelve o asigna el ámbito en el que las cookies serán creadas o eliminadas. Corresponde al valor opcional "path" de una cookie.
			@function CookieMon.kitchen
			@param {String} p - Establece el valor de "path" de la cookie.
			@returns {String} En caso de que se omita el parámetro, devuelve el valor actual de "path"
		*/
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
		
		/**
			Crea, modifica o lee una cookie.
			@function CookieMon.cookie
			@param {String} f - Nombre de la cookie
			@param {String} v - Valor de la cookie
			@param {Number} s - ( OPCIONAL ) Valor entero positivo que determina la cantidad en segundos en que la cookie caducará
			@returns {String} Devuelve 'in the jar' al crear una nueva cookie. Cuando al menos los parámetros f y v existen
			@returns {Boolean} Falso - Si f ó v se omiten
		*/
		set : function(flavor, taste, expires, attrs) {
			if(flavor) {
				if(typeof taste != 'undefined') {
					//La crea
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
		
		/**
			Devuelve todas las cookies creadas hasta el momento en que la función se ejecuta
			@function CookieMon.jar
			@returns {Object} Devuelve el objeto de las cookies creadas. Además añade la cantidad de cookies (length) y los nombres de cada una de ellas (flavors).
		*/
		
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
		
		/**
			Elimina una cookie creada previamente si existe
			@function CookieMon.eat
			@param {String} f - El nombre de la cookie que se ha de eliminar
			@returns {String} Devuelve 'yumi yumi' cuando la cookie se elimina
			@returns {Boolean} Falso - Si la cookie no existe
		*/
		
		remove : function(f) {
			var cookie = this.get(f);
			if(cookie) {
				this.set(f, "", -1, {path: cookie.path, domain: cookie.domain, secure: cookie.secure})
				return true;
			}
			return false;
		}
	}
})(document);