'use strict';

var AsyncStorage = require('react-native').AsyncStorage;
var Model = require('./model.js');
var Util = require('./util.js');

class Store {

    constructor(opts) {
        this.dbName = opts.dbName;
    }

    async _getCurrentVersion(versionKey) {
        var currentVersion = await AsyncStorage.getItem(versionKey);
        currentVersion = currentVersion || 0;
        return parseFloat(currentVersion);
    }

    async migrate() {
        var migrations = require('./migrations.js');
        var versionKey = `${this.dbName}_version`;
        var currentVersion = await this._getCurrentVersion(versionKey);
        var target = migrations.slice(-1)[0];
        if(currentVersion == target.version)
            return;
        for(let migration of migrations) {
            if(migration.version <= currentVersion)
                continue;
            migration.perform();
            await AsyncStorage.setItem(versionKey, migration.version.toString());
        }
    }

    model(modelName) {
        return new Model(modelName, this.dbName);
    }

    // clear store
    async clear() {
        await AsyncStorage.removeItem(this.dbName);
    }

}

module.exports = Store;


// Store.model("user").get({ id:1 },{fite}).then().fail();
