


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

    function Element(v, parent, increaseshoworder, shape, scale) { // passing parent as null to extend the element class.
        this.value = v;
        this.parent = parent;
        this.shape = shape || (parent !== null ? parent.shape : 'square');
        this.highlightorder = [];
        this.hlindex = 0;
        this.cursor = { x: 0, y: 0, z: 0 };
        this.scale = scale || (parent !== null ? parent.scale: 1.0);
        this.alignment = 'horizontal', // 'vertical', 'diagonal'
        this.dimension = { x: this.scale, y: this.scale, z: 0 };
        this.drawFrame = true;
        this.lines = [];
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
    
    Element.prototype.translate = function (dx, dy, dz) {
        this.origin.x += dx;
        this.origin.y += dy;
        this.origin.z += dz;
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
    
    Element.prototype.SetAlignment = function (mode) {
        this.alignment = mode;
    }
    
    Element.prototype.NextLine = function (v) {
        var nl = v || 1;
        this.cursor.y += nl * this.scale;
        this.cursor.x = 0;
    }
    
    Element.prototype.NextColumn = function (v) {
        var nl = v || 1;
        this.cursor.x += nl * this.scale;
        this.cursor.y = 0;
    }


    Element.prototype.Draw = function (scene) {
        this.mesh = null;
        if (this.showorder !== null && this.showorder <= root.globalshoworder) {
            var mat = new BABYLON.StandardMaterial("element", scene);
            if (this.shape == 'disc') {
                this.mesh = BABYLON.Mesh.CreateDisc("element", 0.5 * this.scale, 40, scene, false, 5);
            }
            else if (this.shape == 'square') {
                this.mesh = BABYLON.Mesh.CreatePlane("element", this.scale, scene, false, 2);
            }
            this.mesh.material = mat;
            var tex = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            this.mesh.material.diffuseTexture = tex;
            if (this.shape === 'disc') {
                this.mesh.material.diffuseTexture.uScale = 1;
                this.mesh.material.diffuseTexture.vScale = -1;
            }

            var hl = false;
            if (!hl && this.hlindex < this.highlightorder.length && root.globalshoworder === this.highlightorder[this.hlindex]) {
                hl = true;
                ++this.hlindex;
            }
            this.mesh.material.emissiveColor = hl ? new BABYLON.Color3.Yellow: new BABYLON.Color3.Green;
            tex.drawText(this.value, 200, 300, "bold 170px Segoe UI", "black", "#555555");
            if (this.drawFrame) {
                var lines = BABYLON.Mesh.CreateLines("lines", [
                    new BABYLON.Vector3(-0.5 * this.scale, -0.5 * this.scale, 0),
                    new BABYLON.Vector3(-0.5 * this.scale, 0.5 * this.scale, 0),
                    new BABYLON.Vector3(0.5 * this.scale, 0.5 * this.scale, 0),
                    new BABYLON.Vector3(0.5 * this.scale, -0.5 * this.scale, 0),
                    new BABYLON.Vector3(-0.5 * this.scale, -0.5 * this.scale, 0)], scene);
                lines.parent = this.mesh;
            }
            
            for (var i = 0; i < this.lines.length; ++i) {
                if (this.lines[i].visible) {
                    var line = BABYLON.Mesh.CreateLines("line" + i.toString(), this.lines[i].line, scene);
                    line.parent = this.mesh;
                }
            }

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
        scale: 1.0,
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
            this.cursor.y += nl * this.scale;
            this.cursor.x = 0;
        },
        NextColumn: function (v){
            var nl = v || 1;
            this.cursor.x += nl * this.scale;
            this.cursor.y = 0;
        }
    };
    
    List.prototype = new Element(null, null);
    List.prototype.constructor = List;

    function List(parent, onebyone, highlighted, shape, islinkedlist, scale) {
        this.elements = [];
        this.parent = parent;
        this.shape = shape || (this.parent !== null ? this.parent.shape : 'square');
        this.scale = scale || (parent !== null ? parent.scale : 1.0);
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
    
    List.prototype.Length = function (){
        return this.elements.length;
    }
    
    List.prototype.Add = function (n) {
        if (this.islinkedlist && this.elements.length > 0) {
            var a = new Arrow(this);
            a.origin.x -= 0.5 * this.scale;
            this.elements.push(a);
        }
        var e = new Element(n, this, false, this.shape, this.scale);
        this.elements.push(e);
        //this.parent.CalculatePosition(this.dimension);
    }
    
    List.prototype.AddRange = function (arr){
        for (var i = 0; i < arr.length; ++i) {
            this.Add(arr[i]);
        }
    }
    
    List.prototype.At = function (i){
        if (this.elements.length > 0) {
            var index = this.islinkedlist ? 2 * i : i;
            this.elements[index].highlightorder.push(++this.parent.predefinedshoworder);
            return this.elements[index];
        }
        return null;
    }
    
    List.prototype.translate = function (dx, dy, dz){
        for (var i = 0; i < this.elements.length; ++i) {
            this.elements[i].translate(dx, dy, dz);
        }
    }

    List.prototype.Draw = function (scene){
        this.mesh = null;
        //if (this.showorder !== null && this.showorder <= root.globalshoworder)
         {
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
           //             e.rotation = new BABYLON.Vector3(0, 0, 0); 
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
        if (this.shape === 'disc') {
            y = -y; z = -z;
        }
        this.rotation = { x: x, y: y, z: z };
        var ori = [[this.origin.x, this.origin.y, this.origin.z]];
        var c = rotate(ori, this.rotation.x, this.rotation.y, this.rotation.z);
        this.origin = { x: c[0][0], y: c[0][1], z: c[0][2] };
        for (var i = 0; i < this.elements.length; ++i) {
            this.elements[i].rotate(x, y, z);
        }
        ori = [[this.cursor.x, this.cursor.y, this.cursor.z]];
        c = rotate(ori, this.rotation.x, this.rotation.y, this.rotation.z);
        this.cursor = { x: c[0][0], y: c[0][1], z: c[0][2] };
    }

    Arrow.prototype = new Element(null, null);
    Arrow.prototype.constructor = Arrow;
    function Arrow(parent, scale){
        this.parent = parent || root;
        this.scale = scale || (this.parent !== null ? this.parent.scale : 1.0);
        this.origin = { x: this.parent.cursor.x, y: this.parent.cursor.y, z: this.parent.cursor.z };//arrow tail
        this.alignment = 'horizontal';
        this.dimension = { x: this.scale, y: this.scale, z: this.scale };
        this.vertices = [new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(this.scale, 0, 0),
            new BABYLON.Vector3(0.5 * this.scale, -0.375 * this.scale, 0),
            new BABYLON.Vector3(0.5 * this.scale, 0.375 * this.scale, 0)];
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
    
    Map.prototype = new Element(null, null);
    Map.prototype.constructor = Map;
    function Map(parent){
        this.parent = parent;
        this.lists = [];
        this.scale = this.parent !== null ? this.parent.scale : 1;
        this.origin = {
            x: this.parent !== null ? this.parent.cursor.x : 0, 
            y: this.parent !== null ? this.parent.cursor.y : 0, 
            z: this.parent !== null ? this.parent.cursor.z : 0
        };
        this.cursor = { x: 0, y: 0, z: 0 };
    }
    
    Map.prototype.Add = function (k, v) {
        var i = this.FindIndex(k);
        if (i < 0) {
            if (this.lists.length > 0) {
                this.NextLine();
            }
            
            var list = new List(this, false, false, 'disc', true, this.scale);
            this.lists.push(list);
            i = this.lists.length - 1;
            this.lists[i].Add(k);
            this.lists[i].elements[0].shape = 'square';
        }
        this.lists[i].Add(v);
    }
    
    Map.prototype.FindIndex = function (k) {
        for (var i = 0; i < this.lists.length; ++i) {
            if (this.lists[i].At(0).value === k) {
                return i;
            }
        }
        return -1;
    }
    
    Map.prototype.translate = function (dx, dy, dz){
        for (var i = 0; i < this.lists.length; ++i) {
            this.lists[i].translate(dx, dy, dz);
        }
    }
    
    Map.prototype.locate = function (x, y, z){
        var dx = x - this.origin.x;
        var dy = y - this.origin.y;
        var dz = z - this.origin.z;
        this.translate(dx, dy, dz);
    }

    Map.prototype.rotate = function (x, y, z){
        for (var i = 0; i < this.lists.length; ++i) {
            this.lists[i].rotate(x, y, z);
        }
    }

    Map.prototype.Draw = function (scene) {
        if (this.showorder !== null && this.showorder <= root.globalshoworder) {
            for (var i = 0; i < this.lists.length; ++i) {
                this.lists[i].Draw(scene);
            }
        }
    }    
    
    function TreeNode(x, y, v) {
        this.x = x;
        this.y = y;
        this.value = v;
        this.left = null;
        this.right = null;
        this.visible = false;
        this.highlightorders = [];
        this.element = null;
        this.parent = null;
        this.lines = [];
    }
    
    function BuildBinaryTree(l) {
        var h = parseInt(Math.pow(2, l) / 4);
        var a = [[]];
        for (var i = -h; i <= h; ++i) {
            if (l === 1 || i !== 0) {
                a[0].push(new TreeNode(i, 0, 0));
            }
        }
        for (var i = 0; i < h; ++i) {
            a.push([]);
            for (var j = 0; a[i].length > 1 && j < a[i].length / 2; ++j) {
                var n = new TreeNode(0, 0, 0);
                n.x = (a[i][2 * j].x + a[i][2 * j + 1].x) / 2;
                n.y = a[i][2 * j].y + 1;
                n.left = a[i][2 * j];
                n.right = a[i][2 * j + 1];
                n.left.parent = n;
                n.right.parent = n;
                n.value = (n.left.value + n.right.value) / 2;
                a[i + 1].push(n);
            }
        }
        return a[l - 1][0];
    }    
    
    BinaryTree.prototype = new Element(null, null);
    BinaryTree.prototype.constructor = BinaryTree;
    
    function BinaryTree(parent){
        this.parent = parent;
        this.root = null;
        this.scale = parent !== null ? parent.scale : 1.0;
        this.nodescale = 0.8;
    }
    
    BinaryTree.prototype.BuildPositionTree = function (l){
        var h = parseInt(Math.pow(2, l) / 4);
        var a = [[]];
        for (var i = -h; i <= h; ++i) {
            if (l === 1 || i !== 0) {
                var n = new TreeNode(i, 0, 0);
                a[0].push(n);
                n.element = new Element(n.value, this.parent, true, "disc", this.nodescale);
                n.highlightorders.push(++this.parent.predefinedshoworder);
                n.element.drawFrame = false;
                n.element.locate(n.x, n.y, 0);
            }
        }
        for (var i = 0; i < h; ++i) {
            a.push([]);
            for (var j = 0; a[i].length > 1 && j < a[i].length / 2; ++j) {
                var n = new TreeNode(0, 0, 0);
                n.x = (a[i][2 * j].x + a[i][2 * j + 1].x) / 2;
                n.y = a[i][2 * j].y + 1;
                n.left = a[i][2 * j];
                n.right = a[i][2 * j + 1];
                n.value = (n.left.value + n.right.value) / 2;
                n.left.parent = n;
                n.right.parent = n;
                n.element = new Element(n.value, this.parent, true, "disc", this.nodescale);
                n.highlightorders.push(++this.parent.predefinedshoworder);
                n.element.drawFrame = false;
                n.element.locate(n.x, n.y, 0);
                
                var temp = [n.left, n.right];
                for(var k = 0; k < temp.length; ++k)
                {
                    var x0 = 0, y0 = -0.5 * this.nodescale, x1 = temp[k].x - n.x, y1 = temp[k].y - n.y + 0.5 * this.nodescale;
                    n.element.lines.push({
                        visible: false, 
                        line: [new BABYLON.Vector3(x0, y0, 0), new BABYLON.Vector3(x1, y1, 0)]
                    });
                }

                a[i + 1].push(n);
            }
        }
        this.root = a[l - 1][0];
    }
    
    BinaryTree.prototype.PreOrderDraw = function (t, visible, scene) {
        if (null !== t && (visible === null || t.visible === visible)) {
            if (t.element.lines.length > 0) {
                var oldvisible0 = t.element.lines[0].visible;
                var oldvisible1 = t.element.lines[1].visible;
                if (visible === null) {
                    t.element.lines[0].visible = true;
                    t.element.lines[1].visible = true;
                }
            }
            
            t.element.Draw(scene);
            this.PreOrderDraw(t.left, visible, scene);
            this.PreOrderDraw(t.right, visible, scene);
        }
    }

    BinaryTree.prototype.DrawPositionTree = function (scene){
        this.PreOrderDraw(this.root, null, scene);
    }
    
    BinaryTree.prototype.Draw = function (scene){
        // In debug mode, only visible nodes will be drawn.
        this.PreOrderDraw(this.root, null, scene);
    }
    
    BinaryTree.prototype._insert = function (node, v){
        if (node !== null) {
            if (!node.visible) {
                node.value = v;
                node.visible = true;
                return node;
            } else if (node.left !== null && node.value > v) {
                this._insert(node.left, v);
            } else if (node.right !== null && node.value < v) {
                this._insert(node.right, v);
            }
        }
        return null;
    }

    BinaryTree.prototype.Insert = function (v){
        return this._insert(this.root, v);
    }
    
    BinaryTree.prototype._search = function (node, v){
        if (node !== null && node.visible) {
            if (node.value === v) {
                return node;
            }
            else if (node.value > v) {
                this._search(node.left, v);
            } else {
                this._search(node.right, v);
            }
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
    
    
    //testElement();
    //testArrow();
    //testList();
    //testBinarySearch();
    //testMap();
    testBinaryTreeBuildPosition();

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
        if (root.globalshoworder  <= root.predefinedshoworder) {
            if (total % 30 === 19) {
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
