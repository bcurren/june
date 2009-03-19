require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("SetProjection", function() {
    var projection, operand, projected_set;

    before(function() {
      operand = User.join(Pet).on(Pet.owner_id.eq(User.id));
      projected_set = Pet;
      projection = new June.SetProjection(operand, projected_set);
    });

    describe("#tuples", function() {
      it("extracts the tuples belonging to the #projected_set from the CompoundTuples in by its #operand", function() {
        var t = operand.tuples()[0];
        var expected_tuples = Pet.where(Pet.owner_id.neq(null)).tuples();
        var tuples = projection.tuples();

        expect(tuples).to(equal, expected_tuples);
      });
    });

    describe("#on_insert", function() {
      it("returns a Subscription with #on_insert_node as its #node", function() {
        var subscription = projection.on_insert(function() {});
        expect(subscription.node).to(equal, projection.on_insert_node);
      });
    });

    describe("#on_remove", function() {
      it("returns a Subscription with #on_remove_node as its #node", function() {
        var subscription = projection.on_remove(function() {});
        expect(subscription.node).to(equal, projection.on_remove_node);
      });
    });

    describe("#on_update", function() {
      it("returns a Subscription with #on_update_node as its #node", function() {
        var subscription = projection.on_update(function() {});
        expect(subscription.node).to(equal, projection.on_update_node);
      });
    });

    describe("#has_subscribers", function() {
      context("if a handler has been registered with #on_insert", function() {
        it("returns true", function() {
          projection.on_insert(function() {});
          expect(projection.has_subscribers()).to(be_true);
        });
      });

      context("if a handler has been registered with #on_remove", function() {
        it("returns true", function() {
          projection.on_remove(function() {});
          expect(projection.has_subscribers()).to(be_true);
        });
      });

      context("if a handler has been registered with #on_update", function() {
        it("returns true", function() {
          projection.on_update(function() {});
          expect(projection.has_subscribers()).to(be_true);
        });
      });

      context("if no handlers have been registered", function() {
        it("returns false", function() {
          expect(projection.has_subscribers()).to(be_false);
        });
      });
    });
    
    describe("event handling", function() {
      var insert_handler, remove_handler, update_handler, tuple;
      before(function() {
        projected_set = User;
        projection = new June.SetProjection(operand, projected_set);

        insert_handler = mock_function();
        insert_handler.function_name = "insert handler";
        projection.on_insert(insert_handler);

        remove_handler = mock_function();
        remove_handler.function_name = "remove handler";
        projection.on_remove(remove_handler);

        update_handler = mock_function();
        update_handler.function_name = "update handler";
        projection.on_update(update_handler);
      });

      context("when a CompositeTuple is inserted in the Projection's #operand", function() {
        context("when the projected tuple is already a member of #tuples", function() {
          it("does not trigger #on_insert handlers", function() {
            Pet.create({owner_id: "bob"});
            expect(insert_handler).to_not(have_been_called);
          });

          it("does not modify #tuples", function() {
            var num_tuples_before_insert = projection.tuples().length;
            Pet.create({owner_id: "bob"});
            expect(projection.tuples().length).to(equal, num_tuples_before_insert);
          });
        });

        context("when the tuple corresponding to #projected_set is NOT a member of the Projection's #tuples", function() {
          var petless_user;

          before(function() {
            petless_user = User.find("alice");
            expect(petless_user.pets()).to(be_empty);
          });

          it("triggers #on_insert handlers with the projected tuple", function() {
            Pet.create({owner_id: petless_user.id()});
            expect(insert_handler).to(have_been_called, once);
            expect(insert_handler).to(have_been_called, with_args(petless_user));
          });

          it("adds the projected to #tuples before #on_insert handlers are triggered", function() {
            projection.on_insert(function(tuple) {
              expect(projection.contains(tuple)).to(be_true);
            });
            Pet.create({owner_id: petless_user.id()});
          });
        });
      });

      context("when a CompositeTuple is removed from the Projection's #operand", function() {
        context("when #operand contains another CompositeTuple with the same projected tuple", function() {
          var pet;
          before(function() {
            var user = User.find("bob");
            pet = Pet.create({owner_id: "bob"});
            expect(user.pets().length).to(be_gt, 1);
          });

          it("does not trigger #on_remove handlers", function() {
            Pet.remove(pet);
            expect(remove_handler).to_not(have_been_called);
          });

          it("does not modify #tuples", function() {
            var num_tuples_before_remove = projection.tuples().length;
            Pet.remove(pet);
            expect(projection.tuples().length).to(equal, num_tuples_before_remove);
          });
        });

        context("when #operand contains no other CompositeTuples with the same projected tuple", function() {
          var user, pet;
          before(function() {
            user = User.find("bob")
            expect(user.pets().length).to(equal, 1);
            pet = Pet.find("blue");
            expect(pet.owner_id()).to(equal, "bob");
          });

          it("triggers #on_remove handlers with the projected tuple", function() {
            Pet.remove(pet);

            expect(remove_handler).to(have_been_called, once);
            expect(remove_handler).to(have_been_called, with_args(user));
          });

          it("removes the projected tuple from #tuples before #on_remove handlers are triggered", function() {
            projection.on_remove(function(tuple) {
              expect(projection.contains(tuple)).to(be_false);
            });
            Pet.remove(pet);            
          });
        });
      });

      context("when a tuple in the Projection's #operand is updated", function() {
        context("when the tuple that was updated corresponds to #projected_set", function() {
          it("triggers #on_update handlers with the projected tuple", function() {

          });

          it("does not modify #tuples", function() {

          });
        });

        context("when the tuple that was updated does NOT correspond to #projected_set", function() {
          it("does NOT trigger #on_update handlers with the projected tuple", function() {

          });

          it("does not modify #tuples", function() {

          });
        });
      });
    });
  });
}});