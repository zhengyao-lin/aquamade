/* three.js animations in the project */

"use strict";

define([ "lib/three", "lib/util" ], function (THREE, util) {
	function Scene(obj, config) {
		obj = $(obj);
		config = $.extend({
			background: 0xFAFAFA,
			ratio: 1440 / 780
		}, config);

		var scene = new THREE.Scene();
		var light = new THREE.HemisphereLight(0xE9EFF2, 0x01010F, 1);
		scene.add(light);

		obj.css("height", obj.width() / config.ratio + "px");

		// alert([ obj.width(), obj.height() ]);

		var camera = new THREE.PerspectiveCamera(45, config.ratio, 0.1, 1000);
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 50;

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
			obj.css("height", obj.width() / config.ratio + "px");
			var w = obj.innerWidth(), h = obj.innerHeight();
			renderer.setSize(w, h);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		}).resize();

		// add canvas
		obj.append(renderer.domElement);

		var mspd = 0.2;
		var rspd = 0.01;
		var inc_proc = null;

		$(window).keyup(function () {
			mspd = 0.2;
			rspd = 0.01;
			if (inc_proc) {
				clearInterval(inc_proc);
				inc_proc = null;
			}
		});

		$(window).keydown(function (e) {
			// alert(e.keyCode);
			switch (e.keyCode) {
				case 37: // left
					if (e.ctrlKey) 
						camera.rotation.y += rspd;
					else
						camera.position.x -= mspd;
					
					break;

				case 38: // up
					if (e.ctrlKey) 
						camera.rotation.x += rspd;
					else
						camera.position.y += mspd;

					break;

				case 39: // right
					if (e.ctrlKey) 
						camera.rotation.y -= rspd;
					else
						camera.position.x += mspd;

					break;

				case 40: // down
					if (e.ctrlKey) 
						camera.rotation.x -= rspd;
					else
						camera.position.y -= mspd;

					break;

				case 87: // w
					camera.position.z -= mspd;
					break;

				case 83: // s
					camera.position.z += mspd;
					break;
			}

			if (!inc_proc) {
				inc_proc = setInterval(function () {
					rspd *= 1.2;
					mspd *= 1.2;

					if (rspd > 0.1) {
						rspd = 0.1;
					}

					if (mspd > 1) {
						mspd = 1;
					}
				}, 100);
			}
		});

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

	function Water(scene, config) {
		config = $.extend({
			start: [ [ 350, 0, -400 ], [ 365, 15, -400 ] ], // starting plane
			end: [ [ -365, -15, 400 ], [ -350, 0, 400 ] ] // ending plane
		}, config);

		// starting ranges of x, y and z
		var s_range_x = [ config.start[0][0], config.start[1][0] ];
		var s_range_y = [ config.start[0][1], config.start[1][1] ];
		var s_range_z = [ config.start[0][2], config.start[1][2] ];

		var max_z = config.end[0][2];

		// gradient of xy line & xz line
		var x_y_k = (config.start[0][1] - config.end[0][1]) / (config.start[0][0] - config.end[0][0]);
		var x_z_k = (config.start[0][2] - config.end[0][2]) / (config.start[0][0] - config.end[0][0]);

		var materials = [
			new THREE.MeshPhongMaterial({ color: 0x3CB1FF, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0x3F3F3F, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0xF1C40F, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0x2ECC71, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0xE74C3C, shading: THREE.FlatShading }),
			new THREE.MeshPhongMaterial({ color: 0xE67E22, shading: THREE.FlatShading }),
		];

		function pos(p, x, y ,z) {
			p.position.x = x;
			p.position.y = y;
			p.position.z = z;
		};

		var particles = [];

		function rand(a, b) {
			return (Math.random() * (b - a)) + a;
		}

		// start plane:
		//     x: 10 - 20
		//     y: 0 - 10
		//     z: -10
		// 
		// end plane:
		//     x: -10 - -20
		//     y: 0 - -10
		//     z: 10
		// 

		function randPartic(partic) {
			partic.rotation.incx = rand(-0.05, 0.05);
			partic.rotation.incy = rand(-0.05, 0.05);
			partic.rotation.incz = rand(-0.05, 0.05);

			partic.speed = rand(1, 2);

			pos(partic,
				rand(s_range_x[0], s_range_x[1]),
				rand(s_range_y[0], s_range_y[1]),
				rand(s_range_z[0], s_range_z[1]));
		}

		function createPartic() {
			var geometry = new THREE.SphereGeometry(rand(1, 2), rand(4, 7), rand(4, 7));
			var particle = new THREE.Mesh(geometry, materials.choose());
			
			randPartic(particle);

			scene.core.add(particle);
			particles.push(particle);
		}

		var create_proc = setInterval(function () {
			createPartic();
		}, 20);

		// change value of xyz
		var x = function (d) {
			return d;
		};
		
		var y = function (d) {
			return d * x_y_k;
		};

		var z = function (d) {
			return d * x_z_k;
		};

		var dec = 1;
		var dec_proc = null;
		var acc_proc = null;

		scene.render(function () {
			for (var i = 0; i < particles.length; i++) {
				if (particles[i].position.z >= max_z) {
					randPartic(particles[i]);
					clearInterval(create_proc);
					// alert(particles.length);
				}

				var spd = -particles[i].speed;

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
				dec *= 0.8;
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
