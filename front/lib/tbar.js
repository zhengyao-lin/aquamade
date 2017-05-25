/* top bar */

"use strict";

define([ "lib/util" ], function (util) {
	util.css("lib/tbar.css");

	function init() {
		var main = $(" \
			<div class='lib-tbar'> \
				<div class='logo'></div> \
			</div> \
		");
		
		// main.find(".logo").html(util.logo());

		$("body").append(main);
		
		var tbar = {};

		tbar.show = function () {
			main.addClass("show");
		};

		tbar.hide = function () {
			main.removeClass("show");
		};

		return tbar;
	}

	return {
		init: init
	};
});
