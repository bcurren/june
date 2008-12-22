Predicates.PredicateMethods = {
  evaluate_operand: function(tuple, operand) {
    if (operand && operand.constructor == Attribute) {
      return tuple.get_field_value(operand)
    } else {
      return operand;
    }
  }
}