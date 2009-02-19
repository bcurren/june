module("June", function(c) { with(c) {
  constructor("Set", function() {
    include(RelationMethods);
  
    def('initialize', function(configuration_fn) {
      var configuration = new June.SetConfiguration(this);
      configuration_fn(configuration);
      configuration.setup_tuple_constructor();
      this._tuples = [];
      this.insert_handlers = [];
      this.remove_handlers = [];
    });

    def('find', function(id) {
      var found = null;
      var self = this;
      jQuery.each(this._tuples, function() {
        if (this.id() == id) {
          found = this;
        }
      });
      return found;
    });

    def('create', function(attributes) {
      return this.insert(new this.Tuple(attributes));
    });

    def('insert', function(tuple) {
      this._tuples.push(tuple)
      jQuery.each(this.insert_handlers, function() {
        this(tuple);
      });
      return tuple;
    });

    def('remove', function(tuple) {
      var tuple_index = this._tuples.indexOf(tuple);
      if (tuple_index == -1) return null;
      this._tuples.splice(tuple_index, 1);
      jQuery.each(this.remove_handlers, function() {
        this(tuple);
      });
      return tuple;
    });

    def('tuples', function() {
      return this._tuples;
    });

    def('on_insert', function(insert_handler) {
      this.insert_handlers.push(insert_handler);
    });

    def('on_remove', function(remove_handler) {
      this.remove_handlers.push(remove_handler);
    });
  });
}});

