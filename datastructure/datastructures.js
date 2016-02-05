
module.exports = {
    Number : function(v) {
        this.value = v;
    },

    Period: function(numbers, numbere) {
        this.start = numbers;
        this.end = numbere;
    },

    IntervalList: function () {
        this.periods = [];
        this.Search = function (objNumber){
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
            var ids = [-1, -1];
            var nums = [objs, obje];
            
            for (var l = 0; l < this.periods.length; ++l) {
                for (var k = 0; k < 2; ++k) {
                    if (this.periods[l].start.value <= nums[k].value) {
                        ids[k] = l + (this.periods[l].end.value < nums[k].value ? 1 : 0);
                    }
                }
            }
            if (ids[0] < 0 && ids[1] < 0) {
                this.periods.unshift(new Period(objs, obje));
            } else if (ids[0] === this.periods.length && ids[1] === this.periods.length) {
                this.periods.push(new Period(objs, obje));
            } else if (ids[0] < 0 && ids[1] === this.periods.length) {
                this.periods.splice(0, ids[1]);
                this.periods = [new Period(objs, obje)];
            } else if (ids[0] < 0 && ids[1] < this.periods.length) {
                this.periods.splice(0, ids[1]);
                this.periods[0].start = objs;
            } else if (ids[0] >= 0 && ids[1] === this.periods.length) {
                this.periods.splice(ids[0] + 1);
                this.periods[ids[0]].end = obje;
            } else {
                this.periods[ids[0]].end = this.periods[ids[1]].end;
                this.periods.splice(ids[0] + 1, ids[1] - ids[0]);
            }
        }
    }

};

