Predicates.EqualTo = function(operand_1, operand_2) {
  this.operand_1 = operand_1;
  this.operand_2 = operand_2;
}

jQuery.extend(Predicates.EqualTo.prototype, {
  evaluate: function(tuple) {
    function evaluate_operand(operand) {
      if (operand.constructor == Attribute) {
        return tuple.get_field_value(operand)
      } else {
        return operand;
      }
    }
    return evaluate_operand(this.operand_1) == evaluate_operand(this.operand_2)
  }
});