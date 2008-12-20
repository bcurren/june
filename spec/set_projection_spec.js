require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("SetProjection", function() {
    var projection, operand, projected_set;

    before(function() {
      operand = User.join(Pet).on(Pet.owner_id.eq(User.id));
      projected_set = Pet;
      projection = new Projection(operand, projected_set);
    });

    describe("#tuples", function() {
      it("extracts the tuples belonging to the #projected_set from the CompoundTuples in by its #operand", function() {
        var tuples = projection.tuples();
        var expected_tuples = Pet.where(Pet.owner_id.neq(null)).tuples();

        expect(tuples).to(equal, expected_tuples);
      });
    });
  });
});