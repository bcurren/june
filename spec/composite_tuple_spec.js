require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("CompositeTuple", function() {
    var composite_tuple, left, right;

    before(function() {
      left = User.find("dan");
      right = Pet.find("fido");
      composite_tuple = new CompositeTuple(left, right);
      console.debug(composite_tuple)
    });

    describe("#get_field_value", function() {
      describe("given an attribute of the left tuple", function() {
        it("delegates to the left tuple", function() {
          expect(composite_tuple.get_field_value(User.first_name)).to(equal, left.first_name());
        });
      });

      describe("given an attribute of the right tuple", function() {
        it("delegates to the right tuple", function() {
          expect(composite_tuple.get_field_value(Pet.owner_id)).to(equal, right.owner_id());
        });
      });
    });
  });
});