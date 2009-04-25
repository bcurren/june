require("/specs/june_spec_helper");

Screw.Unit(function(c) { with(c) {
  describe("Field", function() {
    var field;
    before(function() {
      field = User.find("bob").fields.first_name;
    });

    
    describe("#set_value", function() {
      it("calls #attribute.convert on the value before it is set", function() {
        var convert_args = [];
        field.attribute.convert = function(arg) {
          convert_args.push(arg);
          return arg + "'";
        }
        
        field.set_value("foo");
        expect(convert_args).to(equal, ["foo"]);
        expect(field.value).to(equal, "foo'");
      });
    });
    
    describe("#on_update", function() {
      it("returns a Subscription that is triggered with the new and old values when the field is updated", function() {
        var update_callback = mock_function("update callback", function(new_value, old_value) {
          expect(field.get_value()).to(equal, new_value);
        });
        var subscription = field.on_update(update_callback);
        field.set_value("foo");
        expect(update_callback).to(have_been_called, with_args("foo", "Bob"));
        field.set_value("bar");
        expect(update_callback).to(have_been_called, with_args("bar", "foo"));
        subscription.destroy();
        field.set_value("baz");
        expect(update_callback).to_not(have_been_called, with_args("baz", "bar"));
      });
    });
  });
}});
    