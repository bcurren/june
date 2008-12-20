RelationMethods = {
  join: function(right_operand) {
    var left_operand = this;
    return {
      on: function(predicate) {
        return new InnerJoin(left_operand, right_operand, predicate);
      }
    }
  }
}