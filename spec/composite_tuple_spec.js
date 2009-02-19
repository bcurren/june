require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("CompositeTuple", function() {
    var composite_tuple, left, right;

    before(function() {
      left = User.find("dan");
      right = Pet.find("fido");
      composite_tuple = new June.CompositeTuple(left, right);
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


    describe("#tuple_for_set", function() {


      var flat_compound_tuple, deep_compound_tuple_left, deep_compound_tuple_right;
      
      before(function() {
        flat_composite_tuple = new June.CompositeTuple(User.find("bob"), Pet.find("blue"));
        deep_composite_tuple_left = new June.CompositeTuple(new June.CompositeTuple(User.find("bob"), Pet.find("blue")), Species.find("dog"));
        deep_composite_tuple_right = new June.CompositeTuple(User.find("bob"), new June.CompositeTuple(Pet.find("blue"), Species.find("dog")));
      });
      
      describe("when the #left tuple is a member of the given Set", function() {
        it("returns that tuple", function() {
          expect(flat_composite_tuple.tuple_for_set(User)).to(equal, User.find("bob"));
        });
      });

      describe("when the #right tuple is a member of the given Set", function() {
        it("returns that tuple", function() {
          expect(flat_composite_tuple.tuple_for_set(Pet)).to(equal, Pet.find("blue"));
        });
      });

      describe("when the #left CompositeTuple contains a tuple that is a member of the given Set", function() {
        it("returns that tuple", function() {
          expect(deep_composite_tuple_left.tuple_for_set(Pet)).to(equal, Pet.find("blue"));
        });
      });

      describe("when the #right CompositeTuple contains a tuple that is a member of the given Set", function() {
        it("returns that tuple", function() {
          expect(deep_composite_tuple_right.tuple_for_set(Species)).to(equal, Species.find("dog"));
        });
      });

      describe("when niether the #left nor the #right returns a tuple from #tuple_for_set", function() {
        it("returns null", function() {
          expect(flat_composite_tuple.tuple_for_set(Species)).to(equal, null);
        });
      });
    });
  });
}});