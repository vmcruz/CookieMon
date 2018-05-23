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
			@function CookieMon.path
			@param {String} p - Establece el valor de "path" de la cookie.
			@returns {String} En caso de que se omita el parámetro, devuelve el valor actual de "path"
		*/
		path : function(p) {
			if(p)
				_path = p;
			else
				return _path;
		},
		
		/**
			Devuelve o asigna el dominio en el que las cookies serán creadas o eliminadas. Corresponde al valor opcional "domain" de una cookie.
			@function CookieMon.domain
			@param {String} d - Establece el valor de "domain" de la cookie.
			@returns {String} En caso de que se omita el parámetro, devuelve el valor actual de "domain"
		*/
		domain : function(d) {
			if(d)
				_domain = d;
			else
				return _domain;
		},
		
		/**
			Devuelve o asigna si las cookies serán seguras o no. Corresponde al valor opcional "secure" de una cookie.
			@function CookieMon.secure
			@param {String} s - Establece el valor de "secure" de la cookie.
			@returns {String} En caso de que se omita el parámetro, devuelve el valor actual de "secure"
		*/
		secure : function(s) {
			if(typeof s == 'boolean')
				_secure = s;
			else
				return _secure;
		},
		
		/**
			Crea una cookie.
			@function CookieMon.set
			@param {String} flavor - Nombre de la cookie
			@param {String} taste - Valor de la cookie
			@param {Number} expires - ( OPCIONAL ) Valor entero positivo que determina la cantidad en segundos en que la cookie caducará
			@param {Object} attrs - ( OPCIONAL ) Especifica el valor path, domain y secure de la cookie { path: '', domain: '', secure: '' }. Si no se han definido se usan por defecto.
			@returns {Boolean} True - Al crear la cookie
			@returns {Boolean} Falso - Si flavor se omite o taste no está definido
		*/
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
		
		/**
			Lee una cookie.
			@function CookieMon.get
			@param {String} flavor - Nombre de la cookie
			@returns {Object} Cookie
		*/
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
			@function CookieMon.remove
			@param {String} flavor - El nombre de la cookie que se ha de eliminar
			@returns {Boolean} True - Cuando la cookie se elimina
			@returns {Boolean} Falso - Si la cookie no existe
		*/
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