module("June", function(c) { with(c) {
  constructor("InnerJoin", function() {
    include(June.RelationMethods);

    def('initialize', function(left_operand, right_operand, predicate) {
      this.left_operand = left_operand;
      this.right_operand = right_operand;
      this.predicate = predicate;
    });

    def('tuples', function() {
      var tuples = [];
      var predicate = this.predicate;
      jQuery.each(this.cartesean_product(), function(i, composite_tuple) {
        if (predicate.evaluate(composite_tuple)) {
          tuples.push(composite_tuple);
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
        })
      })
      return product;
    });
  });
}});

