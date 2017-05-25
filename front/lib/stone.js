/* 3d stones */

"use strict";

define([ "lib/three", "lib/scene" ], function (THREE, scene) {
	function init(scene, config) {
		config = $.extend({
			rotate: true,
			color: 0x3F3F3F,
			shading: THREE.FlatShading
		}, config);

		var geometry = new THREE.IcosahedronGeometry(3);

		// var material = new THREE.MeshBasicMaterial({ color: 0x095BBD });
		var material = new THREE.MeshPhongMaterial({
			color: config.color,
			shading: config.shading
		});

		var cube = new THREE.Mesh(geometry, material);

		cube.position.y = 0;

		if (config.rotate === true) {
			scene.render(function () {
				cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;
				// cube.rotation.z += 0.01;
			});
		}

		scene.add(cube);

		return {};
	}

	return { init: init };
});
