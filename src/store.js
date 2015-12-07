'use strict';

var React = require('react-native');
var Model = require('./model.js');
var Util = require('./util.js');

var {
    AsyncStorage
} = React;

class Store {

    constructor(opts) {
        this.dbName = opts.dbName;
    }

    async model(modelName) {
        return new Promise(async(resolve, reject) => {
            try {
                return resolve(new Model(modelName, this.dbName));
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });
    }

    // clear store
    async clear() {
        await AsyncStorage.clear();
    }

}

module.exports = Store;


// Store.model("user").get({ id:1 },{fite}).then().fail();