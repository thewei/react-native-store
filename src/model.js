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
    var database = await AsyncStorage.getItem(this.dbName);
    if (database) {
      return Object.assign({}, JSON.parse(database));
    } else {
      return this.createDatabase();
    }
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
    var database = await AsyncStorage.getItem(this.dbName);
    return database ? await AsyncStorage.removeItem(this.dbName) : null;
  }

  // add
  async add(data) {
    await this.initModel();
    var autoinc = this.model.autoinc++;
    if (this.model.rows[autoinc]) {
      return Util.error("ReactNativeStore error: Storage already contains _id '" + autoinc + "'");
    }
    if (data._id) {
      return Util.error("ReactNativeStore error: Don't need _id with add method");
    }
    data._id = autoinc;
    this.model.rows[autoinc] = data;
    this.model.totalrows++;
    this.database[this.modelName] = this.model;
    await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
    return this.model.rows[data._id];
  }

  // multi add
  async multiAdd(data) {
    await this.initModel();
    for (var key in data) {
      var value = data[key];
      var autoinc = this.model.autoinc++;
      if (this.model.rows[autoinc]) {
        return Util.error("ReactNativeStore error: Storage already contains _id '" + autoinc + "'");
      }
      if (value._id) {
        return Util.error("ReactNativeStore error: Don't need _id with add method");
      }
      value._id = autoinc;
      this.model.rows[autoinc] = value;
      this.model.totalrows++;
    }
    this.database[this.modelName] = this.model;
    await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
    return this.model.rows;
  }

  // update
  async update(data, filter) {
    await this.initModel();
    filter = filter || {};
    if (data._id)
      delete data._id;
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
    return results.length ? results : null;
  }

  // remove a single entry by id
  async updateById(data, id) {
    var result = await this.update(data, {
      where: {
        _id: id
      }
    });
    return result ? result[0] : null;
  }

  // remove
  async remove(filter) {
    await this.initModel();
    filter = filter || {};
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
    for (var i in rowsToDelete) {
      var row = rowsToDelete[i];
      results.push(this.model["rows"][row]);
      delete this.model["rows"][row];
      this.model["totalrows"]--;
    }
    this.database[this.modelName] = this.model;
    await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
    return results.length ? results : null;
  }

  // remove a single entry by id
  async removeById(id) {
    var result = await this.remove({
      where: {
        _id: id
      }
    });
    return result ? result[0] : null;
  }

  // find
  async find(filter) {
    await this.initModel();
    filter = filter || {};
    var results = [];
    var rows = this.model["rows"];
    results = this.modelFilter.apply(rows, filter);
    return results.length ? results : null;
  }

  // find a single entry by id
  async findById(id) {
    var result = await this.find({
      where: {
        _id: id
      }
    });
    return result ? result[0] : null;
  }

  // get
  get(filter) {
    filter = filter || {};
    filter.limit = 1;
    return this.find(filter);
  }
}

module.exports = Model;
