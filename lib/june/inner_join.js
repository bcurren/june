module("June", function(c) { with(c) {
  constructor("InnerJoin", function() {
    include(June.RelationMethods);
    include(June.SubscriberMethods);

    def('initialize', function(left_operand, right_operand, predicate) {
      this.left_operand = left_operand;
      this.right_operand = right_operand;
      this.predicate = predicate;
      this.operand_subscriptions = [];
      this.subscribe();
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

    def('subscribe_to_operand', function() {
      this.memoize_tuples();

      var self = this;
      this.operand_subscriptions.push(this.left_operand.on_insert(function(left_tuple) {
        jQuery.each(self.right_operand.tuples(), function(i, right_tuple) {
          var composite_tuple = new June.CompositeTuple(left_tuple, right_tuple);
          if (self.predicate.evaluate(composite_tuple)) self.tuple_inserted(composite_tuple);
        });
      }));

      this.operand_subscriptions.push(this.right_operand.on_insert(function(right_tuple) {
        jQuery.each(self.left_operand.tuples(), function(i, left_tuple) {
          var composite_tuple = new June.CompositeTuple(left_tuple, right_tuple);
          if (self.predicate.evaluate(composite_tuple)) self.tuple_inserted(composite_tuple);
        });
      }));

      this.operand_subscriptions.push(this.left_operand.on_remove(function(left_tuple) {
        jQuery.each(self.tuples(), function(i, composite_tuple) {
          if (composite_tuple.left == left_tuple) self.tuple_removed(composite_tuple);
        });
      }));

      this.operand_subscriptions.push(this.right_operand.on_remove(function(right_tuple) {
        jQuery.each(self.tuples(), function(i, composite_tuple) {
          if (composite_tuple.right == right_tuple) self.tuple_removed(composite_tuple);
        });
      }));

      this.operand_subscriptions.push(this.left_operand.on_update(function(left_tuple, changed_attributes) {
        self.right_operand.each(function() {
          var composite_tuple = new June.CompositeTuple(left_tuple, this);
          var extant_composite_tuple = self.find_composite_tuple_that_matches(composite_tuple);
          if (self.predicate.evaluate(composite_tuple)) {
            if (extant_composite_tuple) {
              self.tuple_updated(extant_composite_tuple, changed_attributes);
            } else {
              self.tuple_inserted(composite_tuple);
            }
          } else {
            if (extant_composite_tuple) self.tuple_removed(extant_composite_tuple);
          }
        });
      }));

      this.operand_subscriptions.push(this.right_operand.on_update(function(right_tuple, changed_attributes) {
        self.left_operand.each(function() {
          var composite_tuple = new June.CompositeTuple(this, right_tuple);
          var extant_composite_tuple = self.find_composite_tuple_that_matches(composite_tuple);
          if (self.predicate.evaluate(composite_tuple)) {
            if (extant_composite_tuple) {
              self.tuple_updated(extant_composite_tuple, changed_attributes);
            } else {
              self.tuple_inserted(composite_tuple);
            }
          } else {
            if (extant_composite_tuple) self.tuple_removed(extant_composite_tuple);
          }
        });
      }));
    });

    // Private
    
    def('find_composite_tuple_that_matches', function(composite_tuple) {
      var found_tuple = null;
      this.each(function() {
        if (this.left == composite_tuple.left && this.right == composite_tuple.right) found_tuple = this;
      });
      return found_tuple;
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

  });
}});

