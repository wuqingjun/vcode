


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

    function Element(v, parent, increaseshoworder, shape, highlighted) { // passing parent as null to extend the element class.
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
                this.mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
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
    
    List.prototype = new Element(null, null);
    List.prototype.constructor = List;

    function List(parent, onebyone, highlighted, shape, islinkedlist) {
        this.elements = [];
        this.parent = parent;
        this.shape = shape || (this.parent !== null ? this.parent.shape : 'square');
        this.highlighted = highlighted || false;
        this.islinkedlist = islinkedlist || false;
        this.showorder =  parent !== null ? ++parent.predefinedshoworder : 0;
        this.dimension = { x: 0, y: 0, z: 0 };
        this.alignment = 'horizontal', // 'vertical', 'diagonal'
        this.origin = {
            x: this.parent !== null ? this.parent.cursor.x : 0, 
            y: this.parent !== null ? this.parent.cursor.y : 0, 
            z: this.parent !== null ? this.parent.cursor.z : 0
        };
        this.cursor = { x: 0, y: 0, z: 0 };
    }
    
    List.prototype.Add = function (n) {
        if (this.islinkedlist && this.elements.length > 0) {
            var a = new Arrow(this);
            a.origin.x -= 0.5;
            this.elements.push(a);
        }
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
                        //shape disc is special. Single elemnt needs be roated around x-axis for PI. 
                        //But in the list, the first element will be rotated like a single element, 
                        // since the other elements in the list are children of the first one, they don't need self rotated in the Element.Draw(scene).
                        e.rotation = new BABYLON.Vector3(0, 0, 0); 
                    }
                }
            }
        }
        if (this.mesh !== null) {
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

    Arrow.prototype = new Element(null, null);
    Arrow.prototype.constructor = Arrow;
    function Arrow(parent){
        this.parent = parent || root;
        this.origin = { x: this.parent.cursor.x, y: this.parent.cursor.y, z: this.parent.cursor.z };//arrow tail
        this.alignment = 'horizontal';
        this.vertices = [new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(1, 0, 0),
            new BABYLON.Vector3(0.5, -0.375, 0),
            new BABYLON.Vector3(0.5, 0.375, 0)];
        if (this.parent !== null) {
            this.parent.CalculatePosition(this.dimension);
        }
    }
    
    Arrow.prototype.rotate = function (x, y, z){
        this.rotation = { x: x, y: y, z: z };
        var ori = [[this.origin.x, this.origin.y, this.origin.z]];
        var c = rotate(ori, this.rotation.x, this.rotation.y, this.rotation.z);
        this.origin = { x: c[0][0], y: c[0][1], z: c[0][2] };
        
        for (var i = 0; i < this.vertices.length; ++i) {
            ori = [[this.vertices[i].x, this.vertices[i].y, this.vertices[i].z]];
            c = rotate(ori, x, y, z);
            this.vertices[i] = new BABYLON.Vector3(c[0][0], c[0][1], c[0][2]);
        }
    }
    
    Arrow.prototype.Draw = function (scene){
        this.mesh = BABYLON.Mesh.CreateLines('arrow', 
            [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[1], this.vertices[3], this.vertices[1]], scene);
        this.mesh.position.x = this.origin.x;
        this.mesh.position.y = this.origin.y;
        this.mesh.position.z = this.origin.z;
        return this.mesh;
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
    
    function testElement(){
        var shape = 'disc';
        var e0 = new Element(3, root, false, shape);
        var e1 = new Element(4, root, false, shape);
        root.NextLine();
        root.SetAlignment('vertical');
        var e2 = new Element(5, root, false, shape);
        var e3 = new Element(6, root, false, shape)
        //e1.locate(2, 1, 0);
        //e1.rotate(0, 0, -Math.PI);
        globalqueue.push(e0);
        globalqueue.push(e1);
        globalqueue.push(e2);
        globalqueue.push(e3);
    }
    
    function testList(){
        var l = new List(root, false, null, 'square', true);
        l.Add(7);
        l.Add(8);
        l.Add(5);
        l.locate(2, 0, 0);
        l.rotate(0, 0, -Math.PI / 2);
        l.locate(0, 3, 0);
        globalqueue.push(l);
    }
    
    function testArrow(){
        var a = new Arrow();
        a.origin.x -= 0.5;
        globalqueue.push(a);

        var b = new Arrow();
        b.locate(2, 1, 0);
        b.rotate(0, 0, Math.PI / 2);
        globalqueue.push(b);
    }
    
    //testElement();
    //testArrow();
    testList();

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
