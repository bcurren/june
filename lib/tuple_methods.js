TupleMethods = {
  initialize_fields: function() {
    this.fields = {};
    for (var attribute_name in this.set.attributes) {
      var attribute = this.set.attributes[attribute_name];
      this.fields[attribute_name] = new Field(attribute);
    }
  },

  initialize_relations: function(relation_definitions) {
    for (var relation_name in relation_definitions) {
      this.initialize_relation(relation_name, relation_definitions[relation_name]);
    }
  },

  initialize_relation: function(relation_name, relation_definition) {
    var relation = relation_definition.call(this);
    var relation_method = function() {
      return relation.tuples();
    }
    relation_method.each = function(fn) {
      return relation.each(fn);
    }
    relation_method.map = function(fn) {
      return relation.map(fn);
    }
    this[relation_name] = relation_method;
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
  },

  tuple_for_set: function(set) {
    if (this.set == set) {
      return this;
    } else {
      return null;
    }
  }
};