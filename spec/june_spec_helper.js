require("/vendor/jquery-1.2.6.js");
require("set");
require("primitive_tuple");
require("set_configuration");
require("attribute");

Screw.Unit(function() {
  before(function() {
    User = new Set(function(configuration) {
      with(configuration) {
        attributes({
          'first_name': 'string',
          'age': 'integer'
        });

        methods({
          foo: function() {
            return "foo";
          },

          bar: function() {
            return "bar";
          }
        });
      }
    });
  });


  after(function() {
    User = undefined;
  });
});


