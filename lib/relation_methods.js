RelationMethods = {
  join: function(right_operand) {
    var left_operand = this;
    return {
      on: function(predicate) {
        return new InnerJoin(left_operand, right_operand, predicate);
      }
    }
  },

  where: function(predicate) {
    return new Selection(this, predicate);
  },

  map: function(f) {
    var tuples = this.tuples();
    var results = [];
    for(var i = 0; i < tuples.length; i++) {
      results.push(f.call(tuples[i]));
    }
    return results;
  }
  
}