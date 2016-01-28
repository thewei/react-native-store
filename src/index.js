'use strict';

const Store = require('./store.js');
const store = new Store({
  dbName: 'react-native-store'
});

module.exports = store;
