require("/specs/spec_helper");

Screw.Unit(function() {
  describe("Set", function() {
    var User;

    before(function() {
      User = new Set(function(s) { with(s) {
        methods({
          foo: function() {
            return "foo";
          },

          bar: function() {
            return "bar";
          }
        });
      }})
    });


    describe("#create", function() {
      it("builds an object with all the methods the #declared_methods of the Set", function() {
        var user = User.create();
        expect(user.foo).to(equal, User.Tuple.prototype.foo)
        expect(user.foo()).to(equal, "foo");

        expect(user.bar).to(equal, User.Tuple.prototype.bar)
        expect(user.bar()).to(equal, "bar");
      });
    });
  });
})