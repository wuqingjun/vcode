

window.addEventListener('DOMContentLoaded', function () {
	
	function Element(e, scene, shape, xpos, ypos) {
		var mat = new BABYLON.StandardMaterial("element", scene);
		this.element = null;
		if (shape == 'disc') {
			this.element = BABYLON.Mesh.CreateDisc("element", 0.5, 40, scene, false, 2);
			this.element.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
		}
		else if (shape == 'square') {
			this.element = BABYLON.Mesh.CreatePlane("element", 1, scene, false, 2);
		}
		this.element.material = mat;
		var tex = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
		this.element.material.diffuseTexture = tex;
		this.element.material.emissiveColor = new BABYLON.Color3.Green;
		tex.drawText(e, 200, 300, "bold 170px Segoe UI", "black", "#555555");
		var lines = BABYLON.Mesh.CreateLines("lines", [
			new BABYLON.Vector3(-0.5, -0.5, 0),
			new BABYLON.Vector3(-0.5, +0.5, 0),
			new BABYLON.Vector3(+0.5, +0.5, 0),
			new BABYLON.Vector3(+0.5, -0.5, 0),
			new BABYLON.Vector3(-0.5, -0.5, 0)], scene);
		lines.parent = this.element;
		this.element.position.x = xpos;
        this.element.position.y = ypos;
	}
	
	Element.prototype.rotate = function (x, y, z) {
		this.element.rotation = new BABYLON.Vector3(Math.PI * x / 180, Math.PI * y / 180, Math.PI * z / 180);
    }
    
    Element.prototype.position = function (x, y, z){
        this.element.position.x = x;
        this.element.position.y = y;
        this.element.position.z = z;
    }
    
    Element.prototype.translate = function (dx, dy, dz){
        this.element.position.x += dx;
        this.element.position.y += dy;
        this.element.position.z += dz;
    }
	
	List = function(eles, scene, shape) {
        this.elements = [];
		for (var i = 0; i < eles.length; ++i) {
            this.elements.push(new Element(eles[i], scene, shape, i, 0));
            if (i > 0) {
                this.elements[i].element.parent = this.elements[0].element;
            }
        }
	}
	
    List.prototype.position = function (x, y, z){
        if (this.elements.length) {
            this.elements[0].position(x, y, z);
        }
    }
    
    List.prototype.translate = function (dx, dy, dz){
        if (this.elements.length) {
            this.elements[0].translate(dx, dy, dz);
        }
    }

    List.prototype.rotate = function (x, y, z){
        if (this.elements.length > 0) {
            this.elements[0].rotate(x, y, z);
        }
    }

	var createArray = function (elements, len, scene, shape, xpos, ypos, isvertical, dir) {
		var arr = [];
		for (var i = 0; i < len; ++i) {
			var e = new Element(elements[i], scene, shape, xpos + (isvertical ? 0 : dir * i), ypos + (isvertical ? dir * i : 0));
			arr.push(e);
		}
		return arr;
	}
	
	var createMap = function (m, scene, xpos, ypos) {
		var i = 0;
		var mp = [];
		for (var k in m) {
			var e = new Element(k, scene, 'square', xpos + i * 1.01, ypos + 1.01);
			var arr = createArray(m[k], m[k].length, scene, 'disc', xpos + i * 1.01, ypos, true, -1);
			mp[k] = { element: e, array: arr };
			++i;
		}
		return mp;
	}
	
	var createArrow = function (scale, scene) {
		return BABYLON.Mesh.CreateLines('arrow', [new BABYLON.Vector3(0, 1 * scale, 0), new BABYLON.Vector3(0, 0, 0),
			new BABYLON.Vector3(-0.375 * scale, 0.5 * scale, 0), new BABYLON.Vector3(0, 0, 0),
			new BABYLON.Vector3(0.375 * scale, 0.5 * scale, 0), new BABYLON.Vector3(0, 0, 0)],
                                    scene);
	}
	
	var createLinkedList = function (elements, scene, shape) {
		var head = null;
		for (var i = 0; i < elements.length; ++i) {
			var e = new Element(elements[i], scene, shape, i * 2, 0);
			if (head === null) {
				head = e;
			} else {
				e.element.parent = head;
			}
			if (i != elements.length - 1) {
				var arrow = createArrow(1, scene);
				arrow.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);
				arrow.position.x = 2 * i + 1 + 0.5;
				arrow.parent = head;
			}
		}
		return head;
	}
	

	var total = 0;
	var count = 0;
	var map = [];
	var xpos = 0, ypos = 0;
	var hl = -1;
	var target = 4;
	var c = 0;
	var showfomula = false;
	var stop = false;
	var elements = [0, 2, 1, 6];
	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
	
	var createScene = function (elements, map, hl) {
		var scene = new BABYLON.Scene(engine);
		scene.clearColor = new BABYLON.Color3(0, 0, 0);
		
		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -10), scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, true);
		
		//var ele = new Element('1', scene, 'square', 0, 0);
		//ele.rotate(0, 0, 45);
  //      ele.position(3, 3, 3);
  //      ele.translate(2, 0, 0);
  //      ele.rotate(0, 0, 45);
        
        var list = new List(elements, scene, 'square');
        list.position(2, -2, 0);
        list.rotate(0, 0, 45);
        list.translate(-2, -2, -2);
		//var arrow = createArrow(1, scene);
		//arrow.rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
		//var l = createLinkedList(elements, scene, 'square');
		//l.element.rotate(0, 0, 45);
		//l.rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
		//l.position.y = 3;
		//var arr = createArray(elements, elements.length, scene, 'square', -3, 3, false, 1);
		//var mp = createMap(map, scene, -3, 0);
		//var b = 'b';
		//if (hl >= 0 && hl < arr.length) {
		//    arr[hl].material.specularColor = new BABYLON.Color3.Red;
		//    var s = target - elements[hl];
		//    if (s in mp && (elements[hl] !== s || mp[s].array.length > 1)) {
		//        mp[s].element.material.emissiveColor = new BABYLON.Color3.White;
		//        mp[s].array[0].material.emissiveColor = new BABYLON.Color3.Red;
		//        if (s === elements[hl]) {
		//            mp[s].array[1].material.emissiveColor = new BABYLON.Color3(1, 0.83, 0);
		//        } else {
		//            mp[elements[hl]].array[0].material.emissiveColor = new BABYLON.Color3(1, 0.83, 0);
		//        }
		//        stop = true;
		//    }
		//}
		//createFormula(scene, target);
		
		return scene;
	}
	
	engine.runRenderLoop(function () {
		if (total % 20 == 0 && !stop) {
			if (c < elements.length) {
				if (map[elements[c]] === undefined) {
					map[elements[c]] = [];
				}
				map[elements[c]].push(c);
				++c;
				var scene = createScene(elements, map, -1);
				scene.render();
			}
			else if (hl < 6) {
				++hl;
				var scene = createScene(elements, map, hl);
				scene.render();
			}
		}
		total++;

	});
	
	// the canvas/window resize event handler
	window.addEventListener('resize', function () {
		engine.resize();
	});
});
