'use strict'

class Filter {

    apply(set, settings) { 
        var where = settings.where || {}; 
        var fields = settings.fields || {}; 
        var order = settings.order || {}; 
        var offset = settings.offset || 0; 
        var limit = settings.limit; 
        var result = [];
        //Elements that satisfy where filter
        for(var element in set) {
            if(this.checkWhere(set[element], where))
                result.push(this.applyFieldsFilter(set[element], fields));
        }
        //Found a lot of conflicting info on whether Array.sort() is stable,
        //but in testing so far it seems to be.
        //Reverse the arrays of keys to get the desired weight
        var orderKeys = Object.keys(order).reverse();
        for(var key in orderKeys) {
            //If for some reason the value of the order is not ASC or DESC,
            //sort by ASC
            var greater = order[orderKeys[key]] === 'DESC' ? -1 : 1;
            var lesser = greater * -1;
            var keySort = function(a, b) {
                if(a[orderKeys[key]] < b[orderKeys[key]])
                    return lesser;
                if(a[orderKeys[key]] > b[orderKeys[key]])
                    return greater;
                if(a[orderKeys[key]] == b[orderKeys[key]])
                    return 0;
            }
            result.sort(keySort);
        }
        //Apply limit and offset filters through results.slice(offset, offset + limit)
        if(typeof limit === 'number' && limit > 0)
            return result.slice(offset, offset + limit)
        else if(offset !== 0)
            return result.slice(offset);
       return result; 
    }

    checkWhere(element, where) {
        var whereKeys = Object.keys(where);
        for(var key in whereKeys) {
            var filterVal = where[whereKeys[key]];
            var elementVal = element[whereKeys[key]] || null;
            console.log(this.objectEquals(filterVal, elementVal))
            if(!elementVal || !this.objectEquals(filterVal, elementVal))
                return false;
        }
        return true;
    }

    objectEquals(a, b) {
        if(typeof a === 'object' && typeof b === 'object') {
            var bKeys = Object.keys(b);
            for(var key in bKeys) {
                if(!a.hasOwnProperty(bKeys[key]) || typeof a[bKeys[key]] !== typeof b[bKeys[key]])
                    return false;
            }
            var aKeys = Object.keys(a);
            for(var key in aKeys) {
                if(!b.hasOwnProperty(aKeys[key]) || typeof a[aKeys[key]] !== typeof b[aKeys[key]]) 
                    return false;
            }
            for(var key in aKeys) {
                var val = a[aKeys[key]]
                if(!this.objectEquals(val, b[aKeys[key]]))
                    return false;
            }
            return true;
        } else
            return a === b;
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
        var fieldKeys = Object.keys(fields);
        var elementKeys = Object.keys(element);
        for(var key in fieldKeys) {
            if(fields[fieldKeys[key]] === true)
                strict = true;
        }
        for(var key in elementKeys) {
            //Applying the above described behavior. Add the property if
            //we are being strict and the filter contains the key, or if
            //we are not being strict and our filter does not want to remove
            //the property.
            if((strict && fields[elementKeys[key]] === true) || (!strict && !(fields[elementKeys[key]] === false)))
                result[elementKeys[key]] = element[elementKeys[key]];

        }
        return result;
    }
}

module.exports = new Filter();
