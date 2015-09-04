## react-native-store ![NPM version](https://img.shields.io/npm/v/react-native-store.svg?style=flat)

A simple database base on react-native AsyncStorage.

***NOTE***: since v0.0.4, the API is changed!

### Installation
```bash
$ npm install react-native-store --save
```

### Data Anatomy
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
- Model.find( filter, parmas )
- Model.get( filter, parmas )

### Simple example
```js
var reactNativeStore = require('react-native-store');

(async function(){
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
    _id: 1
  });

  console.log(update_data);

  //Remove Data
  var remove_data = await userModel.remove({
    _id: 1
  });
  console.log(remove_data);

  // search
  var find_data = await userModel.find();
  console.log("find",find_data);

});
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
