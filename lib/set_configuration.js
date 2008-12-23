function SetConfiguration(set) {
  this.set = set;
  this.set.attributes = {};
  this.relation_definitions = [];
  this.tuple_constructor_prototype = jQuery.extend({}, TupleMethods);
}

jQuery.extend(SetConfiguration.prototype, {
  global_name: function(global_name) {
    this.set.global_name = global_name;
  },

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

  relates_to_many: function(relation_name, definition) {
    definition.singleton = false;
    this.relation_definitions.push([relation_name, definition]);
  },

  relates_to_one: function(relation_name, definition) {
    definition.singleton = true;
    this.relation_definitions.push([relation_name, definition]);
  },

  has_many: function(relation_name, options) {
    options = options || {};
    var target_set_name = options.target_set_name || relation_name.singularize().camelize();
    var foreign_key_name = options.foreign_key_name || this.set.global_name.singularize().underscore() + "_id";
    
    this.relates_to_many(relation_name, function() {
      var target_set = window[target_set_name];
      var foreign_key = target_set[foreign_key_name];
      return target_set.where(foreign_key.eq(this.id()));
    });
  },

  methods: function(declared_methods) {
    jQuery.extend(this.tuple_constructor_prototype, declared_methods);
  },

  setup_tuple_constructor: function(configuration) {
    var set = this.set;
    var relation_definitions = this.relation_definitions;
    this.set.Tuple = function(attributes) {
      this.set = set;
      this.initialize_fields();
      if (attributes) this.assign_attributes(attributes);
      this.initialize_relations(relation_definitions);
    };
    this.set.Tuple.prototype = this.tuple_constructor_prototype;
    this.set.Tuple.prototype.constructor = this.set.Tuple;
  }
});