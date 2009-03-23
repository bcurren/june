module("June", function(c) { with(c) {
  constructor("SetProjection", function() {
    def('initialize', function(operand, projected_set) {
      this.operand = operand;
      this.projected_set = projected_set;
      this.operand_subscriptions = [];
      this.on_insert_node = new June.SubscriptionNode();
      this.on_remove_node = new June.SubscriptionNode();
      this.on_update_node = new June.SubscriptionNode();

      var self = this;
      this.on_insert_node.on_unsubscribe(function() {
        self.unsubscribe_from_operand_if_no_longer_needed();
      });
      this.on_remove_node.on_unsubscribe(function() {
        self.unsubscribe_from_operand_if_no_longer_needed();
      });
      this.on_update_node.on_unsubscribe(function() {
        self.unsubscribe_from_operand_if_no_longer_needed();
      });
    });

    def('tuples', function() {
      if (this._tuples) return this._tuples;
      var projected_set = this.projected_set;
      return this.operand.map(function() {
        return this.tuple_for_set(projected_set);
      });
    });

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

    def('subscribe_to_operand', function() {
      this.memoize_tuples();

      var self = this;
      this.operand.on_insert(function(composite_tuple) {
        var projected_tuple = composite_tuple.tuple_for_set(self.projected_set);
        if (!self.contains(projected_tuple)) self.tuple_inserted(projected_tuple); 
      });

      this.operand.on_remove(function(composite_tuple) {
        var projected_tuple = composite_tuple.tuple_for_set(self.projected_set);
        var operand_contains_another_instance_of_projected_tuple = (self.operand.find(self.projected_set.id.eq(projected_tuple.id())) != null);
        if (!operand_contains_another_instance_of_projected_tuple) self.tuple_removed(projected_tuple);
      });

      this.operand.on_update(function(composite_tuple, changed_attributes) {
        var updated_attribute_was_in_projected_set = false
        for (var attribute_name in changed_attributes) {
          if (changed_attributes[attribute_name].attribute.set == self.projected_set) updated_attribute_was_in_projected_set = true;
        }
        if (updated_attribute_was_in_projected_set) self.tuple_updated(composite_tuple.tuple_for_set(self.projected_set));
      });
    });

    def('memoize_tuples', function() {
      this._tuples = this.tuples();
    })

    def('has_subscribers', function() {
      return !(this.on_insert_node.is_empty() && this.on_remove_node.is_empty() && this.on_update_node.is_empty());
    });

    def('tuple_inserted', function(tuple) {
      this._tuples.push(tuple);
      this.on_insert_node.publish(tuple);
    });

    def('tuple_removed', function(tuple) {
      June.remove(this._tuples, tuple);
      this.on_remove_node.publish(tuple);
    });

    def('tuple_updated', function(tuple) {
      this.on_update_node.publish(tuple);
    });

    def('contains', function(tuple) {
      return this.tuples().indexOf(tuple) != -1;
    });
  });
}});
