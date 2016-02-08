
window.addEventListener('DOMContentLoaded', function () {
  
    var globalqueue = [];
	var total = 0;
	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
        
    function testBinarySearch()    {
        var shape = 'square';
        
        var t = new Element(9, root, false, shape, 0.5);
        root.NextLine(-1);
        globalqueue.push(t);

        var list = new List(root, false, null, shape, false, 0.5);
        list.AddRange([2, 5, 6, 6, 7, 8, 9]);
        var target = 9;
        
        // another idea to highlight l/h: list.At([]);

        var l = 0, h = list.elements.length - 1, m = 0, result = -1;
        while (l <= h) {
            m = (l + h) / 2;
            if (list.At(m).value === target) {
                result = m;
                break;
            }
            else if (list.At(m).value < target) {
                l = m + 1;
            }
            else if(list.At(m).value > target){
                h = m - 1;
            }
        }

        globalqueue.push(list);
    }

    testBinarySearch();

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
