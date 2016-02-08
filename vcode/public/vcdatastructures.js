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
        this.showorder = new IntervalList(); //increaseshoworder !== false ? ++root.predefinedshoworder : root.predefinedshoworder;
        this.showorder.AddInterval(new Number(0), new Number(root.predefinedshoworder));
        if (increaseshoworder) {
            ++root.predefinedshoworder;
        }
        this.origin = {
            x: this.parent === null ? 0 : this.parent.cursor.x, 
            y: this.parent === null ? 0 : this.parent.cursor.y, 
            z: this.parent === null ? 0 : this.parent.cursor.z
        };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.CalculatePosition({ x: 0, y: 0, z: 0 });
    }
    
    Element.prototype.rotate = function (x, y, z) {
        this.rotation = { x: x, y: y, z: z };
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
    
    Element.prototype.CalculatePosition = function (childdimension) {
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
        var i = this.showorder.Search(new Number(root.globalshoworder));
        if (i === Math.ceil(i)) {
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
        dimension: { x: 0, y: 0, z: 0 },
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
        NextLine: function (v) {
            var nl = v || 1;
            this.cursor.y += nl * this.scale;
            this.cursor.x = 0;
        },
        NextColumn: function (v) {
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
        this.showorder = parent !== null ? ++parent.predefinedshoworder : 0;
        this.dimension = { x: 0, y: 0, z: 0 };
        this.alignment = 'horizontal', // 'vertical', 'diagonal'
        this.origin = {
            x: this.parent !== null ? this.parent.cursor.x : 0, 
            y: this.parent !== null ? this.parent.cursor.y : 0, 
            z: this.parent !== null ? this.parent.cursor.z : 0
        };
        this.cursor = { x: 0, y: 0, z: 0 };
    }
    
    List.prototype.Length = function () {
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
    
    List.prototype.AddRange = function (arr) {
        for (var i = 0; i < arr.length; ++i) {
            this.Add(arr[i]);
        }
    }
    
    List.prototype.At = function (i) {
        if (this.elements.length > 0) {
            var index = this.islinkedlist ? 2 * i : i;
            this.elements[index].highlightorder.push(++this.parent.predefinedshoworder);
            return this.elements[index];
        }
        return null;
    }
    
    List.prototype.translate = function (dx, dy, dz) {
        for (var i = 0; i < this.elements.length; ++i) {
            this.elements[i].translate(dx, dy, dz);
        }
    }
    
    List.prototype.Draw = function (scene) {
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
    function Arrow(parent, scale) {
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
    
    Arrow.prototype.rotate = function (x, y, z) {
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
    
    Arrow.prototype.Draw = function (scene) {
        this.mesh = BABYLON.Mesh.CreateLines('arrow', 
            [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[1], this.vertices[3], this.vertices[1]], scene);
        this.mesh.position.x = this.origin.x;
        this.mesh.position.y = this.origin.y;
        this.mesh.position.z = this.origin.z;
        return this.mesh;
    }
    
    Map.prototype = new Element(null, null);
    Map.prototype.constructor = Map;
    function Map(parent) {
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
    
    Map.prototype.translate = function (dx, dy, dz) {
        for (var i = 0; i < this.lists.length; ++i) {
            this.lists[i].translate(dx, dy, dz);
        }
    }
    
    Map.prototype.locate = function (x, y, z) {
        var dx = x - this.origin.x;
        var dy = y - this.origin.y;
        var dz = z - this.origin.z;
        this.translate(dx, dy, dz);
    }
    
    Map.prototype.rotate = function (x, y, z) {
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
        this.debug = false;
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
    
    function BinaryTree(parent) {
        this.parent = parent;
        this.root = null;
        this.scale = parent !== null ? parent.scale : 1.0;
        this.nodescale = 0.8;
    }
    
    BinaryTree.prototype.BuildPositionTree = function (l) {
        var h = parseInt(Math.pow(2, l) / 4);
        var a = [[]];
        for (var i = -h; i <= h; ++i) {
            if (l === 1 || i !== 0) {
                var n = new TreeNode(i, 0, 0);
                a[0].push(n);
                n.element = new Element(n.value, this.parent, false, "disc", this.nodescale);
                //n.highlightorders.push(this.parent.predefinedshoworder);
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
                n.element = new Element(n.value, this.parent, false, "disc", this.nodescale);
                //n.highlightorders.push(this.parent.predefinedshoworder);
                n.element.drawFrame = false;
                n.element.locate(n.x, n.y, 0);
                
                var temp = [n.left, n.right];
                for (var k = 0; k < temp.length; ++k) {
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
            var oldvisible = 0, oldvisible0 = null, oldvisible1 = null;
            if (this.debug) {
                t.visible = true;
            }
            if (t.element.lines.length > 0 && this.debug === true) {
                var oldvisible0 = t.element.lines[0].visible;
                var oldvisible1 = t.element.lines[1].visible;
                t.element.lines[0].visible = true;
                t.element.lines[1].visible = true;
            }
            
            if (t.visible) {
                t.element.Draw(scene);
            }
            
            this.PreOrderDraw(t.left, visible, scene);
            this.PreOrderDraw(t.right, visible, scene);
            if (oldvisible !== null) {
                t.visible = oldvisible;
            }
            if (oldvisible0 !== null) {
                t.element.lines[0].visible = oldvisible0;
            }
            if (oldvisible1 !== null) {
                t.element.lines[1].visible = oldvisible1;
            }
        }
    }
    
    BinaryTree.prototype.DrawPositionTree = function (scene) {
        this.PreOrderDraw(this.root, null, scene);
    }
    
    BinaryTree.prototype.Debug = function (dbg) {
        this.debug = dbg;
    }
    
    BinaryTree.prototype.Draw = function (scene) {
        // In debug mode, only visible nodes will be drawn.
        //this.DrawPositionTree(scene);
        this.PreOrderDraw(this.root, true, scene);
    }
    
    BinaryTree.prototype._insert = function (node, v) {
        if (node !== null) {
            if (!node.visible) {
                node.value = v;
                node.visible = true;
                node.element.showorder = ++root.predefinedshoworder;
                node.element.highlightorder.push(++this.parent.predefinedshoworder);
                if (node.parent !== null && node.parent.visible) {
                    for (var i = 0; i < node.lines.length; ++i) {
                        node.element.lines[0].visible = true;
                    }
                }
                return node;
            } else if (node.left !== null && node.value > v) {
                this._insert(node.left, v);
            } else if (node.right !== null && node.value < v) {
                this._insert(node.right, v);
            }
        }
        return null;
    }
    
    BinaryTree.prototype.Insert = function (v) {
        return this._insert(this.root, v);
    }
    
    BinaryTree.prototype._search = function (node, v) {
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