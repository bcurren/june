module("June", function(c) { with(c) {
  constructor("CompositeTuple", function() {
    def('initialize', function(left, right) {
      this.left = left;
      this.right = right;
    });

    def('get_field_value', function(attribute) {
      if (this.has_attribute(this.left, attribute)) {
        return this.left.get_field_value(attribute);
      }
      if (this.has_attribute(this.right, attribute)) {
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

    def('composed_sets', function() {
      return this.left.composed_sets().concat(this.right.composed_sets());
    });

    def('has_attribute', function(relation, attribute) {
      return relation.composed_sets().indexOf(attribute.set) != -1;
    });
  });
}});

