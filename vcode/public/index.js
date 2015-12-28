


window.addEventListener('DOMContentLoaded', function () {
    
    var globalx = 0;
    var globaly = 0;
    var globalz = 0;
    var predefinedshoworder = 0;
    var globalshoworder = 0;
    var globalhighlightorder = 0;
   
    function Element(v, increaseshoworder, shape, xpos, ypos, zpos, highlighted) {
        this.value = v;
        this.shape = 'square' || shape;
        this.highlighted = highlighted || false;
        this.height = 1;
        this.width = 1;
        this.showorder = increaseshoworder !== false ? ++predefinedshoworder : predefinedshoworder;
        this.x = xpos || globalx;
        this.y = ypos || globaly;
        this.z = zpos || globalz;
    }
    
    Element.prototype.CalculatePosition = function (){
        globalx += this.width;
    }

    Element.prototype.Draw = function (scene) {
        if (this.showorder !== null && this.showorder <= globalshoworder) {
            var mat = new BABYLON.StandardMaterial("element", scene);
            this.mesh = null;
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
            this.mesh.position.x = this.x;
            this.mesh.position.y = this.y;
            this.mesh.position.z = this.z;
            this.CalculatePosition();
            return this.mesh;
        }
        return null;
    }
    
    Element.prototype.rotate = function (x, y, z) {
        this.mesh.rotation = new BABYLON.Vector3(Math.PI * x / 180, Math.PI * y / 180, Math.PI * z / 180);
    }
    
    Element.prototype.position = function (x, y, z) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }
    
    Element.prototype.translate = function (dx, dy, dz) {
        this.mesh.position.x += dx;
        this.mesh.position.y += dy;
        this.mesh.position.z += dz;
    }
    
    function NewLine(v){
        this.value = v || 1;
    }  
    
    NewLine.prototype.CalculatePosition = function (){
        globaly += this.value;
        globalx = 0;
    }

    NewLine.prototype.Draw = function (scene) {
        this.CalculatePosition();
    }
    
    function NewColumn(v){
        this.value = v || 1;
        globalx += this.value;
    }
    
    NewColumn.prototype.Draw = function (scene){
    }
    
    List = function (eles, onebyone, highlighted) {
        this.elements = eles || [];
        this.highlighted = highlighted || false;
        this.showorder = ++predefinedshoworder;
        for (var i = 0; i < this.elements.length; ++i, predefinedshoworder += onebyone === true) {
            this.elements[i].showorder = predefinedshoworder;
        }
        this.x = globalx;
        this.y = globaly;
        this.z = globalz;
    }
    
    List.prototype.CalculatePosition = function (){

    }

    List.prototype.Draw = function (scene){
        this.mesh = null;
        if (this.showorder !== null && this.showorder <= globalshoworder) {
            this.mesh = BABYLON.Mesh.CreateLines('listline', 
                                            [new BABYLON.Vector3(-0.5, -0.5, 0), new BABYLON.Vector3(-0.5, 0.5, 0)], 
                                            scene);
            for (var i = 0; i < this.elements.length; ++i) {

                var e = this.elements[i].Draw(scene);
                if (e !== null) {
                    e.parent = this.mesh;
                }
            }
            this.mesh.position.x = this.x;
            this.mesh.position.y = this.y;
            this.mesh.position.z = this.z;
            this.CalculatePosition();
        }
        return this.mesh;
    }
    
    List.prototype.position = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    List.prototype.translate = function (dx, dy, dz) {
        this.translatex = dx;
        this.translatey = dy;
        this.translatez = dz;
    }
    
    List.prototype.rotate = function (rotatex, rotatey, rotatez) {
        this.rotatex = rotatex;
        this.rotatey = rotatey;
        this.rotatez = rotatez;
        //for (var i = 0; i < this.elements.length; ++i) {
        //    this.elements[i].element.rotation = new BABYLON.Vector3(Math.PI, 0, Math.PI * z / 180);
        //}
        //if (this.mesh !== null) {
        //    this.mesh.rotation = new BABYLON.Vector3(0, 0, Math.PI * z / 180);
        //}
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
    
    var l = [new Element(0), new Element(1)];
    globalqueue.push(new List(l, false));
    //globalqueue.push(new Element(0, false));
    //globalqueue.push(new Element(1, false));
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
                ++globalshoworder;
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
