require("/specs/june_spec_helper");

Screw.Unit(function() {
  describe("Set", function() {
    var User;

    before(function() {
      User = new Set(function(configuration) {
        with(configuration) {
          attributes({
            'first_name': 'string',
            'age': 'integer'
          });

          methods({
            foo: function() {
              return "foo";
            },

            bar: function() {
              return "bar";
            }
          });
        }
      })
    });

    describe("metaprogrammatic declarations", function() {
      var tuple;
      before(function() {
        tuple = User.create();
      });

      describe(".attributes", function() {
        it("associates an Attribute object with a named field on the Set for each declared attribute with the given name and type", function() {
          first_name_attribute = User.first_name
          expect(first_name_attribute.constructor).to(equal, Attribute);
          expect(first_name_attribute.name).to(equal, 'first_name');
          expect(first_name_attribute.type).to(equal, 'string');
          expect(first_name_attribute.set).to(equal, User);
        });

        it("creates an accessor method for each declared attribute", function() {
          tuple.first_name("Jan");
          console.debug(tuple.fields);
          expect(tuple.first_name()).to(equal, "Jan");
        });
      });

      describe(".methods", function() {
        it("associates methods with the prototype of the Set's Tuple constructor", function() {
          expect(tuple.foo).to(equal, User.Tuple.prototype.foo);
          expect(tuple.bar).to(equal, User.Tuple.prototype.bar);
        });
      });
    });

    describe("#create", function() {
      it("builds an instance of the Set's Tuple constructor", function() {
        var user = User.create();
        expect(user.constructor).to(equal, User.Tuple);
      });
    });
  });
})