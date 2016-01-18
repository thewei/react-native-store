'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var Model = require('./model.js');
var Util = require('./util.js');

class Store {

    constructor(opts) {
        this.dbName = opts.dbName;
    }

    async model(modelName) {
        var me = this;
        return new Promise(async(resolve, reject) => {
            try {
                return resolve(new Model(modelName, me.dbName));
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });
    }

    // clear store
    async clear() {
        await AsyncStorage.removeItem(this.dbName);
    }

}

module.exports = Store;

// Store.model("user").get({ id:1 },{fite}).then().fail();
