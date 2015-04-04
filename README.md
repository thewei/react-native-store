# react-native-store

**A simple database base on react-native AsyncStorage. **


===

## Installation

```
npm install react-native-store

```

## Data Anatomy

```
db_store
   |---table_name
         |---totalrows (variable)
         |---autoinc (variable)
         |---rows (array)
         	   |--- _id (number)
         	   |--- ....
         
```


## Useage


### Add Data

```
var ReactNativeStore = require('react-native-store');

ReactNativeStore.table("articles").then(function(articles){

	// Add Data
	var id = articles.add({
         title: "Title",
         content: "This is a article"
    });
    
    console.log(id); //row id
    
});

```

### Remove Data

```
var ReactNativeStore = require('react-native-store');

ReactNativeStore.table("articles").then(function(articles){

	// Remove Data By Id
	var id = articles.removeById(1);
    console.log(id); //row id
    
    // Remove Data
	var ids = articles.where({
		title:"Title"
	).remove();
    console.log(ids); //row ids
    
});

```

### Update Data

```
var ReactNativeStore = require('react-native-store');

ReactNativeStore.table("articles").then(function(articles){

	// Update Data By Id
	var data = {
		title:: "Title1"
	};
	var id = articles.updateById(1,data);
    console.log(id); //row id
    
    // Update Data
	var ids = articles.where({
		title:"Title"
	).update(data);
    console.log(ids); //row ids
    
});

```


### Find Data

```
var ReactNativeStore = require('react-native-store');

ReactNativeStore.table("articles").then(function(articles){

	// Get Data By Id
	var article = articles.get(1);
    console.log(article); //article data
    
    // Get Datas
	var articles = articles.where({
		title:"Title"
	).find(data);
    console.log(articles); //articles data
    
    // limit
    var articles = articles.where({
		title:"Title"
	).limit(10).find(data);
    console.log(articles); //articles data
    
    // offset
    var articles = articles.where({
		title:"Title"
	).offset(10).find(data);
    console.log(articles); //articles data
    
});

```
