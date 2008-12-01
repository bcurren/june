function SetConfiguration(set) {
  this.set = set;
  this.set.attributes = {};
  this.tuple_constructor_prototype = {
    initialize_fields: function() {
      this.fields = {};
      for (var attribute_name in this.set.attributes) {
        var attribute = this.set.attributes[attribute_name];
        this.fields[attribute] = new Field(attribute);
      }
    },

    set_field_value: function(attribute, value) {
      if (!this.fields[attribute]) throw "No field defined for attribute " + attribute.toString();
      return this.fields[attribute].set_value(value);
    },

    get_field_value: function(attribute) {
      return this.fields[attribute].get_value();
    }
  };
}

jQuery.extend(SetConfiguration.prototype, {
  attributes: function(attributes) {
    for (var attribute_name in attributes) {
      this.attribute(attribute_name, attributes[attribute_name]);
    }
  },

  attribute: function(attribute_name, attribute_type) {
    var attribute = new Attribute(attribute_name, attribute_type, this.set);
    this.set.attributes[attribute_name] = attribute;
    this.set[attribute_name] = attribute;
    this.tuple_constructor_prototype[attribute_name] = function() {
      if (arguments.length == 1) {
        return this.set_field_value(attribute, arguments[0]);
      } else {
        return this.get_field_value(attribute);
      }
    }
  },

  methods: function(declared_methods) {
    jQuery.extend(this.tuple_constructor_prototype, declared_methods);
  },

  setup_tuple_constructor: function(configuration) {
    var set = this.set;
    this.set.Tuple = function() {
      this.set = set;
      this.initialize_fields();
    };
    this.set.Tuple.prototype = this.tuple_constructor_prototype;
    this.set.Tuple.prototype.constructor = this.set.Tuple;
  }
});