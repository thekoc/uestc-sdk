// 外部依赖

var _ = require('lodash');
var async = require('async');
var later = require('later');


// 构造函数

function Keeper() {
}

module.exports = Keeper;


// 静态字段

Keeper.queue = Keeper.queue || {};

Keeper.now = Keeper.now || null;


// 静态方法

Keeper.addTask = function (flag, task) {
    Keeper.queue[flag] = task;
};

Keeper.removeTask = function (flag) {
    delete Keeper.queue[flag];
};

Keeper.start = function () {
    var mission = function () {
        async.series(Keeper.queue, function (err, results) {
            err? console.log('Async mission failed because of ' + err): console.log('Async mission success');
        });
    };

    if (Keeper.now) {
        Keeper.now.clear();
    }

    var sched = later.parse.recur().every(10).minute();
    Keeper.now = later.setInterval(mission, sched);
};

Keeper.stop = function () {
    if (Keeper.now) {
        Keeper.now.clear();
        Keeper.now = null;
    }
};