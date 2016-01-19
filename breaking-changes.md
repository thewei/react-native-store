# Breaking Changes


## Version 0.4

- Changed `Model(modelName)` from `promise` to a object.

```
// Usage
var reactNativeStore = require('react-native-store');
var fooModel = reactNativeStore.model('foo'); // this was a promise earlier

fooModel.find();
```
