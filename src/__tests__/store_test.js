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
        var model = Store.model('newModel');
        return model.add({foo: 'bar'})
            .then(() => astore.getAllKeys())
            .then(keys => {
                return expect(keys).toEqual(['react-native-store']);
            });
    });

    pit('should clear only react-native-store created keys', function() {
        astore.setItem('SomeOtherLibrary', 'Foobar');
        var model = Store.model('newModel');
        return model.add({foo: 'bar'})
            .then(() => astore.getAllKeys())
            .then(keys => {
                return expect(keys).toEqual(['SomeOtherLibrary', 'react-native-store']);
            })
            .then(() => Store.clear())
            .then(astore.getAllKeys)
            .then(keys => {
                return expect(keys).toEqual(['SomeOtherLibrary']);
            });
    });

    pit('should run migrations', function() {
        var migrations = require('../migrations');
        migrations.push({
            version: 0.2,
            perform: jest.genMockFunction()
        });
        return Store.migrate().then(() => {
            expect(migrations[0].perform).toBeCalled();
        });
    });

    pit('should run partial migrations', function() {
        var migrations = require('../migrations');
        migrations.push({
            version: 0.2,
            perform: jest.genMockFunction()
        });
        migrations.push({
            version: 0.3,
            perform: jest.genMockFunction()
        });
        astore.setItem('react-native-store_version', '0.2');
        return Store.migrate().then(() => {
            expect(migrations[0].perform).not.toBeCalled();
            expect(migrations[1].perform).toBeCalled();
        });
    });

    pit('should not run migrations', function() {
        var migrations = require('../migrations');
        migrations.push({
            version: 0.2,
            perform: jest.genMockFunction()
        });
        migrations.push({
            version: 0.3,
            perform: jest.genMockFunction()
        });
        astore.setItem('react-native-store_version', '0.3');
        return Store.migrate().then(() => {
            expect(migrations[0].perform).not.toBeCalled();
            expect(migrations[1].perform).not.toBeCalled();
        });
    });

});
