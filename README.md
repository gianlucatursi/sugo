<img src="https://raw.githubusercontent.com/gianlucatursi/sugo/master/docs/statics/img/logo.png" width="300">

An Angular module that allows modeling, syncing and storage data easily.
Inspired by mongoose.js

[![Bower version][bower-image]][bower-image]
[![License][license-image]][license-url]

##Table of contents:
- [Get Started](#get-started)
- [Inject](#inject)
- [Define a Schema](#define-a-schema)
- [Define a Model](#define-a-model)
    - [Accessing a Model](#accessing-a-model)
    - [Validation](#validation)
- [API Documentation](#api-documentation)
    - [Schema](#schema)
    - [Model](#model)
	- [Element](#element)
- [Examples](#demo)	
- [TODO](#todo)
- [Contributors](#contributors)
- [LICENSE](#license)

<a name="get-started"></a>
##Get Started
**(1)** We can install `$sugo` using bower:<br/>
```bash
$ bower install sugo --save
```

**(2)** Include `src/sugo.js` (or `dist/sugo.min.js`) from the [dist](https://github.com/gianlucatursi/sugo/tree/master/dist) (not ready) directory in our `index.html`, after including Angular itself.

**(3)** Add `'sugo'` to our main module's list of dependencies.

When we're done, our setup should look similar to the following:

```html
<!doctype html>
<html ng-app="myApp">
<head>

</head>
<body>
    ...
    <script src="../angular.min.js"></script>
    <script src="bower_components/sugo/src/sugo.js"></script>
    ...
    <script>
        var myApp = angular.module('myApp', ['sugo']);

    </script>
    ...
</body>
</html>
```
<a name="Inject"></a>
##Inject
- [Inject](#inject)
Before using `$sugo` we should inject the service in our controller/factory/service.

Something like:
```
app.controller('Maincontroller', ['$sugo', function($sugo){
    ...
}]);
```
<a name="define-a-schema"></a>
##Define a Schema
We can easily create a new schema doing:
```javascript
var Schema = $sugo.schema;

var Person = new Schema({
    name : String,
    surname: String,
    age: Number,
    created_at: Date,
});
```

Now we have define a new `SugoSchema` for our model.

<a name="define-a-model"></a>
##Define a Model
After creating the `Schema` we should create a model for that schema.

```javascript
var Users = $sugo.model('Users', Person);
```

This define a new model `Users` and each document of `Users` are structured as a `Person`.

### Accessing a Model
Once we have define a model through `$sugo.model('Users', Person)` we can access it through the same function:

```javascript
var Users = $sugo.model('Users', Person);
```

or without using the schema:

```javascript
var Users = $sugo.model('Users');
```

`$sugo` will create the model for your Users and your Users collection (if doesn't exist) in the localStorage.
In the future this plugin can be used for hybird apps for storing data into a Native Storage (phonegap/cordova plugin todo)

Once we have our model, we can then instantiate it, and save it:
```javascript
var me = Users.new({name: 'Gianluca', surname: 'Tursi', age: 27});
me.save();
```

Before calling funciton `save` we have a new instance of `Person`. We can change all data doing
```
me.name = 'Gian';
me.age = 28;
```

and we have the modify version of `me` in all ours controller / services **BUT is not stored**.
Only the funciton `save` can store the new `Person`. 
Of course we can store and the modify the object and store it again (with `.save()` or `.update()`)

<a name="validation"></a>
###Validation
When we create a new element this validate according to the schema of the model.

If we create, for example, this element:

```javascript
var me = Users.new({ 
    name: 'Gianluca', 
    surname: 'Tursi', 
    age: 27,
    mother: 'Daniela' //not defined in the Person schema
});
```

The field `mother` will not be evaluated, considered and saved. **It's does not exist**.

<a name="api-documentation"></a>
##API Documentation

<a name="schema"></a>
### $sugo.schema()
Create a new schema
```javascript
var schema = new $sugo.schema({
    <key>: <type>
});
```
The methos above concern the instance `schema` (schema.<method>)

### schema.define()
Used for re-define a schema or create a new one.

**WARNING:** If you change an existing schema (associated with a model with a stored data) the data are re-validated with the new schema only after calling `$sugo.model(<MODEL>).migrate(<NEW_SCHEMA>)`).

**@param** `Object` definition of the schema  
```javascript
schema.define({
    <key>: <type>
});
```

### schema.validate()

Used when you insert a new element from model (or element it self)  
**@param** `Object` data to validate  
**@return** `Object`   
**FIXME** At the moment the validation don't check the types (es: { title: String } if we pass { title: 1} it's valid).

```javascript
schema.validate({
    <key>: <type>
})
```

If you want a pre-validation before insert in model an element you can do:

```javascript
var Users = $sugo.model('Users');

var sister = {
  name: 'Francesca',
  age: 33
};

if(Users.schema.validate(sister)){
    Users.new(sister).save();//create and store only if is valid
}
```

<a name="model"></a>
##Model
### $sugo.model()
Constructor for create, or get, a new model

**@param** `String` _name of the model  
**@param** `$sugo.schema` sugo_schema instance of `$sugo.schema`  
**@return** `$sugo.model` instance of `$sugo.model`  
```javascript
var model = $sugo.model('Users', <SCHEMA>);
```

The methos above concern the instance `model` (model.<method>)

### model.name()
Get the name of the Model

**@return** `String` name of the model<br>
```javascript
var model = $sugo.model('Users', <SCHEMA>);
model.name(); //Users
```

### model.new()
Create a new instance of the element of the model

**@param**  `Object` value of the new object  
**@return** `$sugo.element` instance of a new element  

```javascript
var me = model.new({
    name: 'Gianluca',
    surname: 'Tursi',
    age: 27
});
```

### model.insert()

Used for insert a new element in the model (automatically stored)
When the insert is complete the model its automatically updated.

**@param** `Object` the data to insert  
**@return** `Promise` in success callback there is the instance of `$sugo.element` of the object inserted.   
In fail callback there is an {Object} with two key : `message` and `schema`<br>
```javascript
model
    .insert({
        name: 'Gianluca',
        surname: 'Tursi',
        age: 27
    })
    .then(
        function _success( data ){},
        function _fail( error ){}
    );
```

### model.update()
Used for update a `$sugo.element` in the model and in localStorage.
When the update is complete the model its automatically updated.

**@param** `$sugo.element` the instance of sugo element to update  
**@return** `Promise` in success callback there is the instance of `$sugo.element` of the object updatated.   
In fail callback there is an {Object} with two key : `message` and `schema`<br>

```javascript
model
    .update(<SUGO_ELEMENT>)
    .then(
        function _success( data ){},
        function _fail( error ){}
    );
```
### model.delete()
Used for delete a `$sugo.element` in the model and in localStorage.
When the update is complete the model its automatically updated.

**@param** `$sugo.element` the instance of sugo element to delete  
**@return** `Promise` in success callback there is the instance of `$sugo.element` deleted.   
In fail callback there is an {Object} with the error<br>

```javascript
model
    .delete(<SUGO_ELEMENT>)
    .then(
        function _success( data ){},
        function _fail( error ){}
    );
```

### model.find()
Used for find `$sugo.elements` in the model.

**@param** `Object` the query (es: `{name: "Gianluca"}`. TODO: more operators like `mongodb`: `{$gte: ""}`)  
**@return** `Promise` in success callback there is, always an array, the list of `$sugo.element` founded. 
In fail callback there is an {Object} with two key : `message` and `query`  
If the param is empty `$sugo` return all documents

```javascript
model
    .find(<QUERY>)
    .then(
        function _success( data ){},
        function _fail( error ){}
    );
```
### model.findOne()
The same of `model.find()` but return only the first element founded
In success callback the data can be `undefined` or a `$sugo.element`

```javascript
model
    .findOne(<QUERY>)
    .then(
        function _success( data ){},
        function _fail( error ){}
    );
```
### model.migrate()
Used for migrate from a schema to a new one.

**@param** `$sugo.schema` the new schema for the model  
```javascript
$sugo.model(<MODEL>).migrate(<SCHEMA>);
```
<a name="element"></a>
##Element
Create a new element with insert or with 
```javascript
var element = $sugo.model(<MODEL>).new(<DATA>);
```

### element.identifer()
Return the identifer of the object stored
```javascript```
element.identifer();
```

### element.save()
Used for store the element (also update if is change)
```javascript```
element.save();
```
### element.update()
Used for update the stored element
```javascript```
element.update();
```
### element.delete()
Used for delete the stored element
```javascript```
element.delete();
```
### element.toString()
Return the element as a String

**@param** `Object`  each key is a selection and if the value is 1 return only that key. If is `undefined` or empty return the object  
**FIXME** to improve  
```javascript```
// return only for example: {name: "Gianluca"}
element.toString({ name: 1});
```


<a name="examples"></a>
##Examples
Open `index.html` for a simply example.

<a name="todo"></a>
##TODO

- **Data validation** with the schema
- **Middleware** for data sync with "server". An user can write its code for its backend and this will run after `sugo` model save/update/delete etc.. Like `preSave` and `afterSave` functions for doing action pre and post saving.
- Improving **storage** (using [lz-string](http://pieroxy.net/blog/pages/lz-string/index.html))
- Native plugins for **iOS & Android** to Storage Data
- Documentation
- Tests
- of course, **bug** fixes

<a name="contributors"></a>
##Contributors

<a name="license"></a>
##LICENSE
The MIT License

Copyright (c) 2016 Gianluca Tursi http://www.gianlucatursi.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[bower-image]: https://img.shields.io/bower/v/sugo.svg?style=flat-square
[bower-url]: https://github.com/gianlucatursi/sugo

[license-image]: http://img.shields.io/npm/l/sugo.svg?style=flat-square
[license-url]: LICENSE
