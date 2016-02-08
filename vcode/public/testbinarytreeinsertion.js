
window.addEventListener('DOMContentLoaded', function () {
  
    var globalqueue = [];
	var total = 0;
	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
    
    function testBinaryTreeInsertion() {
        var bt = new BinaryTree(root);
        bt.BuildPositionTree(4);
        bt.Insert(5);
        bt.Insert(3);
        bt.Insert(4);
        bt.Insert(2);
        bt.Insert(9);
        bt.Insert(7);
        bt.Insert(8);
        bt.Draw();
        globalqueue.push(bt);
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
