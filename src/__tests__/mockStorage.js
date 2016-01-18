"use strict";
var cache = {};
var mock = {
    setItem: jest.genMockFunction().mockImplementation((key, value) => {
        return new Promise((resolve, reject) => {
            resolve(cache[key] = value);
        });
    }),
    getItem: jest.genMockFunction().mockImplementation(key => {
        return new Promise((resolve, reject) => {
            if (cache.hasOwnProperty(key))
                resolve(cache[key]);
            resolve('');
        });
    }),
    removeItem: jest.genMockFunction().mockImplementation(key => {
        return new Promise((resolve, reject) => {
            if (cache.hasOwnProperty(key))
                resolve(delete cache[key]);
            reject('No such item!');
        });
    }),
    clear: jest.genMockFunction().mockImplementation(() => {
        return new Promise((resolve, reject) => {
            resolve(cache = {});
        });
    }),
    _forceClear() {
        cache = {};
    }
};

module.exports = mock;
