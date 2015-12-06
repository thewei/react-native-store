'use strict';

var Store = require('./store.js');
var store = new Store({
    dbName: "react-native-store"
});

module.exports = store;