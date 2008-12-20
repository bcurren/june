function Attribute(name, type, set) {
  this.name = name;
  this.type = type;
  this.set = set;
}

jQuery.extend(Attribute.prototype, {
  eq: function(other) {
    return new Predicates.EqualTo(this, other);
  },
  
  neq: function(other) {
    return new Predicates.NotEqualTo(this, other);
  }
});