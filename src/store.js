'use strict';
var AsyncStorage = require('react-native').AsyncStorage;
var Model = require('./model.js');
var Util = require('./util.js');

class Store {

    constructor(opts) {
        this.dbName = opts.dbName;
    }

    async migrate() {
        var migrations = require('./migrations.js');
        var versionKey = `${this.dbName}_version`;
        await currentVerion = AsyncStorage.getItem(versionKey);
        var target = migrations.slice(-1)[0];
        if(currentVerion == target.version)
            return;
        for(let migration of migrations) {
            if(migration.version <= currentVerion)
                continue;
            migration.perform();
            await AsyncStorage.setItem(versionKey, migration.version);
        }
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
