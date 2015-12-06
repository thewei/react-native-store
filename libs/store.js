'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var React = require('react-native');
var Model = require('./model.js');
var Util = require('./util.js');

var AsyncStorage = React.AsyncStorage;

var Store = (function () {
    function Store(opts) {
        _classCallCheck(this, Store);

        this.dbName = opts.dbName;
    }

    _createClass(Store, [{
        key: 'model',
        value: function model(modelName) {
            return regeneratorRuntime.async(function model$(context$2$0) {
                var _this = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        return context$2$0.abrupt('return', new Promise(function callee$2$0(resolve, reject) {
                            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                                while (1) switch (context$3$0.prev = context$3$0.next) {
                                    case 0:
                                        context$3$0.prev = 0;
                                        return context$3$0.abrupt('return', resolve(new Model(modelName, this.dbName)));

                                    case 4:
                                        context$3$0.prev = 4;
                                        context$3$0.t0 = context$3$0['catch'](0);

                                        Util.error('ReactNativeStore error: ' + context$3$0.t0.message);

                                    case 7:
                                    case 'end':
                                        return context$3$0.stop();
                                }
                            }, null, _this, [[0, 4]]);
                        }));

                    case 1:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }

        // clear store
    }, {
        key: 'clear',
        value: function clear() {
            return regeneratorRuntime.async(function clear$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        context$2$0.next = 2;
                        return regeneratorRuntime.awrap(AsyncStorage.clear());

                    case 2:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }
    }]);

    return Store;
})();

module.exports = Store;

// Store.model("user").get({ id:1 },{fite}).then().fail();