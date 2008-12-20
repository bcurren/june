require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("All relations", function() {
    describe("#join(:left).on(:right)", function() {
      it("builds an InnerJoin ", function() {
        var predicate = Pet.owner_id.eq(User.id);
        var inner_join = User.join(Pet).on(predicate);
        expect(inner_join.left_operand).to(equal, User);
        expect(inner_join.right_operand).to(equal, Pet);
        expect(inner_join.predicate).to(equal, predicate);
      });
    });
  });
});