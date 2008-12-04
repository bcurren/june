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
          console.debug(tuple.fields);
          expect(tuple.first_name()).to(equal, "Jan");
        });
      });

      describe(".methods", function() {
        it("associates methods with the prototype of the Set's Tuple constructor", function() {
          expect(tuple.foo).to(equal, User.Tuple.prototype.foo);
          expect(tuple.bar).to(equal, User.Tuple.prototype.bar);
        });
      });
    });

    describe("The generated Set.Tuple constructor associated with each Set", function() {
      describe("#get_field_value", function() {
        describe("when called with an Attribute that is defined on the Set", function() {
          it("retrieves the value in the corresponding Field", function() {
            tuple.set_field_value(tuple.set.first_name, "Wil");
            expect(tuple.get_field_value(tuple.set.first_name)).to(equal, "Wil");
          });
        });

        describe("when called with a value that is not a defined Attribute on the Set", function() {
          it("raises an exception", function() {
            var exception;
            try {
              tuple.get_field_value("first_name");
            } catch(e) {
              exception = e;
            }
            expect(exception).to_not(equal, undefined);
          });
        });
      });

      describe("#set_field_value", function() {
        describe("when called with an Attribute that is defined on the Set", function() {
          it("stores the value in the corresponding Field", function() {
            tuple.set_field_value(tuple.set.first_name, "Wil");
            expect(tuple.get_field_value(tuple.set.first_name)).to(equal, "Wil");
          });
        });

        describe("when called value that is not a defined Attribute on the Set", function() {
          it("raises an exception", function() {
            var exception;
            try {
              tuple.set_field_value("first_name", "Moo");
            } catch(e) {
              exception = e;
            }
            expect(exception).to_not(equal, undefined);
          });
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