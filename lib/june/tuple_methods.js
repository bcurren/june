module("June", function(c) { with(c) {
  module("TupleMethods", function(c) {
    def('initialize_fields', function() {
      this.fields = {};
      for (var attribute_name in this.set.attributes) {
        var attribute = this.set.attributes[attribute_name];
        this.fields[attribute_name] = new June.Field(attribute);
      }
    });

    def('initialize_relations', function(relation_definitions) {
      for (var i = 0; i < relation_definitions.length; i++) {
        var relation_name = relation_definitions[i][0];
        var relation_definition = relation_definitions[i][1];
        this.initialize_relation(relation_name, relation_definition);
      }
    });

    def('initialize_relation', function(relation_name, relation_definition) {
      var relation = relation_definition.call(this);
      this[relation_name + "_relation"] = relation;

      if (relation_definition.singleton) {
        this[relation_name] = function() {
          return relation.tuples()[0];
        };
      } else {
        var relation_method = function() {
          return relation.tuples();
        };
        relation_method.each = function(fn) {
          return relation.each(fn);
        };
        relation_method.map = function(fn) {
          return relation.map(fn);
        };
        this[relation_name] = relation_method;
      }
    });

    def('set_field_value', function(attribute, value) {
      if (!this.fields[attribute.name]) throw "No field defined for attribute " + attribute.toString();
      var old_value = this.get_field_value(attribute, value);
      var new_value = this.fields[attribute.name].set_value(value);
      if (this.update_notification_enabled && old_value != value) this.set.tuple_updated(this);
      return new_value;
    });

    def('get_field_value', function(attribute) {
      return this.fields[attribute.name].get_value();
    });

    def('assign_attributes', function(initial_attributes) {
      for (var attribute_name in initial_attributes) {
        this[attribute_name].call(this, initial_attributes[attribute_name]);
      }
    });

    def('tuple_for_set', function(set) {
      if (this.set == set) {
        return this;
      } else {
        return null;
      }
    });

    def('has_attribute', function(attribute) {
      return attribute.set == this.set;
    });
  });
}});
