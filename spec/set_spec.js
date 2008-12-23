require("/specs/june_spec_helper");

Screw.Unit(function() {
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
          expect(first_name_attribute.constructor).to(equal, Attribute);
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
  
        });
      });
    });

    describe("#create", function() {
      var tuple;
      before(function() {
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
    });
  });
});