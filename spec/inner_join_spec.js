require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("InnerJoin", function() {
    var join, left_operand, right_operand, predicate;

    before(function() {
      left_operand = User;
      right_operand = Pet;
      predicate = new Predicates.EqualTo(User.id, Pet.owner_id);
      join = new InnerJoin(left_operand, right_operand, predicate);
    });

    describe("#tuples", function() {
      it("includes all CompoundTuples in the cartesean product of the #tuples of the operands that match #predicate", function() {
        var tuples = join.tuples();
        expect(tuples).to_not(be_empty);
        jQuery.each(tuples, function() {
          expect(predicate.evaluate(this)).to(equal, true);
        });
      });
    });
  });
}});