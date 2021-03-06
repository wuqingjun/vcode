﻿
window.addEventListener('DOMContentLoaded', function () {
  
    var globalqueue = [];
	var total = 0;
	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
       
    function testMap(){
        root.scale = 0.5;
        root.shape = 'square';
        var map = new Map(root);
        map.Add(1, 4);
        map.Add(1, 5);
        map.Add(3, 0);
        map.Add(1, 2);
        map.Add(5, 4);
        //map.rotate(0, 0, -Math.PI / 2);
        globalqueue.push(map);
    }
       
    testMap();

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
