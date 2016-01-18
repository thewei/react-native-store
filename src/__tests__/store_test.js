'use strict';
jest.dontMock('../model');
jest.dontMock('../store');
var astore = require.requireActual('./mockStorage.js');
jest.setMock('react-native', {AsyncStorage: astore});

describe('store Tests', function() {
  var Store;

  beforeEach(function() {
    var Store_ = require('../store');
    Store = new Store_({dbName: 'react-native-store'});
  });

  afterEach(function() {
    astore._forceClear();
  });

  pit('should create model', function() {
    var model;
    return Store.model('newModel')
      .then(resp => model = resp)
      .then(() => model.add({foo: 'bar'}))
      .then(astore.getAllKeys)
      .then(keys => {
        return expect(keys).toEqual(['react-native-store']);
      });
  });

  pit('should clear only react-native-store created keys', function() {
    astore.setItem('SomeOtherLibrary', 'Foobar');
    var model;
    return Store.model('newModel')
      .then(resp => model = resp)
      .then(() => model.add({foo: 'bar'}))
      .then(astore.getAllKeys)
      .then(keys => {
        return expect(keys).toEqual(['SomeOtherLibrary', 'react-native-store']);
      })
      .then(() => Store.clear())
      .then(astore.getAllKeys)
      .then(keys => {
        return expect(keys).toEqual(['SomeOtherLibrary']);
      });
  });


});
