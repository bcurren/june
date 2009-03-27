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

      this.events_are_paused = false;
      this.queued_events = [];
    });

    def('create', function(attributes) {
      return this.insert(new this.Tuple(attributes));
    });

    def('insert', function(tuple) {
      this._tuples.push(tuple)
      this.publish_or_enqueue_event(this.on_insert_node, [tuple]);
      return tuple;
    });

    def('remove', function(tuple) {
      if (June.remove(this._tuples, tuple)) {
        this.publish_or_enqueue_event(this.on_remove_node, [tuple]);
        return tuple;
      } else {
        return null; 
      }
    });

    def('tuple_updated', function(tuple, updated_attributes) {
      this.publish_or_enqueue_event(this.on_update_node, [tuple, updated_attributes]);
    });

    def('publish_or_enqueue_event', function(subscription_node, publish_args) {
      if (this.events_are_paused) {
        this.queued_events.push(function() {
          subscription_node.publish.apply(subscription_node, publish_args);
        });
      } else {
        subscription_node.publish.apply(subscription_node, publish_args);
      }
    });

    def('pause_events', function() {
      this.events_are_paused = true;
    });

    def('resume_events', function() {
      this.events_are_paused = false;
      jQuery.each(this.queued_events, function() {
        this();
      });
      this.queued_events = [];
    });

    def('tuples', function() {
      return this._tuples;
    });

    def('has_operands', function() {
      return false;
    });

    def("update", function(snapshot_fragment) {
      this.pause_events();

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

      this.resume_events();
    });
  });
}});

