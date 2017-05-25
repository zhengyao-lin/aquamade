/* THREE scene */

"use strict";

define([ "lib/three" ], function (THREE) {

	function init(cont, config) {
		cont = $(cont);
		config = $.extend({
			background: 0xFFFFFF,
			light: true
		}, config);

		var scene = new THREE.Scene();

		var camera = new THREE.PerspectiveCamera(75, cont.innerWidth() / cont.innerHeight(), 0.1, 100);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 5;

		var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(config.background, 1);

		$(window).resize(function () {
			renderer.setSize(cont.innerWidth(), cont.innerHeight());
			camera.aspect = cont.innerWidth() / cont.innerHeight();
			camera.updateProjectionMatrix();
		}).resize();

		if (config.light) {
			var light = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1);
			scene.add(light);
		}

		cont.append(renderer.domElement);

		var stop = false;
		var evrend = [];

		var render = function () {
			if (stop) return;
			requestAnimationFrame(render);

			for (var i = 0; i < evrend.length; i++) {
				evrend[i]();
			}

			renderer.render(scene, camera);
		};

		return {
			scene: scene,

			add: function (obj) {
				return scene.add(obj);
			},

			start: function () {
				stop = false;
				render();
			},

			stop: function () {
				stop = true;
			},

			render: function (cb) {
				evrend.push(cb);
			}
		};
	}

	return { init: init };
});
