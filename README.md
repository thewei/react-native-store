## react-native-store ![NPM version](https://img.shields.io/npm/v/react-native-store.svg?style=flat)

A simple database base on react-native AsyncStorage.

***NOTE***: since v0.2.0, better filtering has been added! See the filtering section for more infomation. Queries using the previous form will be invalid!

The new filtering added by [terminull](https://github.com/terminull/react-native-store/tree/better-filter) v0.1.1

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
- Model.remove( filter )
- Model.find( filter )
- Model.get( filter )

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
  var remove_data = await userModelremove();
  console.log(remove_data)

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
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT license
Copyright (c) 2015 thewei

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

![docor]()
built upon love by [docor](git+https://github.com/turingou/docor.git) v0.3.0
