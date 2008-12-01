require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("PrimitiveTuple", function() {
    var tuple;

    before(function() {
      tuple = User.create();
    });



    describe("#set_field_value", function() {
      describe("when called with an attribute defined on #set", function() {

        it("stores the value in the corresponding field", function() {
          tuple.set_field_value(tuple.set.first_name, "Wil");
          expect(tuple.get_field_value(tuple.set.first_name)).to(equal, "Wil");
        });
      });
    }); 

  })
});