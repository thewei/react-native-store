'use strict';
var React = require('react-native');
var Util = require('./util.js');
var {
    AsyncStorage
} = React;

class Model {

    constructor(modelName, dbName) {
        this.dbName = dbName;
        this.modelName = modelName;
        this.offset = 0;
        this.limit = 10;
    }

    async createDatabase() {
        await AsyncStorage.setItem(this.dbName, JSON.stringify({}));
        return this.getDatabase();
    }

    async getDatabase() {

        return new Promise(async(resolve, reject) => {
            var database = await AsyncStorage.getItem(this.dbName);
            if (database) {
                resolve(Object.assign({}, JSON.parse(database)));
            } else {
                resolve(this.createDatabase());
            }
        });

    }

    async initModel() {
        this.database = await this.getDatabase();
        this.model = this.database[this.modelName] ? this.database[this.modelName] : {
            'totalrows': 0,
            'autoinc': 1,
            'rows': {}
        };
        this.database[this.modelName] = this.database[this.modelName] || this.model;
    }

    // add
    async add(data) {
        await this.initModel();
        return new Promise(async(resolve, reject) => {
            try {
                var autoinc = this.model.autoinc++;
                if (this.model.rows[autoinc]) {
                    return Util.error("ReactNativeStore error: Storage already contains _id '" + autoinc + "'");
                }
                if(data._id){
                    return Util.error("ReactNativeStore error: Don't need _id with add method");
                }
                data._id = autoinc;
                this.model.rows[autoinc] = data;
                this.model.totalrows++;

                this.database[this.modelName] = this.model;
                await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
                resolve(this.model.rows[data._id]);
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });
    }

    // update
    async update(data, filter) {
        await this.initModel();

        return new Promise(async(resolve, reject) => {
            try {
                var results = [];
                var rows = this.model["rows"];

                if (filter) {
                    for (var row in rows) {

                        for (var key in filter) {
                            if (rows[row][key] === filter[key]) {

                                for (var i in data) {
                                    rows[row][i] = data[i];
                                }

                                results.push(rows[row]);
                                this.database[this.modelName] = this.model;

                                await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));

                            }
                        }

                    }

                    results.length ? resolve(results) : resolve(null);

                } else {
                    resolve(null);
                }
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }

        });

    }

    // remove
    async remove(filter) {
        await this.initModel();
        return new Promise(async(resolve, reject) => {
            try {
                var results = [];
                var rows = this.model["rows"];
                if (filter) {
                    for (var row in rows) {
                        for (var key in filter) {
                            if (rows[row][key] === filter[key]) {
                                results.push(this.model["rows"][row]);
                                delete this.model["rows"][row];
                                this.model["totalrows"]--;
                                this.database[this.modelName] = this.model;
                                await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
                            }
                        }
                    }

                    results.length ? resolve(results) : resolve(null);
                } else {
                    Util.error('ReactNativeStore error: parmas is empty.');
                }
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });

    }

    // find
    async find(filter, parmas) {
        await this.initModel();
        return new Promise((resolve, reject) => {
            var results = [];
            var rows = this.model["rows"];
            var limit = (parmas && parmas.limit) || this.limit;
            var offset = (parmas && parmas.offset) || this.offset;

            if (filter) {
                for (var row in rows) {
                    var isMatch = false;
                    for (var key in filter) {
                        if (rows[row][key] == filter[key]) {
                            results.push(rows[row]);
                        }
                    }
                }
            } else {
                for (var row in rows) {
                    results.push(rows[row]);
                }
            }

            if (typeof(limit) === 'number') {
                resolve(results.slice(offset, limit + offset));
            } else {
                resolve(results);
            }

        });
    }

    // get
    get(filter, parmas) {
        parmas = parmas || {};
        parmas.limit = 1;
        return this.find(filter, parmas);
    }

}

module.exports = Model;
