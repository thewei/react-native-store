'use strict';
jest.dontMock('../filter.js');
jest.dontMock('../model.js');
var astore = require.requireActual('./mockStorage.js');
jest.setMock('react-native', {AsyncStorage: astore});

// To view log of any syncstorage calls, use inside code:
// console.log('set calls', astore.setItem.mock.calls)

describe('model Tests', function() {
  var Model;

  beforeEach(function() {
    var Model_ = require('../model.js');
    Model = new Model_('modelName', 'dbName');
  });

	afterEach(() => {
		astore._forceClear();
	});

  pit('should test create database', function() {
    return Model.getDatabase().then(resp => {
			expect(resp).toEqual({});
			expect(astore.getItem).toBeCalled();
			expect(astore.setItem).toBeCalledWith('dbName', '{}');
		});
  });

	pit('should add the data to AsyncStorage', function() {
		return Model.add({foo: 'bar'}).then(resp => {
			expect(resp).toEqual({_id: 1, foo: 'bar'});
			var dbJson = '{"modelName":{"totalrows":1,"autoinc":2,"rows":{"1":{"foo":"bar","_id":1}}}}';
			expect(astore.setItem).toBeCalledWith('dbName', dbJson);
		});
	});

	pit('should test findById', function() {
		return Model.findById(3).then(resp => {
			expect(resp).toEqual(null);
		});
	});

	pit('should destroy the model', function() {
		return Model.add({foo: 'bar'})
			.then(resp => {
				Model.destroy();
			})
			.then(resp => {
				expect(astore.removeItem).toBeCalledWith('dbName');
			});
	});

	pit('should update existing rows on filter', async () => {
		var testData = [
			{foo: 0, bar: 0, foobar: 'foobar'},
			{foo: 0, bar: 1, foobar: 'foobar'},
			{foo: 1, bar: 0, foobar: 'foo'},
			{foo: 1, bar: 1, foobar: 'foobar'},
		];
		await Model.multiAdd(testData);
		var resp = await Model.update(
			{foobar: 'bar'}, {where: {bar: 1}}
		);
		var expected = [
			{_id: 2, foo: 0, bar: 1, foobar: 'bar'},
			{_id: 4, foo: 1, bar: 1, foobar: 'bar'},
		];
		expect(resp).toEqual(expected);
		var dbJson = {"modelName":{"totalrows":4,"autoinc":5,"rows":{
			1: {"foo":0,"bar":0,"foobar":"foobar","_id":1},
			2: {"foo":0,"bar":1,"foobar":"bar","_id":2},
			3: {"foo":1,"bar":0,"foobar":"foo","_id":3},
			4: {"foo":1,"bar":1,"foobar":"bar","_id":4}
		}}};
		expect(astore.setItem).toBeCalledWith('dbName', JSON.stringify(dbJson));
	});

	pit('should update row with given id', async () => {
		var testData = [
			{foo: 0, bar: 0, foobar: 'foobar'},
			{foo: 0, bar: 1, foobar: 'foobar'},
			{foo: 1, bar: 0, foobar: 'foo'},
			{foo: 1, bar: 1, foobar: 'foobar'},
		];
		await Model.multiAdd(testData);
		var resp = await Model.updateById({foobar: 'barfoo'}, 2);
		var expected = { _id: 2, foo: 0, bar: 1, foobar: 'barfoo'};
		expect(resp).toEqual(expected);
	});

	pit('should remove rows based on filter', async() => {
		var testData = [
			{foo: 0, bar: 0, foobar: 'foobar'},
			{foo: 0, bar: 1, foobar: 'foobar'},
			{foo: 1, bar: 0, foobar: 'foo'},
			{foo: 1, bar: 1, foobar: 'foobar'},
		];
		await Model.multiAdd(testData);
		astore.setItem.mockClear();
		var resp = await Model.remove({where: {foo: 1}});
		var dbJson = {"modelName":{"totalrows":2,"autoinc":5,"rows":{
			1: {"foo":0,"bar":0,"foobar":"foobar","_id":1},
			2: {"foo":0,"bar":1,"foobar":"foobar","_id":2},
		}}};
		expect(astore.setItem).toBeCalledWith('dbName', JSON.stringify(dbJson));
	});

	pit('should remove rows based on id', async() => {
		var testData = [
			{foo: 0, bar: 0, foobar: 'foobar'},
			{foo: 0, bar: 1, foobar: 'foobar'},
			{foo: 1, bar: 0, foobar: 'foo'},
			{foo: 1, bar: 1, foobar: 'foobar'},
		];
		await Model.multiAdd(testData);
		astore.setItem.mockClear();
		var resp = await Model.removeById(1);
		var dbJson = {"modelName":{"totalrows":3,"autoinc":5,"rows":{
			2: {"foo":0,"bar":1,"foobar":"foobar","_id":2},
			3: {"foo":1,"bar":0,"foobar":"foo","_id":3},
			4: {"foo":1,"bar":1,"foobar":"foobar","_id":4}
		}}};
		expect(astore.setItem).toBeCalledWith('dbName', JSON.stringify(dbJson));
	});

});
