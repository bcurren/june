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

    describe("#on_insert", function() {
      it("returns a Subscription with #on_insert_node as its #node", function() {
        var subscription = selection.on_insert(function() {});
        expect(subscription.node).to(equal, selection.on_insert_node);
      });
    });

    describe("#on_remove", function() {
      it("returns a Subscription with #on_remove_node as its #node", function() {
        var subscription = selection.on_remove(function() {});
        expect(subscription.node).to(equal, selection.on_remove_node);
      });
    });

    describe("#on_update", function() {
      it("returns a Subscription with #on_update_node as its #node", function() {
        var subscription = selection.on_update(function() {});
        expect(subscription.node).to(equal, selection.on_update_node);
      });
    });

    describe("#has_subscribers", function() {
      context("if a handler has been registered with #on_insert", function() {
        it("returns true", function() {
          selection.on_insert(function() {});
          expect(selection.has_subscribers()).to(be_true);
        });
      });

      context("if a handler has been registered with #on_remove", function() {
        it("returns true", function() {
          selection.on_remove(function() {});
          expect(selection.has_subscribers()).to(be_true);
        });
      });

      context("if a handler has been registered with #on_update", function() {
        it("returns true", function() {
          selection.on_update(function() {});
          expect(selection.has_subscribers()).to(be_true);
        });
      });

      context("if no handlers have been registered", function() {
        it("returns false", function() {
          expect(selection.has_subscribers()).to(be_false);
        });
      });
    });

    describe("event handling", function() {
      var insert_handler, remove_handler, update_handler;
      before(function() {
        insert_handler = mock_function();
        insert_handler.function_name = "insert handler";
        selection.on_insert(insert_handler);

        remove_handler = mock_function();
        remove_handler.function_name = "remove handler";
        selection.on_remove(remove_handler);

        update_handler = mock_function();
        update_handler.function_name = "update handler";
        selection.on_update(update_handler);
      });

      context("when a tuple is inserted in the Selection's #operand", function() {
        context("when that tuple matches #predicate", function() {
          it("triggers #on_insert handlers with the inserted tuple", function() {
            tuple = operand.create({id: "mike", age: 21});
            expect(predicate.evaluate(tuple)).to(be_true);
            
            expect(insert_handler).to(have_been_called, with_args(tuple));
          });

          it("#contains the inserted tuple before #on_insert handlers are triggered", function() {
            selection.on_insert(function(tuple) {
              expect(selection.contains(tuple)).to(be_true);
            });

            expect(selection.contains(tuple)).to(be_false);
            tuple = operand.create({id: "mike", age: 21});
          });
        });

        context("when that tuple does not match #predicate", function() {
          it("does not trigger #on_insert handlers", function() {
            tuple = operand.create({id: "mike", age: 22});
            expect(predicate.evaluate(tuple)).to(be_false);

            expect(insert_handler).to_not(have_been_called);
          });
        });
      });

      context("when a tuple in the Selection's #operand is updated", function() {
        var tuple;

        context("when that tuple matched #predicate before the update", function() {
          before(function() {
            tuple = operand.find("dan");
            expect(predicate.evaluate(tuple)).to(be_true);
          });

          context("when that tuple matches #predicate after the update", function() {
            it("does not trigger #on_insert handlers", function() {
              tuple.first_name("Danny");
              expect(predicate.evaluate(tuple)).to(be_true);
              expect(insert_handler).to_not(have_been_called);
            });

            it("does not trigger #on_remove handlers", function() {
              tuple.first_name("Danny");
              expect(predicate.evaluate(tuple)).to(be_true);
              expect(remove_handler).to_not(have_been_called);
            });

            it("triggers #on_update handlers with the updated tuple", function() {
              tuple.first_name("Danny");
              expect(predicate.evaluate(tuple)).to(be_true);
              expect(update_handler).to(have_been_called, with_args(tuple));
            });

            it("continues to #contain the tuple", function() {
              expect(selection.contains(tuple)).to(be_true);
              tuple.first_name("Danny");
              expect(selection.contains(tuple)).to(be_true);
            });
          });

          context("when that tuple does not match #predicate after the update", function() {
            it("does not trigger #on_insert handlers", function() {
              tuple.age(34);
              expect(predicate.evaluate(tuple)).to(be_false);
              expect(insert_handler).to_not(have_been_called);
            });

            it("triggers #on_remove handlers to be invoked with the updated tuple", function() {
              tuple.age(34);
              expect(predicate.evaluate(tuple)).to(be_false);
              expect(remove_handler).to(have_been_called);
            });

            it("does not trigger #on_update handlers", function() {
              tuple.age(34);
              expect(predicate.evaluate(tuple)).to(be_false);
              expect(update_handler).to_not(have_been_called);
            });

            it("does not #contain the updated tuple before the #on_remove handlers are triggered", function() {
              selection.on_remove(function() {
                expect(selection.contains(tuple)).to(be_false);
              })

              expect(selection.contains(tuple)).to(be_true);
              tuple.age(34);
            });
          });
        });

        context("when that tuple did not match #predicate before the update", function() {
          before(function() {
            tuple = operand.find("alice");
            expect(predicate.evaluate(tuple)).to(be_false);
          });

          context("when that tuple matches #predicate after the update", function() {
            it("triggers #on_insert handlers with the updated tuple", function() {
              tuple.age(21);
              expect(predicate.evaluate(tuple)).to(be_true);
              expect(insert_handler).to(have_been_called);
            });

            it("does not trigger #on_remove handlers", function() {
              tuple.age(21);
              expect(predicate.evaluate(tuple)).to(be_true);
              expect(remove_handler).to_not(have_been_called);
            });

            it("does not trigger #on_update handlers", function() {
              tuple.age(21);
              expect(predicate.evaluate(tuple)).to(be_true);
              expect(update_handler).to_not(have_been_called);
            });

            it("#contains the tuple before #on_insert handlers are fired", function() {
              selection.on_insert(function(tuple) {
                expect(selection.contains(tuple)).to(be_true);
              })

              expect(selection.contains(tuple)).to(be_false);
              tuple.age(21);
            });
          });

          context("when that tuple does not match #predicate after the update", function() {
            it("does not cause #on_insert handlers to be invoked with the updated tuple", function() {
              tuple.first_name("Danny");
              expect(predicate.evaluate(tuple)).to(be_false);
              expect(insert_handler).to_not(have_been_called);
            });

            it("does not cause #on_remove handlers to be invoked with the updated tuple", function() {
              tuple.first_name("Danny");
              expect(predicate.evaluate(tuple)).to(be_false);
              expect(remove_handler).to_not(have_been_called);
            });
            
            it("does not trigger #on_update handlers", function() {
              tuple.first_name("Danny");
              expect(predicate.evaluate(tuple)).to(be_false);
              expect(update_handler).to_not(have_been_called);
            });

            it("continues to not #contain the tuple", function() {
              expect(selection.contains(tuple)).to(be_false);
              tuple.first_name("Danny");
              expect(selection.contains(tuple)).to(be_false);
            });
          });
        });
      });
    });

    describe("subscription propagation", function() {
      describe("#on_insert subscriptions", function() {
        describe("when an #on_insert subscription is registered", function() {
          context("when this is the first subscription", function() {
            before(function() {
              expect(selection.has_subscribers()).to(be_false);
            });

            it("subscribes #on_insert and #on_update on #operand", function() {
              mock(operand, 'on_insert');
              mock(operand, 'on_update');

              selection.on_insert(function() {});

              expect(operand.on_insert).to(have_been_called);
              expect(operand.on_update).to(have_been_called);
            });
          });

          context("when this is not the first subscription", function() {
            before(function() {
              selection.on_insert(function() {});
            });

            it("does not subscribe to #operand", function() {
              mock(operand, 'on_insert');
              mock(operand, 'on_update');

              selection.on_insert(function() {});

              expect(operand.on_insert).to_not(have_been_called);
              expect(operand.on_update).to_not(have_been_called);
            });
          });
        });

        describe("when an #on_insert subscription is destroyed", function() {
          var subscription;
          before(function() {
            subscription = selection.on_insert(function() {});
          });

          context("when it is the last subscription to be destroyed", function() {
            it("destroys the #on_insert and #on_update subscriptions on #operand", function() {
              expect(selection.operand_subscriptions).to_not(be_empty);
              jQuery.each(selection.operand_subscriptions, function() {
                mock(this, 'destroy');
              });

              subscription.destroy();

              jQuery.each(selection.operand_subscriptions, function() {
                expect(this.destroy).to(have_been_called);
              });
              expect(selection.operand_subscriptions).to(be_empty);
            });
          });

          context("when it is not the last subscription to be destroyed", function() {
            before(function() {
              selection.on_insert(function() {});
            });

            it("does not destroy the #on_insert and #on_update subscriptions on #operand", function() {
              expect(selection.operand_subscriptions).to_not(be_empty);
              jQuery.each(selection.operand_subscriptions, function() {
                mock(this, 'destroy');
              });

              subscription.destroy();

              jQuery.each(selection.operand_subscriptions, function() {
                expect(this.destroy).to_not(have_been_called);
              });
              expect(selection.operand_subscriptions).to_not(be_empty);
            });
          });
        });
      });

      describe("#on_remove subscriptions", function() {
        describe("when an #on_remove subscription is registered", function() {
          context("when this is the first subscription", function() {
            before(function() {
              expect(selection.has_subscribers()).to(be_false);
            });

            it("subscribes #on_remove and #on_update on #operand", function() {
              mock(operand, 'on_insert');
              mock(operand, 'on_update');

              selection.on_remove(function() {});

              expect(operand.on_insert).to(have_been_called);
              expect(operand.on_update).to(have_been_called);
            });
          });

          context("when this is not the first subscription", function() {
            before(function() {
              selection.on_remove(function() {});
            });

            it("does not subscribe to #operand", function() {
              mock(operand, 'on_remove');
              mock(operand, 'on_update');

              selection.on_remove(function() {});

              expect(operand.on_remove).to_not(have_been_called);
              expect(operand.on_update).to_not(have_been_called);
            });
          });
        });

        describe("when an #on_remove subscription is destroyed", function() {
          var subscription;
          before(function() {
            subscription = selection.on_remove(function() {});
          });

          context("when it is the last subscription to be destroyed", function() {
            it("destroys the #on_remove and #on_update subscriptions on #operand", function() {
              expect(selection.operand_subscriptions).to_not(be_empty);
              jQuery.each(selection.operand_subscriptions, function() {
                mock(this, 'destroy');
              });

              subscription.destroy();

              jQuery.each(selection.operand_subscriptions, function() {
                expect(this.destroy).to(have_been_called);
              });
              expect(selection.operand_subscriptions).to(be_empty);
            });
          });

          context("when it is not the last subscription to be destroyed", function() {
            before(function() {
              selection.on_remove(function() {});
            });

            it("does not destroy the #on_remove and #on_update subscriptions on #operand", function() {
              expect(selection.operand_subscriptions).to_not(be_empty);
              jQuery.each(selection.operand_subscriptions, function() {
                mock(this, 'destroy');
              });

              subscription.destroy();

              jQuery.each(selection.operand_subscriptions, function() {
                expect(this.destroy).to_not(have_been_called);
              });
              expect(selection.operand_subscriptions).to_not(be_empty);
            });
          });
        });
      });
    });
  });
}});