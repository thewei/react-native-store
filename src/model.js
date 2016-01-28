'use strict';
import {
  AsyncStorage
}
from 'react-native';
import Util from './util';
import Filter from './filter';

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
    let database = await AsyncStorage.getItem(this.dbName);
    if (database) {
      return Object.assign({}, JSON.parse(database));
    }
    return this.createDatabase();
  }

  async initModel() {
    this.database = await this.getDatabase();
    this.model = this.database[this.modelName] ? this.database[this.modelName] : {
      totalrows: 0,
      autoinc: 1,
      rows: {}
    };
    this.database[this.modelName] = this.database[this.modelName] || this.model;
  }

  // destroy
  async destroy() {
    let database = await AsyncStorage.getItem(this.dbName);
    return database ? await AsyncStorage.removeItem(this.dbName) : null;
  }

  // add
  async add(data) {
    await this.initModel();
    let autoinc = this.model.autoinc++;
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
    for (let key in data) {
      let value = data[key];
      let autoinc = this.model.autoinc++;
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
  async update(data, filter = {}) {
    await this.initModel();
    if (data._id) {
      delete data._id;
    }
    let results = [];
    let rows = this.model.rows;
    let filterResult = this.modelFilter.apply(rows, filter);
    for (let row in rows) {
      for (let element in filterResult) {
        if (rows[row]._id === filterResult[element]._id) {
          for (let i in data) {
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
    let result = await this.update(data, {
      where: {
        _id: id
      }
    });
    return result ? result[0] : null;
  }

  // remove
  async remove(filter = {}) {
    await this.initModel();
    let results = [];
    let rowsToDelete = [];
    let rows = this.model.rows;
    let filterResult = this.modelFilter.apply(rows, filter);
    for (let row in rows) {
      for (let element in filterResult) {
        if (rows[row]._id === filterResult[element]._id) {
          rowsToDelete.push(row);
        }
      }
    }
    for (let i in rowsToDelete) {
      let row = rowsToDelete[i];
      results.push(this.model.rows[row]);
      delete this.model.rows[row];
      this.model.totalrows--;
    }
    this.database[this.modelName] = this.model;
    await AsyncStorage.setItem(this.dbName, JSON.stringify(this.database));
    return results.length ? results : null;
  }

  // remove a single entry by id
  async removeById(id) {
    let result = await this.remove({
      where: {
        _id: id
      }
    });
    return result ? result[0] : null;
  }

  // find
  async find(filter = {}) {
    await this.initModel();
    let results = [];
    let rows = this.model.rows;
    results = this.modelFilter.apply(rows, filter);
    return results.length ? results : null;
  }

  // find a single entry by id
  async findById(id) {
    let result = await this.find({
      where: {
        _id: id
      }
    });
    return result ? result[0] : null;
  }

  // get
  get(filter = {}) {
    filter.limit = 1;
    return this.find(filter);
  }
}

module.exports = Model;
