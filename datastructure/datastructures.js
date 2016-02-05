
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
            var nums = [objs, obje];
            var ids = [this.Search(objs), this.Search(obje)];
            if (ids[0] === this.period.length) {
                this.periods.push(new ds.Period(objs, obje));
            } 
            if (ids[1] < 0) {
                this.periods.unshift(new ds.Period(objs, obje));
            }

            /// to be continued!
        }
    }

};

