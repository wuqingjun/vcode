


window.addEventListener('DOMContentLoaded', function () {
    function multiply(a, b) {
        var c = [];
        for (var i = 0; i < a.length; ++i) {
            c[i] = [];
            for (var j = 0; j < b[0].length; ++j) {
                c[i][j] = 0;
                for (var k = 0; k < b.length; ++k) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return c;
    }
    
    function rotate(origin, xangle, yangle, zangle){
        var matrixX = [[1, 0, 0], [0, Math.cos(xangle), -Math.sin(xangle)], [0, Math.sin(xangle), Math.cos(xangle)]];
        var matrixY = [[Math.cos(yangle), 0, Math.sin(yangle)], [0, 1, 0], [-Math.sin(yangle), 0, Math.cos(yangle)]];
        var matrixZ = [[Math.cos(zangle), -Math.sin(zangle), 0], [Math.sin(zangle), Math.cos(zangle), 0], [0, 0, 1]];
        var cx = multiply(origin, matrixX);
        var cy = multiply(cx, matrixY);
        var cz = multiply(cy, matrixZ);
        return cz;
    }

    function Element(v, parent, increaseshoworder, shape, highlighted) {
        this.value = v;
        this.parent = parent;
        this.shape = shape || (parent !== null ? parent.shape : 'square');
        this.highlighted = highlighted || false;
        this.cursor = { x: 0, y: 0, z: 0 };
        this.alignment = 'horizontal', // 'vertical', 'diagonal'
        this.dimension = { x: 1, y: 1, z: 0 };
        this.showorder = increaseshoworder !== false ? ++root.predefinedshoworder : root.predefinedshoworder;
        this.origin = {
            x: this.parent === null ? 0 : this.parent.cursor.x, 
            y: this.parent === null ? 0 : this.parent.cursor.y, 
            z: this.parent === null ? 0 : this.parent.cursor.z
        };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.CalculatePosition({ x: 0, y: 0, z: 0 });
    }
    
    Element.prototype.rotate = function (x, y, z) {
        this.rotation = {x: x, y: y, z: z};
        var ori = [[this.origin.x, this.origin.y, this.origin.z]];
        var c = rotate(ori, this.rotation.x, this.rotation.y, this.rotation.z);
        this.origin = { x: c[0][0], y: c[0][1], z: c[0][2] };
    }
    
    Element.prototype.locate = function (x, y, z) {
        this.origin = { x: x, y: y, z: z };
    }
    
    Element.prototype.translate = function (x, y, z) {
        this.origin = { x: this.cursor.x + dx, y: this.cursor.y + dy, z: this.cursor.z + dz };
    }
    
    Element.prototype.CalculatePosition = function (childdimension){
        this.dimension.x = Math.max(this.cursor.x + childdimension.x, this.dimension.x);
        this.dimension.y = Math.max(this.cursor.y + childdimension.y, this.dimension.y);
        this.dimension.z = Math.max(this.cursor.z + childdimension.z, this.dimension.z);
        if (this.alignment === 'horizontal' || this.alignment === 'diagonal') {
            this.cursor.x = this.dimension.x;
        }
        if (this.alignment === 'vertical' || this.alignment === 'diagonal') {
            this.cursor.y = this.dimension.y;
        }
        if (this.parent !== null) {
            this.parent.CalculatePosition(this.dimension); 
        }
    }

    Element.prototype.Draw = function (scene) {
        this.mesh = null;
        if (this.showorder !== null && this.showorder <= root.globalshoworder) {
            var mat = new BABYLON.StandardMaterial("element", scene);
            if (this.shape == 'disc') {
                this.mesh = BABYLON.Mesh.CreateDisc("element", 0.5, 40, scene, false, 2);
            }
            else if (this.shape == 'square') {
                this.mesh = BABYLON.Mesh.CreatePlane("element", 1, scene, false, 2);
            }
            this.mesh.material = mat;
            var tex = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            this.mesh.material.diffuseTexture = tex;
            this.mesh.material.emissiveColor = this.highlighted ? new BABYLON.Color3.Yellow: new BABYLON.Color3.Green;
            tex.drawText(this.value, 200, 300, "bold 170px Segoe UI", "black", "#555555");
            var lines = BABYLON.Mesh.CreateLines("lines", [
                new BABYLON.Vector3(-0.5, -0.5, 0),
                new BABYLON.Vector3(-0.5, +0.5, 0),
                new BABYLON.Vector3(+0.5, +0.5, 0),
                new BABYLON.Vector3(+0.5, -0.5, 0),
                new BABYLON.Vector3(-0.5, -0.5, 0)], scene);
            lines.parent = this.mesh;
            this.mesh.position.x = this.origin.x;
            this.mesh.position.y = this.origin.y;
            this.mesh.position.z = this.origin.z;
        }
        return this.mesh;
    }
    
    var root = {
        origin: { x: 0, y: 0, z: 0 },
        cursor: { x: 0, y: 0, z: 0 },
        shape: 'square',
        color: new BABYLON.Color3.Yellow,
        predefinedshoworder: 0, 
        globalshoworder: 0, 
        globalhighlightorder: 0,
        dimension: {x: 0, y: 0, z: 0},
        alignment: 'horizontal', // 'horizontal', 'vertical', 'diagonal'
        CalculatePosition: function (childdimension) {
            this.dimension.x = Math.max(this.cursor.x + childdimension.x, this.dimension.x);
            this.dimension.y = Math.max(this.cursor.y + childdimension.y, this.dimension.y);
            this.dimension.z = Math.max(this.cursor.z + childdimension.z, this.dimension.z);
            if (this.alignment === 'horizontal' || this.alignment === 'diagonal') {
                this.cursor.x = this.dimension.x;
            }
            if (this.alignment === 'vertical' || this.alignment === 'diagonal') {
                this.cursor.y = this.dimension.y;
            }
        },
        SetAlignment: function (mode) {
            this.alignment = mode;
        },
        NextLine: function (v){
            var nl = v || 1;
            this.cursor.y += nl;
            this.cursor.x = 0;
        },
        NextColumn: function (v){
            var nl = v || 1;
            this.cursor.x += nl;
            this.cursor.y = 0;
        }
    };
    
    List.prototype = new Element(null, null); // passing parent as null to extend the element class.
    List.prototype.constructor = List;

    function List(parent, onebyone, highlighted, shape) {
        this.elements = [];
        this.parent = parent || root;
        this.shape = shape || this.parent.shape;
        this.highlighted = highlighted || false;
        this.showorder = ++root.predefinedshoworder;
        this.dimension = { x: 0, y: 0, z: 0 };
        this.alignment = 'horizontal', // 'vertical', 'diagonal'
        this.origin = { x: this.parent.cursor.x, y: this.parent.cursor.y, z: this.parent.cursor.z };
        this.cursor = { x: this.parent.cursor.x, y: this.parent.cursor.y, z: this.parent.cursor.z };
    }
    
    List.prototype.Add = function (n) {
        var e = new Element(n, this);
        this.elements.push(e);
        this.parent.CalculatePosition(this.dimension);
    }
    
    List.prototype.Draw = function (scene){
        this.mesh = null;
        if (this.showorder !== null && this.showorder <= root.globalshoworder) {
            for (var i = 0; i < this.elements.length; ++i) {
                var e = this.elements[i].Draw(scene);
                if (e !== null) {
                    if (this.mesh === null) {
                        this.mesh = e;
                    }
                    else {
                        e.parent = this.mesh;
                    }
                }
            }
        }
        if (this.mesh !== null) {
            if (this.shape === 'disc') {
                this.mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
            }
            this.mesh.position.x = this.origin.x;
            this.mesh.position.y = this.origin.y;
            this.mesh.position.z = this.origin.z;
        }
        return this.mesh;
    }
    
    List.prototype.rotate = function (x, y, z) {
        this.rotation = { x: x, y: y, z: z};
        var ori = [[this.origin.x, this.origin.y, this.origin.z]];
        var c = rotate(ori, this.rotation.x, this.rotation.y, this.rotation.z);
        this.origin = { x: c[0][0], y: c[0][1], z: c[0][2] };
        for (var i = 0; i < this.elements.length; ++i) {
            this.elements[i].rotate(x, y, z);
        }
    }

    var globalqueue = [];
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
    
    var l = new List(root, false, null, 'disc');
    l.Add(0);
    l.Add(1);
    l.Add(2);
    l.rotate(0, 0, -Math.PI / 2);
    l.locate(-3, 1, 0);
    globalqueue.push(l);
    var e0 = new Element(3, root, false);
    var e1 = new Element(4, root, false);
    root.NextLine();
    root.SetAlignment('vertical');
    var e2 = new Element(5, root, false);
    var e3 = new Element(6, root, false)
    e1.locate(2, 1, 0);
    e1.rotate(0, 0, -Math.PI);
    globalqueue.push(e0);
    globalqueue.push(e1);
    globalqueue.push(e2);
    globalqueue.push(e3);
    
    var createScene = function (elements, map, hl) {
        globalx = 0;
        globaly = 0;
		var scene = new BABYLON.Scene(engine);
		scene.clearColor = new BABYLON.Color3(0, 0, 0);
		
		var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -10), scene);
		camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        
        for (var i = 0; i < globalqueue.length; ++i) {
            globalqueue[i].Draw(scene);
        }
		
		return scene;
	}
	
	engine.runRenderLoop(function () {
        if (!stop) {
            if (total % 20 === 19) {
                var scene = createScene(elements, map, hl);
                scene.render();
                ++root.globalshoworder;
            }
            
		}
        total++;
        if (total === 1000) {
            stop = true;
        }
	});
	
	// the canvas/window resize event handler
	window.addEventListener('resize', function () {
		engine.resize();
	});
});
