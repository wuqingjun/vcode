
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

    function testArrow(){
        var a = new Arrow();
        a.origin.x -= 0.5;
        globalqueue.push(a);

        var b = new Arrow();
        b.locate(2, 1, 0);
        b.rotate(0, 0, Math.PI / 2);
        globalqueue.push(b);
    }
    
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
       
    function testBinaryTreeBuildPosition() {
        var bt = new BinaryTree(root);
        bt.Debug(true);
        bt.BuildPositionTree(4);
        globalqueue.push(bt);
    }
    
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

    testArrow();
    testList();
    //testBinarySearch();
    //testMap();
    //testBinaryTreeBuildPosition();
    //testBinaryTreeInsertion();

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
