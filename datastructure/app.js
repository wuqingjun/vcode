var ds = require('./datastructures.js');
var test = require('unit.js');

var a = new ds.Number(2);
test.assert(a.value === 2);
var p = new ds.Period(new ds.Number(1), new ds.Number(5));
test.assert(p.start.value === 1);
test.assert(p.end.value === 5);

var b = new ds.Number(4);
var p2 = new ds.Period(a, b);
b.value = 5;
test.assert(p2.start === a);
test.assert(p2.end.value === 5);

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

intervals.AddInterval(new ds.Number(3), new ds.Number(5));
test.assert(intervals.periods.length === 3);
test.assert(intervals.periods[0].start.value === 1);
test.assert(intervals.periods[0].end.value === 7);

intervals.AddInterval(new ds.Number(0), new ds.Number(0));
test.assert(intervals.periods.length === 4);
test.assert(intervals.periods[0].start.value === 0);
test.assert(intervals.periods[0].end.value === 0);

intervals.AddInterval(new ds.Number(30), new ds.Number(50));
test.assert(intervals.periods.length === 5);
test.assert(intervals.periods[4].start.value === 30);
test.assert(intervals.periods[4].end.value === 50);

var num0 = new ds.Number(0);
var num90 = new ds.Number(90);
intervals.AddInterval(num0, num90);
test.assert(intervals.periods.length === 1);
test.assert(intervals.periods[0].start.value === 0);
test.assert(intervals.periods[0].end.value === 90);
test.assert(intervals.periods[0].start === num0);
test.assert(intervals.periods[0].end === num90);

console.log("Good Job! All unit test cases are successful!");