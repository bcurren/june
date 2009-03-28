module("June", function(c) { with(c) {
  constructor("Domain", function() {
    def('define_set', function(name, definition) {
      this[name] = new June.Set(definition);
    });

    def("update", function(snapshot, callback) {
      for (var set_name in snapshot) {
        this[set_name].pause_events();
      }
      for (var set_name in snapshot) {
        this[set_name].update(snapshot[set_name]);
      }

      if (callback) callback();

      for (var set_name in snapshot) {
        this[set_name].resume_events();
      }
    });
  });
}});