function Set(configuration_fn) {
  var configuration = new SetConfiguration(this);
  configuration_fn(configuration);
  configuration.setup_tuple_constructor();
}

jQuery.extend(Set.prototype, {
  create: function() {
    return new this.Tuple();
  }
});