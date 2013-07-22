 // the semi-colon before function invocation is a safety net against concatenated
 // scripts and/or other plugins which may not be closed properly.
;(function (factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($, undefined) {
	"use strict";

	var PLUGIN_NAME = "defaultPluginName",
		NAMESPACE = "defaultNamespace",

	// Event callbacks registered fot this plugin
	// seperated with ,
		CALLBACKS = "onInit",
		_cleanData = null;


	// static constructs
	$[NAMESPACE] = $[NAMESPACE] || {version: "1.0"};

	$[NAMESPACE][PLUGIN_NAME] = {

		// General Configuration
		defaults: {
			debug: false
		}
	};

	// over-ride remove so it triggers remove
	if ($.cleanData) {
		_cleanData = $.cleanData;
		$.cleanData = function (elems) {
			for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
				try {
					$(elem).triggerHandler("remove");
				} catch (e) {
				}
			}
			_cleanData(elems);
		};
	}


	// The actual plugin constructor
	function Plugin(root, conf) {

		// private vars
		var self = this,
			$root = $(root),		// root element
			fire = $root.add(self); // elements to fire events

		// allow config overwrite from data attributes
		conf = $.extend(true, {}, conf, $root.data());

		// private methods

		/**
		 * Just a private dummy method
		 */
		function privateMethod() {
			// or do something else
			// all variables are available here
		}

		// API methods
		$.extend(self, {

			/**
			 * Plugin initialization
			 * @param {Event} e
			 * @return {${Constructor}} for fluent interface
			 */
			init: function init(e) {
				// Place initialization logic here
				// You already have access to the DOM element and the options,
				// e.g., root and conf
				privateMethod();

				// onInit
				e = e || $.Event();
				e.type = "onInit";
				fire.trigger(e);

				// return self for fluent interface
				return self;
			},

			/**
			 * Retrieve plugin config
			 * @param {String} key
			 * @return {Object}
			 */
			getConf: function getConf(key) {
				if (typeof key !== "undefined" && ({}).hasOwnProperty.call(conf, key)) {
					return conf[key];
				} else {
					return conf;
				}
			},

			/**
			 * Retrieve root element
			 * @return {HTMLElement}
			 */
			getRoot: function getRoot() {
				return $root;
			},

			/**
			 * Unbind events and remove creatded dom elements
			 * @param {Event} e
			 */
			destroy: function destroy() {
				$root.off("." + NAMESPACE + "." + PLUGIN_NAME).removeData(PLUGIN_NAME);
			}
		});

		// callbacks
		$.each(CALLBACKS.split(","), function (i, _name) {
			// remove whitespaces before and after
			var name = $.trim(_name);
			if (name === "") {
				return;
			}

			// configuration
			if ($.isFunction(conf[name])) {
				$(self).on(name + "." + NAMESPACE + "." + PLUGIN_NAME, conf[name]);
			}

			// API
			self[name] = function (fn) {
				$(self).on(name + "." + NAMESPACE + "." + PLUGIN_NAME, fn);
				return self;
			};
		});

		// remove handler
		$root.on("remove", function () {
			self.destroy();
		});

		// start initialization
		self.init(null);
	}


	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ PLUGIN_NAME ] = function (conf) {
		conf = $.extend(true, {}, $[NAMESPACE][PLUGIN_NAME].defaults, conf);

		// already constructed 
		var el = $(this).data(PLUGIN_NAME);
		if (el) {
			return conf.api ? el : $(this);
		}

		$(this).each(function () {
			el = new Plugin($(this), conf);
			$(this).data(PLUGIN_NAME, el);
		});

		// return plugin or element based on config
		return conf.api ? $(this).data(PLUGIN_NAME) : $(this);
	};
}));

