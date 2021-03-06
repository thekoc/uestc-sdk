// 外部依赖

var _ = require('lodash');

var Exam = require('./exam');
var Fixtures = require('../utils/fixtures');
var Score = require('./score');

// 构造函数

function Course(id) {
    this.id = id;
    this.durations = [];
    this.semester = [0, 0, 0];
}

module.exports = Course;


// 静态字段


// 静态方法

Course.merge = function (courses0, courses1) {
    var res = {};
    _.forEach(courses0, function (course) {
        res[course.id] = course;
    });
    _.forEach(courses1, function (course) {
        if (!res[course.id]) {
            res[course.id] = course;
        }
        else {
            res[course.id].__merge__(course)
        }
    });
    return _.values(res);
};


// 实例方法


// 非公开方法

Course.prototype.__dummy__ = function () {
    var self = this;
    var res = _.cloneDeep(self);
    delete res.exam;
    delete res.score;
    return res;
};

Course.prototype.__merge__ = function (course) {
    var self = this;
    _.forEach(course, function (val, field) {
        self.__setField__(field, val);
    });
    return self;
};

Course.prototype.__setField__ = function (field, val) {
    var self = this;
    if (val === undefined || val != val || val === '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'id':
            break;
        case 'title':
        case 'code':
        case 'instructor':
        case 'campus':
            self[field] = val;
            break;
        case 'credit':
            self[field] = +val;
            break;
        case 'type':
            if (_.some(Fixtures.courseTypes, function (value) {
                    return val == value;
                })) {
                self[field] = val;
            }
            break;
        case 'department':
            if (_.some(Fixtures.departments, function (value) {
                    return val == value;
                })) {
                self[field] = val;
            }
            break;
        case 'durations':
            self[field] = val;
            break;
        case 'semester':
            if (val.length === 3) {
                self[field] = val;
            }
            break;
        case 'grade':
            self['semester'][0] = +val;
            self['semester'][1] = val > 0 ? val + 1 : 0;
            break;
        case 'score':
            if (val instanceof Score) {
                this[field] = val;
            }
            break;
        case 'exam':
            if (val instanceof Exam) {
                self[field] = val;
            }
            break;
    }
};
