module("June", function(c) { with(c) {
  module("SubscriberMethods", function() {
    def("subscribe", function(){
      this.on_insert_node = new June.SubscriptionNode();
      this.on_remove_node = new June.SubscriptionNode();
      this.on_update_node = new June.SubscriptionNode();

      var self = this;
      this.on_insert_node.on_unsubscribe(function() {
        self.unsubscribe_from_operands_if_no_longer_needed();
      });
      this.on_remove_node.on_unsubscribe(function() {
        self.unsubscribe_from_operands_if_no_longer_needed();
      });
      this.on_update_node.on_unsubscribe(function() {
        self.unsubscribe_from_operands_if_no_longer_needed();
      });
    });

    def('unsubscribe_from_operands_if_no_longer_needed', function() {
      if (!this.has_subscribers()) {
        this.unsubscribe_from_operands();
      }
    });

    def('unsubscribe_from_operands', function() {
      jQuery.each(this.operand_subscriptions, function() {
        this.destroy();
      });
      this.operand_subscriptions = [];
      this._tuples = null;
    });

    // Similar set of methods
    def('on_insert', function(on_insert_handler) {
      this.subscribe_to_operand_if_needed();
      return this.on_insert_node.subscribe(on_insert_handler);
    });

    def('on_remove', function(on_remove_handler) {
      this.subscribe_to_operand_if_needed();
      return this.on_remove_node.subscribe(on_remove_handler);
    });

    def('on_update', function(on_update_handler) {
      this.subscribe_to_operand_if_needed();
      return this.on_update_node.subscribe(on_update_handler);
    });

    def('subscribe_to_operand_if_needed', function() {
      if (!this.has_subscribers()) this.subscribe_to_operand();
    });

    // Yet another set of shared methods
    def('memoize_tuples', function() {
      this._tuples = this.tuples();
    });

    def('has_subscribers', function() {
      return !(this.on_insert_node.is_empty() && this.on_remove_node.is_empty() && this.on_update_node.is_empty());
    });

    def('contains', function(tuple) {
      return this.tuples().indexOf(tuple) != -1;
    });

    // Another group?
    def('tuple_inserted', function(tuple) {
      this._tuples.push(tuple);
      this.on_insert_node.publish(tuple);
    });

    def('tuple_removed', function(tuple) {
      June.remove(this._tuples, tuple);
      this.on_remove_node.publish(tuple);
    });

    def('tuple_updated', function(tuple, updated_attributes) {
      this.on_update_node.publish(tuple, updated_attributes);
    });

  });
}});