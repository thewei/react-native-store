## react-native-store [![Build Status](https://travis-ci.org/thewei/react-native-store.svg?branch=master)](https://travis-ci.org/thewei/react-native-store) ![NPM version](https://img.shields.io/npm/v/react-native-store.svg?style=flat) [![NPM downloads](http://img.shields.io/npm/dm/react-native-store.svg?style=flat-square)](https://npmjs.org/package/react-native-store)

A simple database base on react-native AsyncStorage.


### Installation
```bash
$ npm install react-native-store --save
```

### Data anatomy
```
db_store
   |---table_name
         |---totalrows (variable)
         |---autoinc (variable)
         |---rows (array)
                |--- _id (number)
                |--- ....

```

### API
- Model( modelName )
- Model.add( data, filter )
- Model.update( data, filter )
- Model.updateById( data, id )
- Model.remove( filter )
- Model.removeById( id )
- Model.find( filter )
- Model.findById( id )
- Model.get( filter )
- Model.destroy()

### Filtering

Filtering adds more advanced logic to queries. This implementation is heavily
based off of [LoopBack's implementation](https://docs.strongloop.com/display/public/LB/Querying+data#Queryingdata-Filters).
However, there are some important things that are different/leftout:

- The [include filter](https://docs.strongloop.com/display/public/LB/Include+filter) is not implemented as it is not relevant.
- The [near and like/nlike](https://docs.strongloop.com/display/public/LB/Where+filter#Wherefilter-likeandnlike) operators are not implemented.
- The [skip filter](https://docs.strongloop.com/display/public/LB/Skip+filter) in LoopBack is the offset filter in this implementation to
  stay consistent with previous versions.

**Note**: Query operations on object nested within an entry are not perfect.
For example, trying to update an entry that looks something like this:

```javascript
{
  location: { name: 'place', distance: 'far' }
}
```

With this as the value of a where filter:

```javascript
{
  location: { name: 'place' }
}
```

Will overwrite the value of `location`, effectively removing the `distance`
property.
This occurs similarly with the order and fields filter, as you can only apply
the filters to values that are not nested within an object.

### Examples

See docs/test.js for a full code example.

#### Simple example
```js
var reactNativeStore = require('react-native-store');

var test = async function() {
  //Get/Create model
  var userModel = await reactNativeStore.model("user");

  // Add Data
  var add_data = await userModel.add({
    username: "tom",
    age: 12,
    sex: "man"
  });
  // return object or null
  console.log(add_data);

  // Update Data
  var update_data = await userModel.update({
    username: "mary",
    age: 12
  },{
    where: {
      username: "tom"    
    }
  });
  console.log(update_data);

  //Remove data with a filter
  var remove_data = await userModel.remove({
    where: {
      age: { lt: 15 }
    }
  });
  console.log(remove_data);
  //Remove all data (pass no where filter)
  var remove_data = await userModel.remove();
  console.log(remove_data)

  // fetch all
  var all_data = await userModel.find();
  console.log(all_data);

  // search using advanced queries
  var find_data = await userModel.find({
    where: {
      and: [{ username: { neq: 'tom' } }, { age: { gte: 40 } }]
    },
    order: {
      age: 'ASC',

    }
  });
  console.log("find",find_data);

}
```
### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout develop branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3
