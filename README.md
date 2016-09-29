<img src="https://raw.githubusercontent.com/gianlucatursi/sugo/master/docs/statics/img/logo.png" width="300">

An Angular module that allows modeling, syncing and storage data easily.

[![Bower version][bower-image]][bower-image]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]

##Table of contents:
- [Get Started](#get-started)
- [API Documentation](#api-documentation)
	- [SugoSchema](#sugoschema)
	- [SugoModel](#sugomodel)
	- [SugoElement](#sugoelement)
- [Examples](#demo)	
- [TODO](#todo)
- [Contributors](#contributors)
- [LICENSE](#license)

<a name="get-started"></a>
##Get Started
**(1)** You can install `$sugo` using bower:<br/>
```bash
$ bower install sugo --save
```

**(2)** Include `src/sugo.js` (or `dist/sugo.min.js`) from the [dist](https://github.com/gianlucatursi/sugo/tree/master/dist) (not ready) directory in your `index.html`, after including Angular itself.

**(3)** Add `'sugo'` to your main module's list of dependencies.

When you're done, your setup should look similar to the following:

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
<a name="api-documentation"></a>
##API Documentation

<a name="sugoschema"></a>
##SugoSchema

<a name="sugoclass"></a>
##SugoClass

<a name="sugoelement"></a>
##SugoElement

<a name="examples"></a>
##Examples
Open `index.html` for a simply example.

<a name="todo"></a>
##TODO

- **Data validation** with the schema
- **Data sync** with "server". An user can write its code for its backend and this will run after `sugo` model save/update/delete etc.. 
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
[bower-url]: https://npmjs.org/package/angular-local-storage

[david-image]: http://img.shields.io/david/gianlucatursi/sugo.svg?style=flat-square
[david-url]: https://david-dm.org/gianlucatursi/sugo

[license-image]: http://img.shields.io/npm/l/sugo.svg?style=flat-square
[license-url]: LICENSE