require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("Selection", function() {
    var selection, operand, predicate;

    before(function() {
      operand = User;
      predicate = new June.Predicates.EqualTo(User.age, 21);
      selection = new June.Selection(operand, predicate);
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

    describe("event handling", function() {
      context("when a tuple is inserted into the Set", function() {
        context("when the tuple is inserted in the selection's #operand", function() {
          context("when that tuple matches #predicate", function() {
            it("causes #on_insert handlers to be invoked with the inserted tuple", function() {
//              var inserted_tuples = [];
//              selection.on_insert(function(tuple) {
//                inserted_tuples.push(tuple);
//              });
//
//              tuple = operand.create({id: "mike", age: 33});
//              expect(predicate.evaluate(tuple)).to(be_true);
//
//              expect(inserted_tuples).to(equal, [tuple]);
            });
          });
          context("when that tuple does not match #predicate", function() {
            it("does not cause #on_insert handlers to be invoked with the inserted tuple", function() {

            });
          });
        });

        context("when the tuple is inserted into the Selection by being updated to match the Selection's Predicate", function() {

        })
      });
    });
  });
}});