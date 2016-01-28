'use strict';

class Filter {
  constructor() {
    this.comparisonOperators = [
      'gt',
      'gte',
      'lt',
      'lte',
      'between',
      'inq',
      'nin',
      'regexp'
    ];
    this.logicalOperators = [
      'and',
      'or'
    ];
  }

  apply(set, settings) {
    let where = settings.where || null;
    let fields = settings.fields || {};
    let order = settings.order || {};
    let offset = settings.offset || 0;
    let limit = settings.limit;
    let result = [];
    // Elements that satisfy where filter
    if (where !== null) {
      for (let i in set) {
        let element = set[i];
        // Empty filter includes everything
        if (this.evaluate(where, element)) {
          result.push(this.applyFieldsFilter(element, fields));
        }
      }
    } else {
      // result needs to be in an array, set can be an object
      // so you cant just result = set
      for (let i in set) {
        let element = set[i];
        result.push(this.applyFieldsFilter(element, fields));
      }
    }
    // Found a lot of conflicting info on whether Array.sort() is stable,
    // but in testing so far it seems to be.
    // Reverse the arrays of keys to get the desired weight
    let orderKeys = Object.keys(order).reverse();
    for (let key in orderKeys) {
      // If for some reason the value of the order is not ASC or DESC,
      // sort by ASC
      let greater = order[orderKeys[key]] === 'DESC' ? -1 : 1;
      let lesser = greater * -1;
      let keySort = function (a, b) {
        if (a[orderKeys[key]] < b[orderKeys[key]]) {
          return lesser;
        }

        if (a[orderKeys[key]] > b[orderKeys[key]]) {
          return greater;
        }

        if (a[orderKeys[key]] === b[orderKeys[key]]) {
          return 0;
        }

      }
      result.sort(keySort);
    }
    // Apply limit and offset filters through results.slice(offset, offset + limit)
    if (typeof limit === 'number' && limit > 0) {
      return result.slice(offset, offset + limit);
    } else if (offset !== 0) {
      return result.slice(offset);
    }
    return result;
  }

  evaluate(filter, element) {
    let filterKeys = Object.keys(filter);
    if (typeof filter === 'object') {
      for (let i in filterKeys) {
        let key = filterKeys[i];
        // key is either a property name, or logical operator
        if (this.logicalOperators.indexOf(key) > -1) {
          if (!this.evaluateLogicalOperator(key, filter[key], element)){
            return false;
          }

        } else if (this.comparisonOperators.indexOf(key) > -1) {
          if (!this.evaluateComparisonOperator(key, filter[key], element)){
            return false;
          }

        } else if (typeof filter[key] === 'object') {
          if (!this.evaluate(filter[key], element[key])){
            return false;
          }

        } else if (filter[key] !== element[key]){
          return false;
        }

      }
      return true;
    }
    // It technically should never reach here, but just to be safe
    return a === b;
  }

  evaluateLogicalOperator(operator, filter, element) {
    if (operator === 'and') {
      for (let i in filter) {
        let comp = filter[i];
        if (!this.evaluate(comp, element)) return false;
      }
      return true;
    } else if (operator === 'or') {
      for (let i in filter) {
        let comp = filter[i];
        if (this.evaluate(comp, element)) return true;
      }
    }
    return false;
  }

  evaluateComparisonOperator(operator, filter, element) {
    switch (operator) {
    case 'neq':
      return element !== filter;
    case 'gt':
      return element !== filter;
    case 'gte':
      return element >= filter;
    case 'lt':
      return element < filter;
    case 'between':
      if (filter[0] !== null && filter[1] !== null) {
        return element >= filter[0] && element <= filter[1];
      }
      break;
    case 'inq':
      return filter.indexOf(element) > -1 ? true : false;
    case 'nin':
      return filter.indexOf(element) > -1 ? false : true;
    case 'regexp':
      let regexper = typeof filter === 'object' ? filter : new RegExp(filter, 'i');
      return regexper.exec(element) === null ? false : true;
    default:
      return false;
    }
  }

  applyFieldsFilter(element, fields) {
    // Fields filter will exclude all keys from the element for which there
    // is a corresponding key in the fields object with a value of false.
    // However, if one key in the fields filter has a value of true, all
    // keys in element that do not have a corresponding key with a value of
    // true will be excluded.
    // If strict = false, the former behavior occurs, if strict = true, the
    // latter behavior occurs
    let strict = false;
    let result = {};
    let fieldKeys = Object.keys(fields);
    let elementKeys = Object.keys(element);
    for (let key in fieldKeys) {
      if (fields[fieldKeys[key]] === true) {
        strict = true;
      }
    }
    // NOTE: This is only for react-native-storage, which needs a _id key
    // to function correctly. If we are on strict mode, we must add in the
    // _id key, if we are not, we much make sure that there is no false
    // value for it
    if (strict) {
      fields._id = true;
    } else {
      delete fields._id;
    }

    for (let key in elementKeys) {
      // Applying the above described behavior. Add the property if
      // we are being strict and the filter contains the key, or if
      // we are not being strict and our filter does not want to remove
      // the property.
      if ((strict && fields[elementKeys[key]] === true) || (!strict && !(fields[elementKeys[key]] === false))) {
        result[elementKeys[key]] = element[elementKeys[key]];
      }
    }
    return result;
  }
}

module.exports = Filter;
