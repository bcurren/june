function CompositeTuple(left, right) {
  this.left = left;
  this.right = right;
}

jQuery.extend(CompositeTuple.prototype, {
  get_field_value: function(attribute) {
    if (this.left.set == attribute.set) {
      return this.left.get_field_value(attribute);
    }
    if (this.right.set == attribute.set) {
      return this.right.get_field_value(attribute);
    }
  }
});