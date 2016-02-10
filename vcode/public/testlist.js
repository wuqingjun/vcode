
window.addEventListener('DOMContentLoaded', function () {
  
    var globalqueue = [];
	var total = 0;
	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
      
    function testList(){
        var shape = 'disc';
        root.scale = 0.5;
        var l = new List(root, false, null, shape, true);
        l.Add(7);
        l.Add(8);
        l.Add(5);
        l.AddRange([3, 6, 9, 10]);
        l.rotate(0, 0, -Math.PI / 2);
        globalqueue.push(l);
        root.NextLine();
        var l2 = new List(root, false, null, shape, true);
        l2.AddRange([2, 1, 3, 6, 8, 4]);
        l2.rotate(0, 0, -Math.PI / 2);
        globalqueue.push(l2);
    }
    
    testList();

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
        if (root.globalshoworder  <= root.predefinedshoworder.value) {
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
