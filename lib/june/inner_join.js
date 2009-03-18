module("June", function(c) { with(c) {
  constructor("InnerJoin", function() {
    include(June.RelationMethods);

    def('initialize', function(left_operand, right_operand, predicate) {
      this.left_operand = left_operand;
      this.right_operand = right_operand;
      this.predicate = predicate;

      this.on_insert_node = new June.SubscriptionNode();
      this.on_remove_node = new June.SubscriptionNode();
    });

    def('tuples', function() {
      if (this._tuples) return this._tuples;
      
      var tuples = [];
      var predicate = this.predicate;
      jQuery.each(this.cartesean_product(), function() {
        if (predicate.evaluate(this)) {
          tuples.push(this);
        }
      });
      return tuples;
    });

    def('cartesean_product', function() {
      var product = [];
      var self = this;
      jQuery.each(self.left_operand.tuples(), function(i, left_tuple) {
        jQuery.each(self.right_operand.tuples(), function(i, right_tuple) {
          product.push(new June.CompositeTuple(left_tuple, right_tuple));
        });
      });
      return product;
    });

    def('on_insert', function(on_insert_handler) {
      this.subscribe_to_operand_if_needed();
      return this.on_insert_node.subscribe(on_insert_handler);
    });

    def('on_remove', function(on_remove_handler) {

    });

    def('subscribe_to_operand_if_needed', function() {
      if (!this.has_subscribers()) this.subscribe_to_operand();
    });

    def('subscribe_to_operand', function() {
      this.memoize_tuples();

      var self = this;
      this.left_operand.on_insert(function(left_tuple) {
        jQuery.each(self.right_operand.tuples(), function(i, right_tuple) {
          var composite_tuple = new June.CompositeTuple(left_tuple, right_tuple);
          if (self.predicate.evaluate(composite_tuple)) self.tuple_inserted(composite_tuple);
        });
      });

      this.right_operand.on_insert(function(right_tuple) {
        jQuery.each(self.left_operand.tuples(), function(i, left_tuple) {
          var composite_tuple = new June.CompositeTuple(left_tuple, right_tuple);
          if (self.predicate.evaluate(composite_tuple)) self.tuple_inserted(composite_tuple);
        });
      });
    });

    def('tuple_inserted', function(composite_tuple) {
      this._tuples.push(composite_tuple);
      this.on_insert_node.publish(composite_tuple);
    });

    def('has_subscribers', function() {
      return !(this.on_insert_node.is_empty() && this.on_remove_node.is_empty());
    });

    def('contains', function(tuple) {
      return this.tuples().indexOf(tuple) != -1;
    });

    def('memoize_tuples', function() {
      this._tuples = this.tuples();
    })
  });
}});

