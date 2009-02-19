module("June", function(c) { with(c) {
  constructor("Selection", function() {
    include(RelationMethods);

    def('initialize', function(operand, predicate) {
      this.operand = operand;
      this.predicate = predicate;
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
  });
}});

