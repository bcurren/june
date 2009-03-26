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
      it("calls #update on every Set indicated by the given snapshot with its corresponding snapshot fragment", function() {
        var snapshot = {
          'User': {
            'bob': {
              first_name: "Babak"
            }
          },

          Pet: {
            'blue': {
              name: "Red"
            }
          }
        }

        mock(User, 'update');
        mock(Pet, 'update');
        mock(Species, 'update');

        FixtureDomain.update(snapshot);

        expect(User.update).to(have_been_called, once);
        expect(User.update).to(have_been_called, with_args(snapshot['User']));
        expect(Pet.update).to(have_been_called, once);
        expect(Pet.update).to(have_been_called, with_args(snapshot['Pet']));
        expect(Species.update).to_not(have_been_called);
      });
    });
  });
}});