(function() {
    'use strict';
    var sugo = angular.module('sugo', []);

    $sugoStorage.$inject = ['$q'];
    sugo.service('$sugoStorage', $sugoStorage);

    $sugo.$inject = ['$sugoStorage', '$q'];
    sugo.service('$sugo', $sugo);

    /**
     * Sugo
     * @param  {[type]} $sugoStorage [description]
     * @param  {[type]} $q           [description]
     * @return {[type]}              [description]
     */
    function $sugo($sugoStorage, $q) {
      var models = {};

      var sugoModule = {
        model: _createModel,
        schema: SugoSchema
      };
      /**
       * [_create description]
       * @param  {[type]} identifier [description]
       * @return {[type]}            [description]
       */
      function _createModel(identifier, sugo_schema) {
        var correctName = identifier.toLowerCase().capitalized();
        var name = "$sugo." + correctName;
        if (!sugo_schema || name in models) {
          return models[name];
        } else {
          models[name] = new SugoClass(correctName, sugo_schema);
          return models[name];
        }
      }


      /********************** SUGO Class **********************/
      /**
       * Sugo Model Constructor
       * @param {[type]} _name [description]
       * @param {[type]} sugo_schema [description]
       * @param SugoSchema sugo_schema
       */
      function SugoClass(_name, sugo_schema){
        this.model_name = _name;
        this.schema = sugo_schema;
        this.elements = {};

        var that = this;
        var oldElement = $sugoStorage.getObject(_name);

        _.each(oldElement, function(value, key){
          var newElement = new SugoElement(value, that, key);
          that.elements[key] = newElement;
        });

        return this;
      }

      /**
       * Get the name of the Schema
       * @return {[type]} [description]
       */
      SugoClass.prototype.name = function(){
        return this.model_name;
      }

      /**
       * Create a new instance of the element of the model
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      SugoClass.prototype.new = function(value){
        return new SugoElement(value || {}, this);
      }

      /**
       * [insert description]
       * @return {[type]} [description]
       */
      SugoClass.prototype.insert = function(element){
        var that = this;
        var defer = $q.defer();

        var newElement = new SugoElement(element, that);
        if(newElement){
          that.elements[newElement.identifier()] = newElement;
          $sugoStorage.setObject(that.name(), that.elements, that.schema);
          
          defer.resolve(that.elements[newElement.identifier()]);
        }else{
          defer.reject({
            message: "Element not valid for the schema",
            schema: that.schema.toString()
          });
        }

        return defer.promise;
      };
      
      SugoClass.prototype.update = function(sugo_element){

        var that = this;
        var defer = $q.defer();

        //var toUpdate = _.find(that.elements, {_identifier: sugo_element.identifier()});
        var toUpdate = that.elements[sugo_element.identifier()];

        if(toUpdate){
          _.extendOwn(toUpdate, sugo_element);

          $sugoStorage.setObject(that.name(), that.elements, that.schema);

          defer.resolve({});
        }else{ // to add

          return this.insert(sugo_element);
          /*defer.reject({
            message: "Element not found"
          });*/
        }

        return defer.promise;
      };

      /**
       * [find description]
       * @param  {[type]} query [description]
       * @return {[type]}       [description]
       */
      SugoClass.prototype.find = function(query){
        var that = this;
        var defer = $q.defer();

        if(!query || _.isEmpty(query)) {
          defer.resolve(that.elements);
          return defer.promise;
        }

        var founded = _.where(that.elements, query);

        if(founded)
          defer.resolve(founded);
        else
          defer.reject({message: "Not found", query: query});

        return defer.promise;
      }

      SugoClass.prototype.findOne = function(query){
        var that = this;
        var defer = $q.defer();

          this.find(query)
            .then(
              function(response){
                if(response.length > 0)
                  defer.resolve(response[0])
                else
                  defer.reject({});
            }, function(error){
              defer.reject(error)
            });

        return defer.promise;
      }
      /**
       * [delete description]
       * @param  {SugoElement} sugo_element [description]
       * @return {[type]}              [description]
       */
      SugoClass.prototype.delete = function(query){
        var that = this;
        var defer = $q.defer();

        that.findOne(query)
          .then(
            function _success(response){
              delete that.elements[response.identifier()];

              $sugoStorage.setObject(that.name(), that.elements, that.schema);

              defer.resolve(response);
            },
            function _fail( error ){
              defer.reject(error);
            });

        return defer.promise;

      };

      /**
       * Migrate data with a new schema
       * @return {[type]} [description]
       */
      SugoClass.prototype.migrate = function(new_schema){
        var oldElement = $sugoStorage.getObject(_name);
        var that = this;

        that.schema = new_schema;
        that.elements = {};

        _.each(oldElement, function(value, key){
          var newElement = new SugoElement(value, that, key);
          that.elements[key] = newElement;
        });

      }
      /*** FIXME: USER IN THAT FUNCTION CAN USE this? maybe can know how to use it

       /**
       * Used for extend SugoClass methods
       * @param  {String} method name of the function to add
       * @param  {[type]} func   the function
       
      SugoClass.prototype.extend = function(method, func){
        if(!(method in SugoClass.prototype))
          SugoClass.prototype[method] = func;
      };
      */
      /**
       * Used for override SugoClass methods (es: save, update, delete, ..)
       * @param  {String} method the name of the function to ovverride
       * @param  {Function} func  the function that override
       
      SugoClass.prototype.overwrite = function(method, func){
        if(method in SugoClass.prototype)
          SugoClass.prototype[method] = func;
      };
      */

      /**
       * SugoElement class
       */
      function SugoElement(data, sugo_class, oldId){
        this._identifier = oldId || _ID();
        this._private = {
          sugo: sugo_class
        };

        // created_at overwritten when are include in data
        try{
          this._private.sugo.schema.validate(data); //!!!TODO!!!
          _.extendOwn(this, data);
        }catch(exception){
          console.error(exception);
          return undefined;
        }

        return this;

        /**
         * Generate id for element
         * @return {[type]} [description]
         */
        function _ID() {
          return '_' + (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
        };
      }

      /**
       * Return local idetifier
       * @return {[type]} [description]
       */
      SugoElement.prototype.identifier = function(){
        return this._identifier;
      }

      /**
       * CRUD FUNCTIONS Save, Update, Get, Obliterate(?? fa schifo) = SUGO ;)
       */
      /**
       * Save element
       * @return {[type]} [description]
       */
      SugoElement.prototype.save = function(){
        return this._private.sugo.update(this);
      }

      /**
       * Update element
       * @return {[type]} [description]
       */
      SugoElement.prototype.update = function(){
        return this._private.sugo.update(this);
      }

      /**
       * Delete element
       * @return {[type]} [description]
       */
      SugoElement.prototype.delete = function(){
        return this._private.sugo.delete(this);
      }
      /**
       * toString function
       * @param  {Object} selected : List of all key to select (with value 1)
       */
      SugoElement.prototype.toString = function(selected){
        var cloned = _(this).clone();
        delete cloned._private;

        if(selected && _.keys(selected).length > 0){
          var keys = [];
          _.each(selected, function(value, key) {
            if(_.isNumber(value) && value == 1){
              keys.push(key);
            }
          });
          cloned = _(cloned).pick(keys);
        }

        return JSON.stringify(cloned);
      }



      /********************** SUGO SCHEMA **********************/
      /**
       * Sugo Schema Costructor
       * @param {[type]} dataSchema [description]
       */
      function SugoSchema(dataSchema){

        if(_isNotValid(dataSchema || {})){
          throw "Schema not valid: Object-> " + JSON.stringify(dataSchema);
          return;
        }

        this.schema = dataSchema || {};
        return this;
      }

      /**
       * Define a new Schema for Sugo
       * @param  {[type]} dataSchema [description]
       * @return {[type]}            [description]
       */
      SugoSchema.prototype.define = function(dataSchema){
        if(_isNotValid(dataSchema || {})){
          throw "Schema not valid: Object-> " + JSON.stringify(dataSchema);
          return;
        }

        this.schema = dataSchema;
      }

      /**
       * Validate data for the schema
       * @param  {Object} data The data to validate
       * @return {Object}      if the data is valid return the correct fields to save otherwise throw exception
       */
      SugoSchema.prototype.validate = function(data){
        var object = _(data).clone();
        var isValid = true;
        var that = this;
        // remove all keys useless
        object = _.pick(object, _(this.schema).keys());

        //TODO: CHECK THE CONSISTENCY WITH THE SCHEMA
        //throw "Element not valid for the schema"
        return object;
      }

      SugoSchema.prototype.toString = function(data){
        return JSON.stringify(this.schema);
      }

      /**
       * Check if the Schema is valid.
       * @param  {[type]}  _schema [description]
       * @return {Boolean}         [description]
       * @private
       */
      function _isNotValid(_schema){
        var not_valid = false;
        var i = 0;
        var keys = Object.keys(_schema);

        while(!not_valid && i < keys.length){
          var key = keys[i];
          var value = _schema[key];

          if(_.isArray(value)){
            not_valid = value.length > 1 || not_valid || _.some( value , _isNotValid);
          }
          else if(_.isObject(value)){
            not_valid = not_valid || _isNotValid(value);
          }else if(_.isFunction(value)){
            not_valid = true;
          }else if(value.constructor !== SugoSchema
            || value !== String
            || value !== Number
            || value !== Date ){
            not_valid = true;
          }

          i++;
        }
        return not_valid;
      }

      return sugoModule;

    }

    /**
     * Sugo Storage [localStorage]
     *
     */
    function $sugoStorage(){
        return {
          getObject : _getObject,
          setObject : _setObject,
          getArray  : _getArray,
          setArray  : _setArray,
          delete    : _delete
        }
        
        /**
         * Get object from localStorage
         * @param  {String} key : Key of the object
         * @return {Object}     : object founded
         */
        function _getObject(key){
          return JSON.parse(window.localStorage.getItem("$sugo." + key) || "{}");
        }

        /**
         * Set object to localStorage
         * @param {String} key    : Key of the object
         * @param {Object} object : Object to save
         */
        function _setObject(key, object, schema){
          var realObj = {};

          _.each(object, function(val, key){
            realObj[key] = _(val).clone();
            delete realObj[key]._private;
          });

          window.localStorage.setItem("$sugo." + key, JSON.stringify(realObj || {}));
        }

        /**
         * Get array from localStorage
         * @param  {String} key : Key of the array
         * @return {Array}     : array founded
         */
        function _getArray(key){
          return JSON.parse(window.localStorage.getItem("$sugo." + key) || "[]");
        }

        /**
         * Set array to localStorage
         * @param {String} key   : Key of the array
         * @param {Array} array : Array to save
         */
        function _setArray(key, array){
          window.localStorage.setItem("$sugo." + key, JSON.stringify(array || []));
        }

        /**
         * Delete key in localStorage
         * @param  {String} key [description]
         */
        function _delete(key){
          window.localStorage.removeItem("$sugo." + key);
        }

    }

    /**
     * Utils for capitalize string
     * @return {[type]} [description]
     */
    String.prototype.capitalized = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

})(window);