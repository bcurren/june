function SetProjection(operand, projected_set) {
  this.operand = operand;
  this.projected_set = projected_set;
}

jQuery.extend(SetProjection.prototype, {
  tuples: function() {
    var projected_set = this.projected_set;
    return this.operand.map(function() {
      return this.tuple_for_set(projected_set);
    });
  }
});