function Selection(operand, predicate) {
  this.operand = operand;
  this.predicate = predicate;
}

jQuery.extend(Selection.prototype, RelationMethods);

jQuery.extend(Selection.prototype, {
  tuples: function() {
    var predicate = this.predicate;
    var tuples = [];
    jQuery.each(this.operand.tuples(), function(i, tuple) {
      if (predicate.evaluate(tuple)) {
        tuples.push(tuple);
      }
    });
    return tuples;
  }
});