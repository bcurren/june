require("/vendor/jquery-1.2.6.js");
require("set");
require("inner_join");
require("selection");
require("composite_tuple");
require("set_configuration");
require("attribute");
require("field");
require("set_projection");
require("predicates");
require("predicates/equal_to");

Screw.Unit(function() {
  before(function() {
    User = new Set(function(configuration) {
      with(configuration) {
        attributes({
          'id': 'string',
          'first_name': 'string',
          'age': 'integer'
        });


        has_many("pets");

        relates_to_many("pet_species", function() {
          return this.pets.join(Species).where(Pet.species_id.eq(Species.id)).project(Species);
        })

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

    Pet = new Set(function(configuration) {
      with(configuration) {
        attributes({
          'id': 'string',
          'name': 'string',
          'owner_id': 'integer'
        });
      }
    });

    User.create({id: "dan", first_name: "Dan", age: 21});
    User.create({id: "bob", first_name: "Bob", age: 21});
    User.create({id: "joe", first_name: "Joe", age: 21});
    User.create({id: "alice", first_name: "Alice", age: 22});
    User.create({id: "jean", first_name: "Jean", age: 22});

    Pet.create({id: "fido", owner_id: "dan"});
    Pet.create({id: "cleo", owner_id: "dan"});
    Pet.create({id: "blue", owner_id: "bob"});
    Pet.create({id: "stray", owner_id: null});
  });


  after(function() {
    User = undefined;
    Pet = undefined;
  });
});


