require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("Domain", function() {
    describe("#define_set", function() {
      it("instantiates a June.Set and assigns it to the given name on the Domain", function() {
        var domain = new June.Domain();
        domain.define_set("Foo", function(c) { with(c) {
          attributes({
            bar: "string",
            baz: "string"
          });
        }});
        
        expect(domain.Foo.constructor).to(equal, June.Set);
        expect(domain.Foo.bar.constructor).to(equal, June.Attribute);
      });
    });

    describe("#update", function() {
      context("when the snapshot contains a tuple that is not in the Domain", function() {
        var snapshot;
        before(function() {
          snapshot = {
            "User": {
              "bill": {
                id: "bill",
                first_name: "Bill",
                age: 53,
                dob: 1238022403679
              }
            }
          };
          expect(User.find("bill")).to(be_null);
        });

        it("inserts the new tuples into the appropriate Sets", function() {
          FixtureDomain.update(snapshot);
          var user = User.find("bill");
          expect(user).to_not(be_null);
          expect(user.id()).to(equal, "bill");
          expect(user.first_name()).to(equal, "Bill");
          expect(user.age()).to(equal, 53);
          expect(user.dob()).to(equal, new Date(1238022403679));
        });
      });

      context("when the snapshot does not contain tuples that are in the Domain", function() {
      });

      context("when the snapshot contains a tuple that is in the Domain", function() {
        context("when the tuple has the same Attribute values", function() {

        });
        context("when the tuple has a different Attribute value", function() {

        });
      });
    });
  });
}});