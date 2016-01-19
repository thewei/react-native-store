## react-native-store [![Build Status](https://travis-ci.org/thewei/react-native-store.svg?branch=master)](https://travis-ci.org/thewei/react-native-store) ![NPM version](https://img.shields.io/npm/v/react-native-store.svg?style=flat) [![NPM downloads](http://img.shields.io/npm/dm/react-native-store.svg?style=flat-square)](https://npmjs.org/package/react-native-store)

A simple database base on react-native AsyncStorage.

***NOTE***: since v0.2.0, better filtering has been added! See the filtering section for more infomation. Queries using the previous form will be invalid!

The new filtering added by [terminull](https://github.com/terminull/react-native-store/tree/better-filter)

### Installation
```bash
$ npm install react-native-store --save
```

***Upgrading from previous version?*** Check for [breaking-changes](breaking-changes.md).


### Data anatomy
```
db_store
   |---model_name
         |---totalrows (variable)
         |---autoinc (variable)
         |---rows (array)
                |--- _id (number)
                |--- ....

```

### API
- **Model( modelName )** : returns a `Model` object
- **Model.add( data, filter )** : returns a `promise` object
- **Model.update( data, filter )** : returns a `promise` object
- **Model.updateById( data, id )** : returns a `promise` object
- **Model.remove( filter )** : returns a `promise` object
- **Model.removeById( id )** : returns a `promise` object
- **Model.find( filter )** : returns a `promise` object
- **Model.findById( id )** : returns a `promise` object
- **Model.get( filter )** : returns a `promise` object
- **Model.destroy()** : returns a `promise` object

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


#### Simple example

```js
var reactNativeStore = require('react-native-store');

var DB = {
    'foo': new reactNativeStore.model('foo'),
    'bar': new reactNativeStore.model('bar')
}

// somewhere inside react components

componentDidMount: function() {
    // Return all items
    DB.foo.find().then(resp => this.setState({items: resp}));
}

handleFilter: function(itemName) {
    DB.foo.find({
        where: {
            and: [{ foo: { neq: itemName } }, { age: { gte: 5 } }]
        },
        order: {
            age: 'ASC',
        }
    }).then(resp => this.setState({items: resp}));
}

handleOnPress: function() {
    DB.bar.add({
        foo: 'foo',
        bar: 'bar',
        age: 12
    });
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
