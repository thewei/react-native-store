'use strict'

class Filter {
    contructor() {
    }           

    apply(set, settings) { 
        var where = settings.where  
        var fields = settings.fields;
        var order = settings.order;
        var offset = settings.offset;
        var limit = settings.limit;
        var result = [];
        //Elements that satisfy where filter
        for(var element in set) {
            if(this.checkWhereFilter(element, where))
                result.push(this.applyFieldsFilter(element));
        }
        //Found a lot of conflicting info on whether Array.sort() is stable,
        //but testing in Node it seems it is.
        //Reverse the arrays of keys to get the desired weight
        var keys = Object.keys(order).reverse();
        for(var key in keys) {
            //If for some reason the value of the order is not ASC or DESC,
            //sort by ASC
            var greater = order[key] === 'DESC' ? -1 : 1;
            var lesser = greater * -1;
            var keySort = function(a, b) {
                if(a[key] < b[key])
                    return lesser;
                if(a[key] > b[key])
                    return greater;
                if(a[key] == b[key])
                    return 0;
            }
            result.sort(keySort);
        }
        //Apply limit and offset filters through results.slice(offset, offset + limit)
        if(typeof limit === 'number' && limit > 0 && typeof offset === 'number' && offset > -1)
            return result.slice(offset, offset + limit)
       return result; 
    }

    checkWhere(element, where) {
        Object.keys(where).forEach(function(key) {
            var filterVal = where[key];
            var elementVal = element.hasOwnProperty(key) ? element[key] : null;
            if(!elementVal || !this.objectEquals(filterVal, elementVal))
                return false;
        });
        return true;
    }

    objectEquals(a, b) {
        //Compares all keys from a to b for equality.
        //A could be a subset of B, but B may not be a subset for A
        //Therefore check that A and B contain the same keys and those keys 
        //are the same type
        Object.keys(b).forEach(function(key) {
            if(!(a.hasOwnProperty(key) && typeof a[key] === typeof b[key])) 
                return false;
        })
        Object.keys(a).forEach(function(key) {
            if(!(b.hasOwnProperty(key) && typeof a[key] === typeof b[key])) 
                return false;
            var val = a[key]
            //filters could have nested objects
            if(typeof val === 'Object')
                if(!objectEquals(val, b[key])) return false;
            else 
                return val == b[key];
        });
        //Only occurs if both a and b are empty objects, but is technically
        //true since the empty set == the empty set
        return true;
    }
    
    applyFieldsFilter(element, fields) {
        //Fields filter will exclude all keys from the element for which there
        //is a corresponding key in the fields object with a value of false.
        //However, if one key in the fields filter has a value of true, all
        //keys in element that do not have a corresponding key with a value of
        //true will be excluded.
        //If strict = false, the former behavior occurs, if strict = true, the
        //latter behavior occurs
        var strict = false;
        var result = {};
        Objects.keys(fields).forEach(function(key) {
            if(fields[key] === true)
                strict = true;
        });
        Object.keys(element).forEach(function(key) {
            //Applying the above described behavior. Add the property if
            //we are being strict and the filter contains the key, or if
            //we are not being strict and our filter does not want to remove
            //the property.
            if((strict && fields[key] === true) || !(fields[key] === false))
                result[key] = element[key];
        });
        return result;
    }
}

module.exports = Filter;
