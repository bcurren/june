require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("Attribute", function() {
    describe("#eq", function() {
      it("returns an EqualTo predicate", function() {
        var predicate = User.id.eq("nathan");
        expect(predicate.constructor).to(equal, Predicates.EqualTo);
        expect(predicate.operand_1).to(equal, User.id);
        expect(predicate.operand_2).to(equal, "nathan");
      });
    });

    describe("#neq", function() {
      it("returns a NotEqualTo predicate", function() {
        var predicate = User.id.neq("nathan");
        expect(predicate.constructor).to(equal, Predicates.NotEqualTo);
        expect(predicate.operand_1).to(equal, User.id);
        expect(predicate.operand_2).to(equal, "nathan");
      });
    });
    
  });
});