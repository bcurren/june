require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("Set", function() {
    var tuple;
    before(function() {
      tuple = User.create();
    });

    describe("metaprogrammatic declarations", function() {
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