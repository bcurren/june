require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("Set", function() {
    var tuple;
    before(function() {
      tuple = User.create();
    });

    describe("metaprogrammatic declarations", function() {
      describe(".global_name", function() {
        it("assigns the name of the Set", function() {
          expect(User.global_name).to(equal, "User");
        });
      });

      describe(".attributes", function() {
        it("creates an Attribute object with the given name and type with on the Set for each declared Attribute", function() {
          first_name_attribute = User.first_name
          expect(first_name_attribute).to(equal, User.attributes.first_name);
          expect(first_name_attribute.constructor).to(equal, June.Attribute);
          expect(first_name_attribute.name).to(equal, 'first_name');
          expect(first_name_attribute.type).to(equal, 'string');
          expect(first_name_attribute.set).to(equal, User);
        });

        it("creates an accessor method for each declared attribute on the Set's generated Tuple constructor", function() {
          tuple.first_name("Jan");
          expect(tuple.first_name()).to(equal, "Jan");
        });
      });

      describe(".methods", function() {
        it("associates methods with the prototype of the Set's Tuple constructor", function() {
          expect(tuple.foo).to(equal, User.Tuple.prototype.foo);
          expect(tuple.bar).to(equal, User.Tuple.prototype.bar);
        });
      });

      describe(".relates_to_many", function() {
        var tuple, expected_tuples;
        before(function() {
          tuple = User.find("dan");
          expected_tuples = Pet.where(Pet.owner_id.eq(tuple.id())).tuples();
        });

        it("creates a method with the given name that returns the #tuples of the relation defined by the given function", function() {
          expect(tuple.pets()).to(equal, expected_tuples);
        });
        
        it("defines an #each function on the relation method which iterates over the tuples in the relation", function() {
          var eached_tuples = [];
          tuple.pets.each(function() {
            eached_tuples.push(this);
          })
          expect(eached_tuples).to(equal, expected_tuples);
        });

        it("defines a #map function on the relation method which maps over the tuples in the relation", function() {
          var expected_results = [];
          tuple.pets.each(function() {
            expected_results.push(this.name());
          });
          var results = tuple.pets.map(function() {
            return this.name();
          });
          expect(results).to(equal, expected_results);
        });

        it("assigns the relation defined in the given function to the #{relation_name}_relation field on the tuple", function() {
          expect(tuple.pets_relation.tuples()).to(equal, tuple.pets());
        });
      });

      describe(".relates_to_one", function() {
        var person_tuple;
        before(function() {
          person_tuple = User.find("dan");
        });

        it("defines a method with the given name that returns the first tuple from the relation defined in the given function", function() {
          expect(person_tuple.pet()).to(equal, person_tuple.pets()[0]);
        });

        it("assigns the relation defined in the given function to the #{relation_name}_relation field on the tuple", function() {
          expect(person_tuple.pet_relation.tuples()[0]).to(equal, person_tuple.pet());
        });
      });

      describe(".has_many", function() {
        var person_tuple, species_tuple;
        before(function() {
          person_tuple = User.find("dan");
          species_tuple = Species.find("dog");
        });

        describe("when not given options", function() {
          it("sets up a many-relation with an inferred target Set and foreign key", function() {
            var expected_tuples = Pet.where(Pet.species_id.eq(species_tuple.id())).tuples();
            expect(expected_tuples).to_not(be_empty);
            expect(species_tuple.pets()).to(equal, expected_tuples);
          });
        });

        describe("when given a target_set_name and a foreign_key_name", function() {
          it("sets up a many-relation with the requested target Set and foreign key", function() {
            var expected_tuples = Pet.where(Pet.owner_id.eq(person_tuple.id())).tuples();
            expect(expected_tuples).to_not(be_empty);
            expect(person_tuple.pets_2()).to(equal, expected_tuples);
          });
        });
      });

      describe(".has_one", function() {
        var person_tuple, species_tuple;
        before(function() {
          person_tuple = User.find("dan");
          species_tuple = Species.find("dog");
        });

        describe("when not given options", function() {
          it("sets up a many-relation with an inferred target Set and foreign key", function() {
            var expected_tuple = Pet.where(Pet.species_id.eq(species_tuple.id())).tuples()[0];
            expect(expected_tuple).to_not(be_null);
            expect(species_tuple.pet()).to(equal, expected_tuple);
          });
        });

        describe("when given a target_set_name and a foreign_key_name", function() {
          it("sets up a many-relation with the requested target Set and foreign key", function() {
            var expected_tuple = Pet.where(Pet.owner_id.eq(person_tuple.id())).tuples()[0];
            expect(expected_tuple).to_not(be_null);
            expect(person_tuple.pet_2()).to(equal, expected_tuple);
          });
        });
      });

      describe(".belongs_to", function() {
        var person_tuple, pet_tuple, species_tuple;

        before(function() {
          pet_tuple = Pet.find("fido");
        });

        describe("when not given options", function() {
          it("sets up a one-relation with an inferred target Set and foreign key", function() {
            expect(pet_tuple.species()).to(equal, Species.find(pet_tuple.species_id()));
          });
        });

        describe("when given only a target_set_name", function() {
          it("sets up a one-relation with the requested target Set and a foreign key inferred from the relation name", function() {
            expect(pet_tuple.owner()).to(equal, User.find(pet_tuple.owner_id()));
          });
        });

        describe("when given a target_set_name and a foreign_key_name", function() {
          it("sets up a one-relation with the requested target Set and foreign key", function() {
            expect(pet_tuple.owner_2()).to(equal, User.find(pet_tuple.owner_id()));
          });
        });
      });
    });


    describe("#find", function() {
      describe("when passed the id of a tuple in the Set", function() {
        it("returns the tuple with that id", function() {
          var user = User.create({id: "george", first_name: "George"});
          expect(User.find("george")).to(equal, user);
        });
      });

      describe("when passed an id that does not belong to a tuple in the Set", function() {
        it("returns null", function() {
          expect(User.find("aoeu")).to(equal, null);
        });
      });
    });

    describe("#create", function() {
      var tuple, update_handler;
      before(function() {
        update_handler = mock_function();
        update_handler.function_name = "update handler";
        User.on_update(update_handler);

        tuple = User.create({
          age: 25,
          first_name: "Ryan"
        });
      });

      it("builds an instance of the Set's PrimitiveTuple constructor", function() {
        expect(tuple.constructor).to(equal, User.Tuple);
      });

      it("assigns #set on the instantiated PrimitiveTuple to self", function() {
        expect(tuple.set).to(equal, User);
      });

      it("assigns the field values for the given attributes hash", function() {
        expect(tuple.first_name()).to(equal, "Ryan")
        expect(tuple.age()).to(equal, 25)
      });

      it("adds the created object to #tuples", function() {
        expect(User.tuples().indexOf(tuple)).to_not(equal, -1);
      });

      it("does not trigger #on_update handlers while initializing the fields of the created tuple", function() {
        expect(update_handler).to_not(have_been_called);
      });
    });

    describe("#insert", function() {
      it("adds the created object to #tuples", function() {
        var tuple = new User.Tuple({
          age: 25,
          first_name: "Ryan"
        });
        expect(User.tuples().indexOf(tuple)).to(equal, -1);
        User.insert(tuple);
        expect(User.tuples().indexOf(tuple)).to_not(equal, -1);
      });
    });

    describe("#remove", function() {
      describe("when given a tuple in #tuples", function() {
        it("removes the given object from #tuples", function() {
          var tuple = User.find("bob")
          expect(tuple).to_not(be_null);
          User.remove(tuple);
          expect(User.find("bob")).to(be_null);
        });
      });

      describe("when given an object not in #tuples", function() {
        it("returns null", function() {
          expect(User.remove("nothing")).to(equal, null);
        });
      });
    });
    
    describe("#on_insert", function() {
      it("returns a Subscription for the #on_insert_node", function() {
        var subscription = User.on_insert(function() {});
        expect(subscription.node).to(equal, User.on_insert_node);
      });
    });

    describe("#on_remove", function() {
      it("returns a Subscription for the #on_remove_node", function() {
        var subscription = User.on_remove(function() {});
        expect(subscription.node).to(equal, User.on_remove_node);
      });
    });

    describe("#on_update", function() {
      it("returns a Subscription for the #on_update_node", function() {
        var subscription = User.on_update(function() {});
        expect(subscription.node).to(equal, User.on_update_node);
      });
    });

    describe("#has_subscribers", function() {
      context("if a handler has been registered with #on_insert", function() {
        it("returns true", function() {
          User.on_insert(function() {});
          expect(User.has_subscribers()).to(be_true);
        });
      });

      context("if a handler has been registered with #on_remove", function() {
        it("returns true", function() {
          User.on_remove(function() {});
          expect(User.has_subscribers()).to(be_true);
        });
      });

      context("if a handler has been registered with #on_update", function() {
        it("returns true", function() {
          User.on_update(function() {});
          expect(User.has_subscribers()).to(be_true);
        });
      });

      context("if no handlers have been registered", function() {
        it("returns false", function() {
          expect(User.has_subscribers()).to(be_false);
        });
      });
    });

    describe("event handling", function() {
      describe("when a tuple is inserted into the Set", function() {
        it("triggers #on_insert handlers with the inserted tuple", function() {
          var insert_handler = mock_function();
          insert_handler.function_name = "insert handler";
          User.on_insert(insert_handler);
          
          var tuple = User.create({id: "emma", first_name: "Emma"});
          expect(insert_handler).to(have_been_called, once);
          expect(insert_handler).to(have_been_called, with_args(tuple));
        });
      });

      describe("when a tuple in the Set is removed", function() {
        it("triggers #on_remove handlers with the removed tuple", function() {
          var remove_handler = mock_function();
          remove_handler.function_name = "remove handler";
          User.on_remove(remove_handler);

          var tuple = User.find("bob");
          User.remove(tuple);
          
          expect(remove_handler).to(have_been_called, once);
          expect(remove_handler).to(have_been_called, with_args(tuple));
        });
      });

      describe("when a tuple in the Set is updated", function() {
        it("triggers #on_update handlers with the updated tuple and a changed attributes object", function() {
          var update_handler = mock_function();
          update_handler.function_name = "update handler";
          User.on_update(update_handler);

          var tuple = User.find("bob");

          var old_value = tuple.age();
          var new_value = old_value + 1;
          
          tuple.age(new_value);
          expect(update_handler).to(have_been_called, once);

          expect(update_handler.most_recent_args[0]).to(equal, tuple);
          var changed_attributes = update_handler.most_recent_args[1];

          expect(changed_attributes.age).to_not(equal, null);
          expect(changed_attributes.age.old_value).to(equal, old_value);
          expect(changed_attributes.age.new_value).to(equal, new_value);
          expect(changed_attributes.age.attribute).to(equal, User.age);
        });
      });
    });
  });
}});