function SetConfiguration(set) {
  this.set = set;
  this.set.attributes = {};
  this.tuple_constructor_prototype = {
    initialize_fields: function() {
      this.fields = {};
      for (var attribute_name in this.set.attributes) {
        var attribute = this.set.attributes[attribute_name];
        this.fields[attribute_name] = new Field(attribute);
      }
    },

    set_field_value: function(attribute, value) {
      if (!this.fields[attribute.name]) throw "No field defined for attribute " + attribute.toString();
      return this.fields[attribute.name].set_value(value);
    },

    get_field_value: function(attribute) {
      return this.fields[attribute.name].get_value();
    },

    assign_attributes: function(initial_attributes) {
      for (var attribute_name in initial_attributes) {
        this[attribute_name].call(this, initial_attributes[attribute_name]);
      }
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
    this.set.Tuple = function(attributes) {
      this.set = set;
      this.initialize_fields();
      if (attributes) this.assign_attributes(attributes);
    };
    this.set.Tuple.prototype = this.tuple_constructor_prototype;
    this.set.Tuple.prototype.constructor = this.set.Tuple;
  }
});