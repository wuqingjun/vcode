var Number = function (v) {
    this.value = v;
}

var Period = function (numbers, numbere) {
    this.start = numbers;
    this.end = numbere;
}

var IntervalList = function () {
    this.periods = [];
    this.Search = function (objNumber) {
        var l = 0, h = this.periods.length - 1;
        while (l <= h) {
            var m = Math.floor((l + h) / 2);
            if (this.periods[m].start.value <= objNumber.value && this.periods[m].end.value >= objNumber.value) {
                return m;
            } else if (this.periods[m].start.value > objNumber.value) {
                h = m - 1;
            } else {
                l = m + 1;
            }
        }
        return (l + h) / 2;
    }
    
    this.AddInterval = function (objs, obje) {
        var ids = [this.Search(objs), this.Search(obje)];
        if (ids[0] === Math.ceil(ids[0])) {
            objs = this.periods[ids[0]].start;
        } else {
            ids[0] = Math.ceil(ids[0])
        }
        if (ids[1] === Math.ceil(ids[1])) {
            obje = this.periods[ids[1]].end;
            ids[1] = Math.ceil(ids[1]) + 1;
        } else {
            ids[1] = Math.ceil(ids[1]);
        }
        this.periods.splice(ids[0], ids[1] - ids[0], new Period(objs, obje));
    }
}

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

function rotate(origin, xangle, yangle, zangle) {
    var matrixX = [[1, 0, 0], [0, Math.cos(xangle), -Math.sin(xangle)], [0, Math.sin(xangle), Math.cos(xangle)]];
    var matrixY = [[Math.cos(yangle), 0, Math.sin(yangle)], [0, 1, 0], [-Math.sin(yangle), 0, Math.cos(yangle)]];
    var matrixZ = [[Math.cos(zangle), -Math.sin(zangle), 0], [Math.sin(zangle), Math.cos(zangle), 0], [0, 0, 1]];
    var cx = multiply(origin, matrixX);
    var cy = multiply(cx, matrixY);
    var cz = multiply(cy, matrixZ);
    return cz;
}

if (typeof module !== 'undefined' && module.exports ) {
    module.exports = {
        Number: Number,
        Period: Period,
        IntervalList: IntervalList,
        multiply: multiply,
        rotate: rotate
    };
}

