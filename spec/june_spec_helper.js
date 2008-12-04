require("/vendor/jquery-1.2.6.js");
require("set");
require("selection");
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

    User.create({first_name: "Dan", age: 21})
    User.create({first_name: "Bob", age: 21})
    User.create({first_name: "Joe", age: 21})
    User.create({first_name: "Alice", age: 22})
    User.create({first_name: "Jean", age: 22})

  });


  after(function() {
    User = undefined;
  });
});


