function TreeNode(x, y, v){
    this.x = x;
    this.y = y;
    this.value = v;
    this.left = null;
    this.right = null;
}

function BuildBinaryTree(l){
    if (l == 1) {
        return new TreeNode(0, 0, 0);
    }
    var h = Math.pow(2, l) / 4;
    var a = [[]];
    for (var i = -h; i <= h; ++i) {
        if (i !== 0) {
            a[0].push(new TreeNode(i, l, 0));
        }
    }
    for (var i = 0; i < h; ++i) {
        a.push([]);
        for (var j = 0; a[i].length > 1 && j < a[i].length / 2; ++j) {
            var n = new TreeNode(0, 0, 0);
            console.log('i = ' + i + ', j = ' + j);
            n.x = (a[i][2 * j].x + a[i][2 * j + 1].x) / 2;
            n.y = a[i % 2][2 * j].y - 1;
            n.left = a[i][2 * j];
            n.right = a[i][2 * j + 1];
            n.value = (n.left.value + n.right.value) / 2;
            a[i + 1].push(n);
        }
    }
    return a[l - 1][0];
}

function BredthFirst(t){
    var a = [[], []];
    a[0].push(t);
    for (var i = 0; a[i % 2].length > 0; ++i) {
        a[(i + 1) % 2] = [];
        for (var j = 0; j < a[i % 2].length; ++j) {
            console.log(a[i % 2][j].x + ', ' + a[i % 2][j].y);
            if (a[i % 2][j].left !== null) {
                a[(i + 1) % 2].push(a[i % 2][j].left);
            }
            if (a[i % 2][j].right !== null) {
                a[(i + 1) % 2].push(a[i % 2][j].right);
            }
        }
        console.log('\n');
    }
}

var t = BuildBinaryTree(5);

BredthFirst(t);

console.log(t.x);