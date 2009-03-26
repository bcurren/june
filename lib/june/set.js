module("June", function(c) { with(c) {
  constructor("Set", function() {
    include(June.RelationMethods);
    include(June.Subscribable);
    include(June.TupleSupervisor);
  
    def('initialize', function(configuration_fn) {
      var configuration = new June.SetConfiguration(this);
      configuration_fn(configuration);
      configuration.setup_tuple_constructor();
      this._tuples = [];
      this.initialize_nodes();
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

    def("update", function(snapshot_fragment) {
      for (var id in snapshot_fragment) {
        var tuple = this.find(id);
        var attributes = snapshot_fragment[id];
        if (!tuple) {
          this.create(attributes);
        } else {
          tuple.update(attributes);
        }
      }
      var self = this;
      this.each(function() {
        var tuple = this;
        if (!snapshot_fragment[tuple.id()]) {
          self.remove(tuple);
        }
      });
    });

    def('tuples', function() {
      return this._tuples;
    });

    def('has_operands', function() {
      return false;
    });

  });
}});

