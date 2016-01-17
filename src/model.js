'use strict';
var AsyncStorage = require('react-native').AsyncStorage;
var Util = require('./util.js');
var Filter = require('./filter.js')

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
        var me = this;
        return new Promise(async(resolve, reject) => {
            var database = await AsyncStorage.getItem(me.dbName);
            if (database) {
                resolve(Object.assign({}, JSON.parse(database)));
            } else {
                resolve(me.createDatabase());
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

    //destroy
    async destroy() {
        var me = this;
        return new Promise(async(resolve, reject) => {
            var database = await AsyncStorage.getItem(me.dbName);
            resolve( database?await AsyncStorage.removeItem(me.dbName):null );
        });
    }

    // add
    async add(data) {
        var me = this;
        await this.initModel();
        return new Promise(async(resolve, reject) => {
            try {
                var autoinc = me.model.autoinc++;
                if (me.model.rows[autoinc]) {
                    return Util.error("ReactNativeStore error: Storage already contains _id '" + autoinc + "'");
                }
                if(data._id){
                    return Util.error("ReactNativeStore error: Don't need _id with add method");
                }
                data._id = autoinc;
                me.model.rows[autoinc] = data;
                me.model.totalrows++;
                me.database[me.modelName] = me.model;
                await AsyncStorage.setItem(me.dbName, JSON.stringify(me.database));
                resolve(me.model.rows[data._id]);
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });
    }

    // multi add
    async multiAdd(data) {
        var me = this;
        await this.initModel();
        return new Promise(async(resolve, reject) => {
            try {
                for(var key in data) {
                    var value = data[key];
                    var autoinc = me.model.autoinc++;
                    if (me.model.rows[autoinc]) {
                        return Util.error("ReactNativeStore error: Storage already contains _id '" + autoinc + "'");
                    }
                    if(value._id){
                        return Util.error("ReactNativeStore error: Don't need _id with add method");
                    }
                    value._id = autoinc;
                    me.model.rows[autoinc] = value;
                    me.model.totalrows++;
                }
                me.database[me.modelName] = me.model;
                await AsyncStorage.setItem(me.dbName, JSON.stringify(me.database));
                resolve(me.model.rows);
            } catch (error) {
                Util.error('ReactNativeStore error: ' + error.message);
            }
        });
    }

    // update
    async update(data, filter) {
        var me = this;
        await this.initModel();
        filter = filter || {};
        if(data._id)
            delete data._id;
        return new Promise(async(resolve, reject) => {
            try {
                var results = [];
                var rows = me.model["rows"];
                var filterResult = me.modelFilter.apply(rows, filter)
                for (var row in rows) {
                    for (var element in filterResult) {
                        if (rows[row]['_id'] === filterResult[element]['_id']) {
                            for (var i in data) {
                                rows[row][i] = data[i];
                            }
                            results.push(rows[row]);
                            me.database[me.modelName] = me.model;
                            await AsyncStorage.setItem(me.dbName, JSON.stringify(me.database));
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

        return new Promise(async(resolve, reject) => {
            if(result){
                resolve(result[0])
            }else{
                resolve(null)
            }
        });
    }

    // remove
    async remove(filter) {
        var me = this;
        await this.initModel();
        filter = filter || {};
        return new Promise(async(resolve, reject) => {
            try {
                var results = [];
                var rowsToDelete = [];
                var rows = me.model["rows"];
                var filterResult = me.modelFilter.apply(rows, filter)
                for (var row in rows) {
                    for (var element in filterResult) {
                        if (rows[row]['_id'] === filterResult[element]['_id'])
                            rowsToDelete.push(row);
                    }
                }
                for(var i in rowsToDelete) {
                    var row = rowsToDelete[i];
                    results.push(me.model["rows"][row]);
                    delete me.model["rows"][row];
                    me.model["totalrows"]--;
                }
                me.database[me.modelName] = me.model;
                await AsyncStorage.setItem(me.dbName, JSON.stringify(me.database));
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

        return new Promise(async(resolve, reject) => {
            if(result){
                resolve(result[0])
            }else{
                resolve(null)
            }
        });

    }

    // find
    async find(filter) {
        var me = this;
        await this.initModel();
        filter = filter || {};
        return new Promise((resolve, reject) => {
            var results = [];
            var rows = me.model["rows"];
            results = me.modelFilter.apply(rows, filter);
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

        return new Promise(async(resolve, reject) => {
            if(result){
                resolve(result[0])
            }else{
                resolve(null)
            }
        });

    }

    // get
    get(filter) {
        filter = filter || {};
        filter.limit = 1;
        return this.find(filter);
    }
}

module.exports = Model;
