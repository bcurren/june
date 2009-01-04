require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("The generated Set.Tuple constructor associated with each Set", function() {

    var tuple;
    before(function() {
      tuple = User.find("bob");
    });
    
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
            tuple.get_field_value(Pet.owner_id);
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

    describe("#tuple_for_set", function() {
      describe("when passed the parent Set", function() {
        it("returns itself", function() {
          expect(tuple.tuple_for_set(User)).to(equal, tuple);
        });
      });

      describe("when passed a Set other than the parent Set", function() {
        it("returns null", function() {
          expect(tuple.tuple_for_set(Pet)).to(equal, null);
        });
      });
    });
  });
});