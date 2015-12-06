'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var React = require('react-native');
var Util = require('./util.js');
var Filter = require('./filter.js');
var AsyncStorage = React.AsyncStorage;

var Model = (function () {
    function Model(modelName, dbName) {
        _classCallCheck(this, Model);

        this.dbName = dbName;
        this.modelName = modelName;
        this.offset = 0;
        this.limit = 10;
        this.modelFilter = new Filter();
    }

    _createClass(Model, [{
        key: 'createDatabase',
        value: function createDatabase() {
            return regeneratorRuntime.async(function createDatabase$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(AsyncStorage.setItem(this.dbName, JSON.stringify({})));

                    case 2:
                        return context$2$0.abrupt('return', this.getDatabase());

                    case 3:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }
    }, {
        key: 'getDatabase',
        value: function getDatabase() {
            return regeneratorRuntime.async(function getDatabase$(context$2$0) {
                var _this = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            var database;
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        context$3$0.next = 2;
                                        return regeneratorRuntime.awrap(AsyncStorage.getItem(this.dbName));

                                    case 2:
                                        database = context$3$0.sent;

                                        if (database) {
                                            resolve(Object.assign({}, JSON.parse(database)));
                                        } else {
                                            resolve(this.createDatabase());
                                        }

                                    case 4:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this);
                        }));

                    case 1:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }
    }, {
        key: 'initModel',
        value: function initModel() {
            return regeneratorRuntime.async(function initModel$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.getDatabase());

                    case 2:
                        this.database = context$2$0.sent;

                        this.model = this.database[this.modelName] ? this.database[this.modelName] : {
                            'totalrows': 0,
                            'autoinc': 1,
                            'rows': {}
                        };
                        this.database[this.modelName] = this.database[this.modelName] || this.model;

                    case 5:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        //destroy
    }, {
        key: 'destroy',
        value: function destroy() {
            return regeneratorRuntime.async(function destroy$(context$2$0) {
                var _this2 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            var database;
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        context$3$0.next = 2;
                                        return regeneratorRuntime.awrap(AsyncStorage.getItem(this.dbName));

                                    case 2:
                                        database = context$3$0.sent;

                                        if (!database) {
                                            context$3$0.next = 9;
                                            break;
                                        }

                                        context$3$0.next = 6;
                                        return regeneratorRuntime.awrap(AsyncStorage.removeItem(this.dbName));

                                    case 6:
                                        context$3$0.t0 = context$3$0.sent;
                                        context$3$0.next = 10;
                                        break;

                                    case 9:
                                        context$3$0.t0 = null;

                                    case 10:
                                        context$3$0.t1 = context$3$0.t0;
                                        resolve(context$3$0.t1);

                                    case 12:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this2);
                        }));

                    case 1:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // add
    }, {
        key: 'add',
        value: function add(data) {
            return regeneratorRuntime.async(function add$(context$2$0) {
                var _this3 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.initModel());

                    case 2:
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            var autoinc;
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        context$3$0.prev = 0;
                                        autoinc = this.model.autoinc++;

                                        if (!this.model.rows[autoinc]) {
                                            context$3$0.next = 4;
                                            break;
                                        }

                                        return context$3$0.abrupt('return', Util.error("ReactNativeStore error: Storage already contains _id '" + autoinc + "'"));

                                    case 4:
                                        if (!data._id) {
                                            context$3$0.next = 6;
                                            break;
                                        }

                                        return context$3$0.abrupt('return', Util.error("ReactNativeStore error: Don't need _id with add method"));

                                    case 6:
                                        data._id = autoinc;
                                        this.model.rows[autoinc] = data;
                                        this.model.totalrows++;
                                        this.database[this.modelName] = this.model;
                                        context$3$0.next = 12;
                                        return regeneratorRuntime.awrap(AsyncStorage.setItem(this.dbName, JSON.stringify(this.database)));

                                    case 12:
                                        resolve(this.model.rows[data._id]);
                                        context$3$0.next = 18;
                                        break;

                                    case 15:
                                        context$3$0.prev = 15;
                                        context$3$0.t0 = context$3$0['catch'](0);

                                        Util.error('ReactNativeStore error: ' + context$3$0.t0.message);

                                    case 18:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this3, [[0, 15]]);
                        }));

                    case 3:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // update
    }, {
        key: 'update',
        value: function update(data, filter) {
            return regeneratorRuntime.async(function update$(context$2$0) {
                var _this4 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.initModel());

                    case 2:
                        filter = filter || {};
                        if (data._id) delete data._id;
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            var results, rows, filterResult, row, element, i;
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        context$3$0.prev = 0;
                                        results = [];
                                        rows = this.model["rows"];
                                        filterResult = this.modelFilter.apply(rows, filter);
                                        context$3$0.t0 = regeneratorRuntime.keys(rows);

                                    case 5:
                                        if ((context$3$0.t1 = context$3$0.t0()).done) {
                                            context$3$0.next = 20;
                                            break;
                                        }

                                        row = context$3$0.t1.value;
                                        context$3$0.t2 = regeneratorRuntime.keys(filterResult);

                                    case 8:
                                        if ((context$3$0.t3 = context$3$0.t2()).done) {
                                            context$3$0.next = 18;
                                            break;
                                        }

                                        element = context$3$0.t3.value;

                                        if (!(rows[row]['_id'] === filterResult[element]['_id'])) {
                                            context$3$0.next = 16;
                                            break;
                                        }

                                        for (i in data) {
                                            rows[row][i] = data[i];
                                        }
                                        results.push(rows[row]);
                                        this.database[this.modelName] = this.model;
                                        context$3$0.next = 16;
                                        return regeneratorRuntime.awrap(AsyncStorage.setItem(this.dbName, JSON.stringify(this.database)));

                                    case 16:
                                        context$3$0.next = 8;
                                        break;

                                    case 18:
                                        context$3$0.next = 5;
                                        break;

                                    case 20:
                                        results.length ? resolve(results) : resolve(null);
                                        context$3$0.next = 26;
                                        break;

                                    case 23:
                                        context$3$0.prev = 23;
                                        context$3$0.t4 = context$3$0['catch'](0);

                                        Util.error('ReactNativeStore error: ' + context$3$0.t4.message);

                                    case 26:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this4, [[0, 23]]);
                        }));

                    case 5:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // remove a single entry by id
    }, {
        key: 'updateById',
        value: function updateById(data, id) {
            var result;
            return regeneratorRuntime.async(function updateById$(context$2$0) {
                var _this5 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.update(data, {
                            where: {
                                _id: id
                            }
                        }));

                    case 2:
                        result = context$2$0.sent;
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        if (result) {
                                            resolve(result[0]);
                                        } else {
                                            resolve(null);
                                        }

                                    case 1:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this5);
                        }));

                    case 4:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // remove
    }, {
        key: 'remove',
        value: function remove(filter) {
            return regeneratorRuntime.async(function remove$(context$2$0) {
                var _this6 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.initModel());

                    case 2:
                        filter = filter || {};
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            var results, rowsToDelete, rows, filterResult, row, element, i;
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        context$3$0.prev = 0;
                                        results = [];
                                        rowsToDelete = [];
                                        rows = this.model["rows"];
                                        filterResult = this.modelFilter.apply(rows, filter);

                                        for (row in rows) {
                                            for (element in filterResult) {
                                                if (rows[row]['_id'] === filterResult[element]['_id']) rowsToDelete.push(row);
                                            }
                                        }
                                        for (i in rowsToDelete) {
                                            row = rowsToDelete[i];

                                            results.push(this.model["rows"][row]);
                                            delete this.model["rows"][row];
                                            this.model["totalrows"]--;
                                        }
                                        this.database[this.modelName] = this.model;
                                        context$3$0.next = 10;
                                        return regeneratorRuntime.awrap(AsyncStorage.setItem(this.dbName, JSON.stringify(this.database)));

                                    case 10:
                                        results.length ? resolve(results) : resolve(null);
                                        context$3$0.next = 16;
                                        break;

                                    case 13:
                                        context$3$0.prev = 13;
                                        context$3$0.t0 = context$3$0['catch'](0);

                                        Util.error('ReactNativeStore error: ' + context$3$0.t0.message);

                                    case 16:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this6, [[0, 13]]);
                        }));

                    case 4:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // remove a single entry by id
    }, {
        key: 'removeById',
        value: function removeById(id) {
            var result;
            return regeneratorRuntime.async(function removeById$(context$2$0) {
                var _this7 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.remove({
                            where: {
                                _id: id
                            }
                        }));

                    case 2:
                        result = context$2$0.sent;
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        if (result) {
                                            resolve(result[0]);
                                        } else {
                                            resolve(null);
                                        }

                                    case 1:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this7);
                        }));

                    case 4:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // find
    }, {
        key: 'find',
        value: function find(filter) {
            return regeneratorRuntime.async(function find$(context$2$0) {
                var _this8 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.initModel());

                    case 2:
                        filter = filter || {};
                        return context$2$0.abrupt('return', new Promise(function (resolve, reject) {
                            var results = [];
                            var rows = _this8.model["rows"];
                            results = _this8.modelFilter.apply(rows, filter);
                            results.length ? resolve(results) : resolve(null);
                        }));

                    case 4:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // find a single entry by id
    }, {
        key: 'findById',
        value: function findById(id) {
            var result;
            return regeneratorRuntime.async(function findById$(context$2$0) {
                var _this9 = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(this.find({
                            where: {
                                _id: id
                            }
                        }));

                    case 2:
                        result = context$2$0.sent;
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        if (result) {
                                            resolve(result[0]);
                                        } else {
                                            resolve(null);
                                        }

                                    case 1:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this9);
                        }));

                    case 4:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // get
    }, {
        key: 'get',
        value: function get(filter) {
            filter = filter || {};
            filter.limit = 1;
            return this.find(filter);
        }
    }]);

    return Model;
})();

module.exports = Model;