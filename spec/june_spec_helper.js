require("/vendor/jquery-1.2.6.js");
require("string");
require("relation_methods");
require("tuple_methods");
require("set");
require("inner_join");
require("selection");
require("composite_tuple");
require("set_configuration");
require("attribute");
require("field");
require("set_projection");
require("predicates");
require("predicates/predicate_methods");
require("predicates/equal_to");
require("predicates/not_equal_to");

Screw.Unit(function() {
  before(function() {
    User = new Set(function(configuration) {
      with(configuration) {
        global_name("User");

        attributes({
          'id': 'string',
          'first_name': 'string',
          'age': 'integer',
          'dob': 'datetime'
        });

        relates_to_many("pets", function() {
          return Pet.where(Pet.owner_id.eq(this.id()));
        });

        has_many("pets_2", {target_set_name: "Pet", foreign_key_name: "owner_id"});
        has_one("pet_2", {target_set_name: "Pet", foreign_key_name: "owner_id"});

        relates_to_one("pet", function() {
          return this.pets_relation;
        }),

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
        global_name("Pet");

        attributes({
          'id': 'string',
          'name': 'string',
          'owner_id': 'string',
          'species_id': 'string'
        });

        belongs_to("species");
        belongs_to("owner", {target_set_name: "User"});
        belongs_to("owner_2", {target_set_name: "User", foreign_key_name: "owner_id"});
      }
    });

    Species = new Set(function(configuration) {
      with(configuration) {
        global_name("Species");

        attributes({
          'id': 'string',
          'name': 'string'
        });

        has_many("pets");
        has_one("pet");
      }
    });

    User.create({id: "dan", first_name: "Dan", age: 21});
    User.create({id: "bob", first_name: "Bob", age: 21});
    User.create({id: "joe", first_name: "Joe", age: 21});
    User.create({id: "alice", first_name: "Alice", age: 22});
    User.create({id: "jean", first_name: "Jean", age: 22});

    Pet.create({id: "fido", name: "Fido", owner_id: "dan", species_id: "dog"});
    Pet.create({id: "cleo", name: "Cleo", owner_id: "dan", species_id: "fish"});
    Pet.create({id: "blue", name: "Blue", owner_id: "bob", species_id: "dog"});
    Pet.create({id: "stray", name: "Unknown", owner_id: null, species_id: "dog"});

    Species.create({id: "dog", name: "Dog"});
    Species.create({id: "fish", name: "Fish"});
  });


  after(function() {
    User = undefined;
    Pet = undefined;
    Species = undefined;
  });
});


