require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("InnerJoin", function() {
    var join, left_operand, right_operand, predicate;

    before(function() {
      left_operand = User;
      right_operand = Pet;
      predicate = new June.Predicates.EqualTo(User.id, Pet.owner_id);
      join = new June.InnerJoin(left_operand, right_operand, predicate);
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


    // TODO: test contains
    // TODO: test has_subscribers
    // TODO: test subscription propagation

    describe("event handling", function() {
      var insert_handler, remove_handler;
      before(function() {
        insert_handler = mock_function();
        insert_handler.function_name = "insert handler";
        join.on_insert(insert_handler);

        remove_handler = mock_function();
        remove_handler.function_name = "remove handler";
        join.on_remove(remove_handler);
      });

      describe("insertion events", function() {
        context("when a tuple is inserted into the left operand", function() {
          context("when the insertion causes #cartesean_product to contain a new CompositeTuple that matches the predicate", function() {
            it("triggers #on_insert handlers with the new CompositeTuple", function() {
              var right_tuple = Pet.create({owner_id: "amy"});
              var left_tuple = User.create({id: "amy"});

              expect(insert_handler).to(have_been_called, once);
              var composite_tuple = insert_handler.most_recent_args[0];
              expect(composite_tuple.left).to(equal, left_tuple);
              expect(composite_tuple.right).to(equal, right_tuple);
            });

            it("#contains the new CompositeTuple before #on_insert handlers are triggered", function() {
              join.on_insert(function(composite_tuple) {
                expect(join.contains(composite_tuple)).to(be_true);
              });

              Pet.create({owner_id: "amy"});
              User.create({id: "amy"});
            });
          });

          context("when the insertion does NOT cause #cartesean_product to contain a new CompositeTuple that matches the predicate", function() {
            it("does not trigger #on_insert handlers", function() {
              User.create({id: "amy"});
              expect(insert_handler).to_not(have_been_called);
            });

            it("does not modify the contents of #tuples", function() {
              var num_tuples_before_insertion = join.tuples().length;
              User.create({id: "amy"});
              expect(join.tuples().length).to(equal, num_tuples_before_insertion);
            });
          });
        });

        context("when a tuple is inserted into the right operand", function() {
          context("when the insertion causes #cartesean_product to contain a new CompositeTuple that matches the predicate", function() {
            it("triggers #on_insert handlers with the new CompositeTuple", function() {
              var left_tuple = User.create({id: "amy"});
              var right_tuple = Pet.create({owner_id: "amy"});

              expect(insert_handler).to(have_been_called, once);
              var composite_tuple = insert_handler.most_recent_args[0];
              expect(composite_tuple.left).to(equal, left_tuple);
              expect(composite_tuple.right).to(equal, right_tuple);
            });

            it("#contains the new CompositeTuple before #on_insert handlers are triggered", function() {
              join.on_insert(function(composite_tuple) {
                expect(join.contains(composite_tuple)).to(be_true);
              });

              User.create({id: "amy"});
              Pet.create({owner_id: "amy"});
            });
          });

          context("when the insertion does NOT cause #cartesean_product to contain a new CompositeTuple that matches the predicate", function() {
            it("does not trigger #on_insert handlers", function() {
              Pet.create({owner_id: "amy"});
              expect(insert_handler).to_not(have_been_called);
            });

            it("does not modify the contents of #tuples", function() {
              var num_tuples_before_insertion = join.tuples().length;
              Pet.create({owner_id: "amy"});
              expect(join.tuples().length).to(equal, num_tuples_before_insertion);
            });
          });
        });
      });

      describe("removal", function() {
        context("when a tuple is removed from the left operand", function() {
          context("when the removal causes the removal of a CompositeTuple from #cartesean_product that matched #predicate", function() {
            it("triggers #on_remove handlers with the removed CompositeTuple", function() {

            });

            it("no longer #contains the removed CompositeTuple before #on_remove handlers are triggered", function() {

            });
          });

          context("when the removal causes the removal of multiple CompositeTuples from #cartesean_product that matched #predicate", function() {
            it("triggers #on_remove handlers with the each of the removed CompositeTuples", function() {

            });

            it("no longer #contains each new CompositeTuple before its corresponding #on_remove handlers are triggered", function() {

            });
          });

          context("when the removal does not cause the removal of any CompositeTuples from #cartesean_product that match #predicate", function() {
            it("does not trigger #on_remove handlers", function() {

            });

            it("does not modify the contents of #tuples", function() {

            });
          });
        });

        context("when a tuple is removed from the right operand", function() {
          // TODO: all the same specs from coverage of the left side
        });
      });
    });
  });
}});