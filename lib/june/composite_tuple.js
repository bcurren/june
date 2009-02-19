module("June", function(c) { with(c) {
  constructor("CompositeTuple", function() {
    def('initialize', function(left, right) {
      this.left = left;
      this.right = right;
    });

    def('get_field_value', function(attribute) {
      if (this.left.set == attribute.set) {
        return this.left.get_field_value(attribute);
      }
      if (this.right.set == attribute.set) {
        return this.right.get_field_value(attribute);
      }
    });

    def('tuple_for_set', function(set) {
      var tuple = this.left.tuple_for_set(set) || this.right.tuple_for_set(set)
      if (tuple) {
        return tuple;
      } else {
        return null;
      }
    });
  });
}});
