var ds = require('./datastructures.js');
var test = require('unit.js');

var a = new ds.Number(2);
test.assert(a.value === 2);
var p = new ds.Period(new ds.Number(1), new ds.Number(5));
test.assert(p.start.value === 1);
test.assert(p.end.value === 5);

var intervals = new ds.IntervalList();
intervals.periods.push(new ds.Period(new ds.Number(1), new ds.Number(3)));
intervals.periods.push(new ds.Period(new ds.Number(4), new ds.Number(7)));
intervals.periods.push(new ds.Period(new ds.Number(10), new ds.Number(11)));
intervals.periods.push(new ds.Period(new ds.Number(16), new ds.Number(23)));

var i = intervals.Search(new ds.Number(8));
test.assert(i === 3 / 2)
i = intervals.Search(new ds.Number(6));
test.assert(i === 1);

i = intervals.Search(new ds.Number(0));
test.assert(i === -1 / 2);

i = intervals.Search(new ds.Number(30));
test.assert(i === 7 / 2);


console.log(Math.floor(3.5));