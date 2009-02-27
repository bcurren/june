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
      var insert_handler;
      before(function() {
        insert_handler = mock_function();
        insert_handler.function_name = "insert handler";
        selection.on_insert(insert_handler);
      });

      context("when a tuple is inserted in the Selection's #operand", function() {
        context("when that tuple matches #predicate", function() {
          it("causes #on_insert handlers to be invoked with the inserted tuple", function() {
            tuple = operand.create({id: "mike", age: 21});
            expect(predicate.evaluate(tuple)).to(be_true);
            
            expect(insert_handler).to(have_been_called, with_args(tuple));
          });
        });

        context("when that tuple does not match #predicate", function() {
          it("does not cause #on_insert handlers to be invoked with the inserted tuple", function() {
            tuple = operand.create({id: "mike", age: 22});
            expect(predicate.evaluate(tuple)).to(be_false);

            expect(insert_handler).to_not(have_been_called);
          });
        });
      });

      context("when a tuple in the Selection's #operand is updated", function() {
        var tuple;

        context("when that tuple matched #predicate before the update", function() {
          context("when that tuple matches #predicate after the update", function() {
            it("does not cause #on_insert handlers to be invoked with the updated tuple", function() {
            });
          });

          context("when that tuple does not match #predicate after the update", function() {

          });
        });

        context("when that tuple did not match #predicate before the update", function() {
          before(function() {
            tuple = operand.find("alice");
            expect(predicate.evaluate(tuple)).to(be_false);
          });

          context("when that tuple matches #predicate after the update", function() {
            it("causes #on_insert handlers to be invoked with the updated tuple", function() {
              tuple.age(21);
              expect(predicate.evaluate(tuple)).to(be_true);
              
//              expect(insert_handler).to(have_been_called);
            });
          });

          context("when that tuple does not match #predicate after the update", function() {
            it("does not cause #on_insert handlers to be invoked with the updated tuple", function() {
            });
          });
        });
      });
    });
  });
}});