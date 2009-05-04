require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("Ordering", function() {
    var ordering;
    describe("#all", function() {
      context("when #direction is ascending", function() {
        before(function() {
          ordering = new June.Relations.Ordering(User, User.age, 'asc');
        });

        it("returns #all tuples in #operand, sorted by #attribute in ascending order", function() {
          var expected_tuples = User.all().sort(function(a, b) {
            if (a.age() == b.age()) return 0;
            return (a.age() < b.age()) ? -1 : 1; 
          });
          var expected_ids = June.map(expected_tuples, function() {
            return this.id();
          });
          var actual_ids = June.map(ordering.all(), function() {
            return this.id();
          });

          expect(actual_ids).to(equal, expected_ids);
        });
      });

      context("when #direction is descending", function() {
        before(function() {
          ordering = new June.Relations.Ordering(User, User.age, 'desc');
        });

        it("returns #all tuples in #operand, sorted by #attribute in ascending order", function() {
          var expected_tuples = User.all().sort(function(a, b) {
            if (a.age() == b.age()) return 0;
            return (a.age() < b.age()) ? 1 : -1;
          });
          var expected_ids = June.map(expected_tuples, function() {
            return this.id();
          });
          var actual_ids = June.map(ordering.all(), function() {
            return this.id();
          });

          expect(actual_ids).to(equal, expected_ids);
        });
      });
    });
  });
}});