module("June", function(c) { with(c) {
  constructor("Selection", function() {
    include(RelationMethods);

    def('initialize', function(operand, predicate) {
      this.operand = operand;
      this.predicate = predicate;
      this.on_insert_node = new June.SubscriptionNode();
      
      this.subscribe_to_operand();
    });

    def('tuples', function() {
      var predicate = this.predicate;
      var tuples = [];
      jQuery.each(this.operand.tuples(), function(i, tuple) {
        if (predicate.evaluate(tuple)) {
          tuples.push(tuple);
        }
      });
      return tuples;
    });

    def('on_insert', function(on_insert_handler) {
      this.on_insert_node.subscribe(on_insert_handler);
    });

    def('subscribe_to_operand', function() {
      var self = this;
      this.operand.on_insert(function(tuple) {
        if (self.predicate.evaluate(tuple)) {
          self.on_insert_node.publish(tuple);
        }
      });

      this.operand.on_update(function(tuple) {
        
      })
    });

  });
}});

