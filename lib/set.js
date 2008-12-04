function Set(configuration_fn) {
  var configuration = new SetConfiguration(this);
  configuration_fn(configuration);
  configuration.setup_tuple_constructor();
  this._tuples = [];
}

jQuery.extend(Set.prototype, {
  create: function(attributes) {
    var tuple = new this.Tuple(attributes)
    this._tuples.push(tuple)
    return tuple;
  },

  tuples: function() {
    return this._tuples;
  }
});