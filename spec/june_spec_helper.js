require("/vendor/jquery-1.2.6.js");
require("set");
require("set_configuration");
require("attribute");
require("field");
require("predicates");
require("predicates/equal_to");

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


