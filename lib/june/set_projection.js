module("June", function(c) { with(c) {
  constructor("SetProjection", function() {
    def('initialize', function(operand, projected_set) {
      this.operand = operand;
      this.projected_set = projected_set;
    });

    def('tuples', function() {
      var projected_set = this.projected_set;
      return this.operand.map(function() {
        return this.tuple_for_set(projected_set);
      });
    });
  });
}});
