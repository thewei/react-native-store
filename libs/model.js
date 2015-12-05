'use strict';
var React = require('react-native');
var Util = require('./util.js');
var Filter = require('./filter.js')
var {
    AsyncStorage
} = React;

class Model {

    constructor(modelName, dbName) {
        this.dbName = dbName;
        this.modelName = modelName;
        this.offset = 0;
        this.limit = 10;
        this.modelFilter = new Filter();
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
        filter = filter || {};
        if(data._id)
            delete data._id;
        return new Promise(async(resolve, reject) => {
            try {
                var results = [];
                var rows = this.model["rows"];
                var filterResult = this.modelFilter.apply(rows, filter) 
                for (var row in rows) {
                    for (var element in filterResult) {
                        if (rows[row]['_id'] === filterResult[element]['_id']) {
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
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });
    }

    // remove a single entry by id
    async updateById(data, id) {
        var result = await this.update(data, {
            where: {
                _id: id
            }
        });
        return result.pop();
    }

    // remove
    async remove(filter) {
        await this.initModel();
        filter = filter || {};
        return new Promise(async(resolve, reject) => {
            try {
                var results = [];
                var rowsToDelete = [];
                var rows = this.model["rows"];
                var filterResult = this.modelFilter.apply(rows, filter) 
                for (var row in rows) {
                    for (var element in filterResult) {
                        if (rows[row]['_id'] === filterResult[element]['_id'])
                            rowsToDelete.push(row);
                    }
                }
                for(var i in rowsToDelete) {
                    var row = rowsToDelete[i];
                    results.push(this.model["rows"][row]);
                    delete this.model["rows"][row];
                    this.model["totalrows"]--;
                }
                this.database[this.modelName] = this.model;
                await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
                results.length ? resolve(results) : resolve(null);
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });
    }


    // remove a single entry by id
    async removeById(id) {
        var result = await this.remove({
            where: {
                _id: id
            }
        });
        return result.pop();
    }

    // find
    async find(filter) {
        await this.initModel();
        filter = filter || {};
        return new Promise((resolve, reject) => {
            var results = [];
            var rows = this.model["rows"];
            results = this.modelFilter.apply(rows, filter);
            results.length ? resolve(results) : resolve(null);
        });
    }

    // find a single entry by id
    async findById(id) {
        var result = await this.find({
            where: {
                _id: id
            }
        });
        return result.pop();
    }

    // get
    get(filter) {
        filter = filter || {};
        filter.limit = 1;
        return this.find(filter);
    }
}

module.exports = Model;
