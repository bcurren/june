RelationMethods = {
  join: function(right_operand) {
    var left_operand = this;
    return {
      on: function(predicate) {
        return new June.InnerJoin(left_operand, right_operand, predicate);
      }
    }
  },

  where: function(predicate) {
    return new June.Selection(this, predicate);
  },

  map: function(fn) {
    var results = [];
    this.each(function(){
      results.push(fn.call(this));
    });
    return results;
  },

  each: function(fn) {
    var tuples = this.tuples();
    for(var i = 0; i < tuples.length; i++) {
      fn.call(tuples[i]);
    }
  }
}