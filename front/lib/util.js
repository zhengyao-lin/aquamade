define([], function () {
	Array.prototype.choose = function () {
		return this[Math.floor(Math.random() * this.length)];
	};

	var ret = {};

	ret.css = function (url) {
		$("<link>")
			.attr({
				rel: "stylesheet",
				href: url
			})
			.appendTo("head");
	};

	ret.emsg = function (str, style) {
		style = style || "error";
		var msg = $(" \
			<div style='text-align: center;'> \
				<div> \
					<div class='ui " + style + " message' style='word-wrap: break-word;'></div> \
				</div> \
			</div> \
		");

		var hide = function () {
			msg.transition("scale");
			clearTimeout(proc);

			setTimeout(function () {
				msg.remove();
			}, 5000);
		};

		msg.css({
			"position": "fixed",
			"top": "9px",
			"z-index": "1000000",
			"width": "100%",
			"pointer-events": "none"
		});

		msg.children("div")
			.css({
				"max-width": "80%",
				"display": "inline-block"
			})
		
		msg.find(".message")
			.css("cursor", "pointer")
			.css("pointer-events", "auto")
			.transition("scale")
			.html(str)
			.click(hide);

		var proc = setTimeout(hide, 5000);
		
		$("body").append(msg);
	};

	ret.random = function (a, b) {
		return (Math.random() * (b - a)) + a;
	};

	ret.logo = function () {
		return $("<span style='font-family: Lobster; font-weight: bold; line-height: 100%;'><span style='color: #2980B9;'>Aqua</span>made</span>");
	};

	return ret;
});
