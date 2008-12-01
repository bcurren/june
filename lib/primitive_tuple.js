function PrimitiveTuple() {

}

jQuery.extend(PrimitiveTuple.prototype, {
  set_field_value: function(attribute, value) {
    return this.fields[attribute] = value;
  },
  get_field_value: function(attribute) {
    return this.fields[attribute];
  }
})