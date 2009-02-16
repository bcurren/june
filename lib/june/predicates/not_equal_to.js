Predicates.NotEqualTo = function(operand_1, operand_2) {
  this.operand_1 = operand_1;
  this.operand_2 = operand_2;
}

jQuery.extend(Predicates.NotEqualTo.prototype, Predicates.PredicateMethods);

jQuery.extend(Predicates.NotEqualTo.prototype, {
  evaluate: function(tuple) {
    return this.evaluate_operand(tuple, this.operand_1) != this.evaluate_operand(tuple, this.operand_2);
  }
});

