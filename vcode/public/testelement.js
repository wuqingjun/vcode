
window.addEventListener('DOMContentLoaded', function () {
    var globalqueue = [];
	var total = 0;
	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
    
    function testElement(){
        var shape = 'disc';
        root.scale = 0.8;
        var e0 = new Element(3, root, false, shape);
        var e1 = new Element(4, root, false, shape);
        root.NextLine();
        root.SetAlignment('vertical');
        var e2 = new Element(5, root, false, shape);
        var e3 = new Element(6, root, false, shape);
        e1.locate(2, 1, 0);
        e1.rotate(0, 0, -Math.PI);
        globalqueue.push(e0);
        globalqueue.push(e1);
        globalqueue.push(e2);
        globalqueue.push(e3);
    }
    
    testElement();

    var createScene = function () {
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
        if (root.globalshoworder  <= root.predefinedshoworder) {
            if (total % 30 === 19) {
                var scene = createScene();
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
