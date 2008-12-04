require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("Selection", function() {
    var selection, operand, predicate;

    before(function() {
      operand = User;
      predicate = new Predicates.EqualTo(User.age, 21);
      selection = new Selection(operand, predicate);
    });

    describe("#tuples", function() {
      it("returns only the #tuples of #operand that match #predicate", function() {
        var expected_tuples = [];
        var operand_tuples = operand.tuples();

        for (var i = 0; i < operand_tuples.length; i++) {
          var tuple = operand_tuples[i];
          if (predicate.evaluate(tuple)) {
            expected_tuples.push(tuple);
          }
        }

        expect(expected_tuples).to_not(be_empty);
        expect(selection.tuples()).to(equal, expected_tuples);
      });
    });
  });
});