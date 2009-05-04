module("June", function(c) { with(c) {
  module("Relations", function() {
    constructor("Ordering", function() {
      def('initialize', function(operand, attribute, direction) {
        this.operand = operand;
        this.attribute = attribute;
        this.direction = direction;
      });

      def('all', function() {
        return this.operand.all().sort(this.comparator());
      });

      def('comparator', function() {
        var self = this;
        return function(a, b) {
          var a_value = a.get_field_value(self.attribute);
          var b_value = b.get_field_value(self.attribute);
          if (a_value == b_value) return 0;
          return self.direction_coefficient() * ((a_value < b_value) ? -1 : 1);
        };
      });

      def('direction_coefficient', function() {
        return (this.direction == "asc") ? 1 : -1;
      });
    });
  });
}});