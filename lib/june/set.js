module("June", function(c) { with(c) {
  constructor("Set", function() {
    include(RelationMethods);
  
    def('initialize', function(configuration_fn) {
      var configuration = new June.SetConfiguration(this);
      configuration_fn(configuration);
      configuration.setup_tuple_constructor();
      this._tuples = [];
      this.on_insert_node = new June.SubscriptionNode();
      this.on_remove_node = new June.SubscriptionNode();
      this.on_update_node = new June.SubscriptionNode();
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
      this.on_insert_node.publish(tuple);
      return tuple;
    });

    def('remove', function(tuple) {
      if (June.remove(this._tuples, tuple)) {
        this.on_remove_node.publish(tuple);
        return tuple;
      } else {
        return null; 
      }
    });

    def('tuple_updated', function(tuple) {
      this.on_update_node.publish(tuple);
    });

    def('tuples', function() {
      return this._tuples;
    });

    def('on_insert', function(insert_handler) {
      return this.on_insert_node.subscribe(insert_handler);
    });

    def('on_remove', function(remove_handler) {
      return this.on_remove_node.subscribe(remove_handler);
    });

    def('on_update', function(update_handler) {
      return this.on_update_node.subscribe(update_handler);
    });
  });
}});

