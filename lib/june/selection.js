module("June", function(c) { with(c) {
  constructor("Selection", function() {
    include(RelationMethods);

    def('initialize', function(operand, predicate) {
      this.operand = operand;
      this.predicate = predicate;
      this.on_insert_node = new June.SubscriptionNode();

      this.operand_subscriptions = [];
      this.subscribed_to_operand = false;
    });

    def('tuples', function() {
      if (this._tuples) return this._tuples;

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
      this.subscribe_to_operand_if_needed();
      return this.on_insert_node.subscribe(on_insert_handler);
    });

    def('subscribe_to_operand_if_needed', function() {
      if (!this.subscribed_to_operand) this.subscribe_to_operand();
    })

    def('subscribe_to_operand', function() {
      this.subscribed_to_operand = true;
      this.memoize_tuples();

      var self = this;
      this.operand_subscriptions.push(this.operand.on_insert(function(tuple) {
        if (self.predicate.evaluate(tuple)) self.tuple_inserted(tuple);
      }));

      this.operand_subscriptions.push(this.operand.on_update(function(tuple) {
        if (!self.contains(tuple)) {
          if (self.predicate.evaluate(tuple)) self.tuple_inserted(tuple);
        }
      }));
    });

    def('contains', function(tuple) {
      return this.tuples().indexOf(tuple) != -1;
    });

    def('memoize_tuples', function() {
      this._tuples = this.tuples();
    })

    def('tuple_inserted', function(tuple) {
      this._tuples.push(tuple);
      this.on_insert_node.publish(tuple);
    })
  });
}});