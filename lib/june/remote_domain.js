module("June", function(c) { with(c) {
  constructor("RemoteDomain", function() {
    def("initialize", function(url) {
      this.url = url;
    });

    def("update", function(tuple, attribute_values, update_callback) {
      jQuery.ajax({
        url: this.url,
        type: "PUT",
        data: {
          tuple: JSON.stringify({ set: tuple.set.global_name, id: tuple.id() }),
          attribute_values: JSON.stringify(attribute_values)
        },
        success: function(response) {
          tuple.update(JSON.parse(response));
          update_callback(tuple);
        }
      })
    });
    
    def("pull", function(relations, pull_callback) {
      var snapshot = this.fetch(relations, function(snapshot) {
        June.GlobalDomain.update(snapshot, pull_callback);
      });
    });

    def("fetch", function(relations, fetch_callback) {
      var relation_wire_representations = June.map(relations, function() {
        return this.wire_representation();
      });

      jQuery.ajax({
        url: this.url,
        type: "GET",
        data: {
          relations: JSON.stringify(relation_wire_representations)
        },
        success: function(response) {
          fetch_callback(JSON.parse(response));
        }
      });
    });
  });
}});