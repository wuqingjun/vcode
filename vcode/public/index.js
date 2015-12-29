


window.addEventListener('DOMContentLoaded', function () {
    var root = {
        origin: { x: 0, y: 0, z: 0},
        current: { x: 0, y: 0, z: 0 },
        shape: 'square',
        color: new BABYLON.Color3.Yellow,
        predefinedshoworder: 0, 
        globalshoworder: 0, 
        globalhighlightorder: 0
    };

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
        this.parent = parent || root;
        this.shape = shape || this.parent.shape;
        this.highlighted = highlighted || false;
        this.dimension = { x: 1, y: 1, z: 1 };
        this.showorder = increaseshoworder !== false ? ++root.predefinedshoworder : root.predefinedshoworder;
        this.position = { x: this.parent.current.x, y: this.parent.current.y, z: this.parent.current.z };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.CalculatePosition();
    }
    
    Element.prototype.rotate = function (x, y, z) {
        this.rotation = {x: x, y: y, z: z};
        var ori = [[this.position.x, this.position.y, this.position.z]];
        var c = rotate(ori, this.rotation.x, this.rotation.y, this.rotation.z);
        this.position = { x: c[0][0], y: c[0][1], z: c[0][2] };
    }
    
    Element.prototype.locate = function (x, y, z) {
        this.position = { x: x, y: y, z: z };
    }
    
    Element.prototype.translate = function (x, y, z) {
        this.position = { x: this.position.x + dx, y: this.position.y + dy, z: this.position.z + dz };
    }
    
    Element.prototype.CalculatePosition = function (){
        this.parent.current.x += this.dimension.x;    
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
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = this.position.y;
            this.mesh.position.z = this.position.z;
        }
        return this.mesh;
    }
    
    function NewLine(v){
        this.value = v || 1;
    }  
    
    NewLine.prototype.CalculatePosition = function (){
        root.current.y += this.value;
        root.current.x = 0;
    }

    NewLine.prototype.Draw = function (scene) {
        this.CalculatePosition();
    }
    
    function NewColumn(v){
        this.value = v || 1;
    }
    
    NewColumn.prototype.CalculatePosition = function (){
        root.current.x += this.value;
        root.current.y = 0;
    }
    
    NewColumn.prototype.Draw = function (scene){
    }
    
    List = function (eles, parent, onebyone, highlighted, shape) {
        this.elements = eles || [];
        this.parent = parent || root;
        this.shape = shape || this.parent.shape;
        this.highlighted = highlighted || false;
        this.showorder = ++root.predefinedshoworder;
        this.dimension = { x: 0, y: 0, z: 0 };
        this.position = { x: this.parent.current.x, y: this.parent.current.y, z: this.parent.current.z };
        var x = 0;
        for (var i = 0; i < this.elements.length; ++i, root.predefinedshoworder += onebyone === true) {
            this.elements[i].showorder = root.predefinedshoworder;
            this.elements[i].x = i;
            this.elements[i].shape = this.shape;
            this.dimension.width += 1;
        }
        this.CalculatePosition();
    }
    
    List.prototype.CalculatePosition = function (){
        this.parent.current.x += this.dimension.x;
    }
    
    List.prototype.Add = function(e) {
        e.position.x = this.elements.length;
        this.dimension.width += 1;
        this.parent.current.x += 1;
        this.elements.push(e);
    }
    
    List.prototype.Draw = function (scene){
        this.mesh = null;
        if (this.showorder !== null && this.showorder <= root.globalshoworder) {
            for (var i = 0; i < this.elements.length; ++i) {
                var e = this.elements[i].Draw(scene);
                if (this.mesh === null) {
                    this.mesh = e;
                }
                else {
                    e.parent = this.mesh;
                }
            }
        }
        if (this.mesh !== null) {
            if (this.shape === 'disc') {
                this.mesh.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
            }
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = this.position.y;
            this.mesh.position.z = this.position.z;
        }
        return this.mesh;
    }
    
    List.prototype.locate = function (x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
    
    List.prototype.translate = function (dx, dy, dz) {
        this.position.x += dx;
        this.position.y += dy;
        this.position.z += dz;
    }
    
    List.prototype.rotate = function (x, y, z) {
        this.rotation = { x: x, y: y, z: z};
        var ori = [[this.position.x, this.position.y, this.position.z]];
        var c = rotate(ori, this.rotation.x, this.rotation.y, this.rotation.z);
        this.position = { x: c[0][0], y: c[0][1], z: c[0][2] };
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
    
    var arr = [new Element(0), new Element(1)];
    arr.push(new Element(2));
    var l = new List(arr, null, false, null, 'disc');
    l.rotate(0, 0, Math.PI / 2);
    l.locate(-1, -1, 0);
    globalqueue.push(l);
    //var e0 = new Element(0, false);
    //var e1 = new Element(1, false)
    //e1.locate(2, 1, 0);
    //e1.rotate(0, 0, 90);
    //globalqueue.push(e0);
    //globalqueue.push(e1);
    //globalqueue.push(new NewLine(2));
    //globalqueue.push(new Element(2));
    //NewLine();
    //var vcarr = new VcArray(elements);
    //globalqueue.push(vcarr);
    //NewLine();
    //globalqueue.push(new VcLinkedList(elements, 0, 'disc'));
    //map['a'] = [3, 5, 1];
    //map['b'] = [1, 2, 4];
    //map['cs'] = [2, 3, 5];
    //NewLine();
    //globalqueue.push(new VcMap(map));

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
