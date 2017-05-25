"user strict";

define([], function () {
	var vcent = {};

	vcent.update = function () {
		var e = $(".vcenter");
		var i;
		var cent = function (pr, e) { e.css("top", ((pr.innerHeight() - e.outerHeight()) / 2) + "px"); };

		e.css("position", "relative");

		for (i = 0; i < e.length; i++) {
			cent($(e[i]).parent(), $(e[i]));
		}

		cent = function (pr, e) { e.css("top", ((pr.innerHeight() - e.outerHeight()) / 2) + "px"); };

		e = $(".avcenter");
		e.css("position", "absolute");

		for (i = 0; i < e.length; i++) {
			cent($(e[i]).parent(), $(e[i]));
		}

		return;
	};

	vcent.reset = function (com) {
		if (com.hasClass("vcenter") ||
			com.hasClass("avcenter")) {
			com.removeClass("vcenter");
			com.removeClass("avcenter");
			com.css("top", "0");
		}
	};

	vcent.update();
	$(window)
		.on("load", vcent.update)
		.on("resize", vcent.update);

	setInterval(vcent.update, 50);

	return vcent;
});
