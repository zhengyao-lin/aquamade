define([ "lib/jquery" ], function (_) {
	Array.prototype.choose = function () {
		return this[Math.floor(Math.random() * this.length)];
	};

	return {};
});
