require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("Predicates.EqualTo", function() {
    var predicate;

    describe("#evaluate", function() {
      describe("when #operand_1 is an Attribute and #operand_2 is a constant", function() {
        describe("when passed a Tuple with a field value for the Attribute that =='s the constant", function() {
          before(function() {
            predicate = new Predicates.EqualTo(User.first_name, "Nathan");
          });

          it("returns true", function() {
            expect(predicate.evaluate(User.create({first_name: "Nathan"}))).to(equal, true);
          });
        });

        describe("when passed a Tuple with a field value for the Attribute that !='s the constant", function() {
          before(function() {
            predicate = new Predicates.EqualTo(User.first_name, "Nate");
          });

          it("returns false", function() {
            expect(predicate.evaluate(User.create({first_name: "Nathan"}))).to(equal, false);
          });
        });
      });

      describe("when #operand_1 is a constant and #operand_2 is an Attribute", function() {
        describe("when passed a Tuple with a field value for the Attribute that =='s the constant", function() {
          before(function() {
            predicate = new Predicates.EqualTo("Nathan", User.first_name);
          });

          it("returns true", function() {
            expect(predicate.evaluate(User.create({first_name: "Nathan"}))).to(equal, true);
          });
        });

        describe("when passed a Tuple with a field value for the Attribute that !='s the constant", function() {
          before(function() {
            predicate = new Predicates.EqualTo("Nate", User.first_name);
          });

          it("returns false", function() {
            expect(predicate.evaluate(User.create({first_name: "Nathan"}))).to(equal, false);
          });
        });
      });
    });
  });
});