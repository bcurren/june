function Set(configuration_fn) {
  configuration_fn(this);
  this.setup_tuple_constructor();
}

jQuery.extend(Set.prototype, {
  setup_tuple_constructor: function() {
    this.Tuple = function() {};
    this.Tuple.prototype = this.tuple_prototype;
    this.Tuple.prototype.constructor = this.Tuple;
  },

  create: function() {
    return new this.Tuple();
  },

  methods: function(declared_methods) {
    this.tuple_prototype = declared_methods;
  }
});

