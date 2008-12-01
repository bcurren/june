function Field(attribute) {
  this.attribute = attribute;
}

jQuery.extend(Field.prototype, {
  set_value: function(value) {
    return this.value = value;
  },

  get_value: function(value) {
    return this.value;
  }
})