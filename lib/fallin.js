/* three.js animations in the project */

"use strict";

define([ "lib/jquery", "lib/three", "lib/util" ], function (_, THREE, util) {
	function Scene(obj, config) {
		obj = $(obj);
		config = $.extend({
			background: 0xFAFAFA
		}, config);

		var scene = new THREE.Scene();
		var light = new THREE.HemisphereLight(0xE9EFF2, 0x01010F, 1);
		scene.add(light);

		var camera = new THREE.PerspectiveCamera(75, obj.innerWidth() / obj.innerHeight(), 0.1, 1000);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 10;

		var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(config.background, 1);

		var rend_list = [];
		var stop = false;

		var render = function () {
			if (stop) {
				return;
			}

			requestAnimationFrame(render);

			for (var i = 0; i < rend_list.length; i++) {
				rend_list[i]();
			}

			renderer.render(scene, camera);
		};

		$(window).resize(function () {
			var w = obj.innerWidth(), h = obj.innerHeight();
			renderer.setSize(w, h);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		}).resize();

		// add canvas
		obj.append(renderer.domElement);

		return {
			core: scene,
			cont: obj,

			start: function () {
				stop = false;
				render();
			},

			stop: function () {
				stop = true;
			},

			render: function (rend) {
				rend_list.push(rend);
			}
		};
	}

	function Water(scene) {
		var materials = [
			new THREE.MeshPhongMaterial({ color: 0x3CB1FF, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0x3CB1FF, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0x3F3F3F, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0xF1C40F, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0x2ECC71, shading: THREE.FlatShading }),
		];

		function pos(p, x, y ,z) {
			p.position.x = x;
			p.position.y = y;
			p.position.z = z;
		};

		var particles = [];

		function randOfs(a, b) {
			return (Math.random() * (b - a)) + a;
		}

		for (var i = 0; i < 200; i++) {
			var geometry = new THREE.SphereGeometry(randOfs(0.7, 6), randOfs(4, 7), randOfs(4, 7));
			var particle = new THREE.Mesh(geometry, materials.choose());
			pos(particle, 700 + randOfs(-50, 400), 120 + randOfs(-30, 30), -400 + randOfs(-50, 400));

			particle.rotation.incx = randOfs(-0.05, 0.05);
			particle.rotation.incy = randOfs(-0.05, 0.05);
			particle.rotation.incz = randOfs(-0.05, 0.05);

			particle.speed = randOfs(0.4, 0.8);

			scene.core.add(particle);
			particles.push(particle);
		}

		var x = function (t) {
			return -t * 7;
		};
		
		var y = function (t) {
			return -t * 1.3;
		};

		var z = function (t) {
			return t * 3.4;
		};

		var dec = 1;
		var dec_proc = null;
		var acc_proc = null;

		scene.render(function () {
			for (var i = 0; i < particles.length; i++) {
				if (particles[i].position.z >= 10) {
					pos(particles[i], 700 + randOfs(-50, 50), 120 + randOfs(-50, 50), -400 + randOfs(-50, 50));
				}

				var spd = particles[i].speed;

				particles[i].rotation.x += particles[i].rotation.incx * dec;
				particles[i].rotation.y += particles[i].rotation.incy * dec;
				particles[i].rotation.z += particles[i].rotation.incz * dec;
				particles[i].position.x += x(spd * dec);
				particles[i].position.y += y(spd * dec);
				particles[i].position.z += z(spd * dec);
			}
		});

		scene.cont.mousedown(function () {
			clearInterval(acc_proc);
			dec_proc = setInterval(function () {
				dec *= 0.9;
				if (dec < 0.01) {
					dec = 0.01;
					clearInterval(dec_proc);
				}
			}, 100);
		});

		scene.cont.mouseup(function () {
			clearInterval(dec_proc);
			acc_proc = setInterval(function () {
				dec *= 1.3;
				if (dec > 1) {
					dec = 1;
					clearInterval(acc_proc);
				}
			}, 100);
		});

		return {};
	}

	return {
		Scene: Scene,
		Water: Water
	};
});
